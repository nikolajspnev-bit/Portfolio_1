#!/usr/bin/env python3
"""
Holt die neuesten Videos des YouTube-Kanals und speichert sie in data/youtube.json.

Läuft automatisch über GitHub Actions (.github/workflows/youtube-feed.yml). Die Startseite
liest danach diese Datei – so hängt der YouTube-Bereich nicht mehr von fremden Diensten ab.

Die Kanal-ID kommt aus js/config.js (youtube.channelId). Schon bekannte Videos bleiben
erhalten, damit auch ältere normale Videos noch da sind, wenn danach viele Shorts kommen.
"""
import json
import pathlib
import re
import sys
import time
import urllib.request
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONFIG = ROOT / "js" / "config.js"
OUT = ROOT / "data" / "youtube.json"
KEEP = 20  # so viele Videos höchstens merken

NS = {
    "atom": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
}


def channel_id():
    text = CONFIG.read_text(encoding="utf-8")
    match = re.search(r"channelId:\s*\"(UC[\w-]{22})\"", text)
    if not match:
        sys.exit("Keine Kanal-ID (UC…) in js/config.js gefunden.")
    return match.group(1)


def fetch(url, tries=5):
    last = None
    for attempt in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Portfolio-Feed)"})
            with urllib.request.urlopen(req, timeout=20) as response:
                return response.read()
        except Exception as error:  # YouTube antwortet gelegentlich mit 404/500 – kurz warten, nochmal
            last = error
            time.sleep(3 * (attempt + 1))
    raise last


def parse(xml_bytes):
    root = ET.fromstring(xml_bytes)
    videos = []
    for entry in root.findall("atom:entry", NS):
        video_id = entry.findtext("yt:videoId", default="", namespaces=NS)
        link = entry.find("atom:link[@rel='alternate']", NS)
        href = link.get("href", "") if link is not None else ""
        if not video_id:
            continue
        is_short = "/shorts/" in href
        videos.append({
            "id": video_id,
            "title": (entry.findtext("atom:title", default="", namespaces=NS) or "").strip(),
            "published": entry.findtext("atom:published", default="", namespaces=NS),
            "url": href or "https://www.youtube.com/watch?v=" + video_id,
            "isShort": is_short,
        })
    return videos


def main():
    cid = channel_id()
    old = {}
    if OUT.exists():
        try:
            old = {v["id"]: v for v in json.loads(OUT.read_text(encoding="utf-8")).get("videos", [])}
        except Exception:
            old = {}
    try:
        fresh = parse(fetch("https://www.youtube.com/feeds/videos.xml?channel_id=" + cid))
    except Exception as error:
        # Seite zeigt dann einfach die zuletzt gespeicherten Videos weiter
        print(f"::warning::YouTube-Feed nicht erreichbar: {error}")
        return
    merged = dict(old)
    for video in fresh:
        merged[video["id"]] = video
    videos = sorted(merged.values(), key=lambda v: v.get("published", ""), reverse=True)[:KEEP]
    data = {"channelId": cid, "videos": videos}
    text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    if OUT.exists() and OUT.read_text(encoding="utf-8") == text:
        print("Keine Änderungen.")
        return
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(text, encoding="utf-8")
    shorts = sum(v["isShort"] for v in videos)
    print(f"{len(videos)} Videos gespeichert ({shorts} davon Shorts). Neuestes: {videos[0]['title'] if videos else '–'}")


if __name__ == "__main__":
    main()
