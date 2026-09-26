#!/usr/bin/env python3
"""
Setzt eine neue Versionsnummer an alle eigenen CSS/JS-Dateien in den HTML-Seiten
(z. B. js/kontakt.js?v=20260926-2014). So laden Browser nach einer Änderung sicher
die neuen Dateien statt einer alten Kopie aus dem Zwischenspeicher.

Aufruf (im Projektordner):  python3 tools/version.py
"""
import re, time, pathlib

version = time.strftime("%Y%m%d-%H%M")
root = pathlib.Path(__file__).resolve().parent.parent
pattern = re.compile(r'((?:src|href)="(?:js|css)/[\w.-]+\.(?:js|css))(?:\?v=[\w-]+)?"')

for page in sorted(root.glob("*.html")):
    text = page.read_text(encoding="utf-8")
    new, count = pattern.subn(lambda m: f'{m.group(1)}?v={version}"', text)
    if count:
        page.write_text(new, encoding="utf-8")
        print(f"{page.name}: {count} Dateien → v={version}")
