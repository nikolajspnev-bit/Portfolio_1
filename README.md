# nikolajtry.media – Portfolio-Webseite

Portfolio für Fotografie & Videografie. Reines HTML/CSS/JavaScript, ohne Build-Schritt,
läuft kostenlos auf **GitHub Pages**. Funktioniert auf Desktop und Handy.

| Seite | Inhalt |
| --- | --- |
| `index.html` (Start) | Über mich, Leistungen, neuester Instagram-Post, neueste YouTube-Videos, Link-Button zu Fancy Bio, Kontakt |
| `portfolio.html` (Portfolio) | Projekt-Übersicht (Shootings) mit Filter → Tippen öffnet das ganze Shooting mit Fotos & Videos → Großansicht |
| `impressum.html` | Impressum & Datenschutz (Platzhalter – bitte ausfüllen!) |

## Die wichtigsten Dateien zum Bearbeiten

| Datei | Wofür |
| --- | --- |
| `js/projekte.js` | Deine Projekte/Shootings im Portfolio (Fotos & Videos) |
| `js/config.js` | Instagram- und YouTube-Einstellungen |
| `videos/` | Ordner für eigene Videodateien (MP4) |
| `index.html` | Texte der Startseite (Über mich, Leistungen, Kontakt) |
| `images/about.jpg` | Dein Portrait für "Über mich" |
| `css/style.css` | Design – ganz oben bei `:root` kannst du z. B. das Orange (`--orange`) ändern |

## 1. Eigene Shootings ins Portfolio

Das Portfolio ist nach **Projekten** aufgebaut: In der Übersicht sieht man pro Shooting ein Cover-Bild.
Tippt man darauf, öffnet sich das Shooting mit allen Fotos und Videos. Jedes Projekt
hat einen eigenen Link zum Teilen, z. B. `portfolio.html#/golden-hour`.

So legst du ein neues Shooting an:

1. Ordner anlegen, z. B. `images/portfolio/hochzeit-anna/`
2. Die Bilder hineinlegen und durchnummerieren: `01.jpg`, `02.jpg`, `03.jpg` …
   *(Tipp: vorher auf ca. 2000 px Breite verkleinern, als JPG – dann lädt die Seite schnell.)*
3. In `js/projekte.js` einen Eintrag hinzufügen:

   ```js
   {
     id: "hochzeit-anna",
     title: "Hochzeit Anna & Tom",
     category: "Hochzeit",
     date: "Mai 2026",
     location: "Hamburg",
     description: "Ein kurzer Text zum Shooting.",
     images: bilder("hochzeit-anna", 12),   // lädt 01.jpg bis 12.jpg aus dem Ordner
   },
   ```
4. Die Platzhalter-Projekte (und ihre Ordner in `images/portfolio/`) löschen.

- Das **erste Bild** ist automatisch das Cover. Ein anderes Cover setzt du mit `cover: "images/portfolio/hochzeit-anna/07.jpg"`.
- Aus den **Kategorien** entstehen automatisch die Filter-Buttons über der Übersicht.
- Mit `featured: true` erscheint das Cover zusätzlich in der Collage oben auf der Startseite (die ersten 3).
- Heißen deine Dateien anders, geht auch eine Liste: `images: ["images/portfolio/x/a.jpg", "images/portfolio/x/b.jpg"]`.

### Videos im Portfolio

Jedes Projekt kann beliebig viele Videos haben – sie erscheinen im Shooting unter „Videos“ über den Fotos
und spielen beim Antippen groß ab. Einfach den Link in `videos: [ … ]` eintragen:

```js
{
  id: "festival-2026",
  title: "Festival 2026",
  category: "Event",
  images: bilder("festival-2026", 10),
  videos: [
    "https://www.youtube.com/watch?v=XXXXXXXXXXX",   // YouTube-Video
    "https://youtube.com/shorts/XXXXXXXXXXX",         // YouTube Short → wird automatisch hochkant gezeigt
    "https://vimeo.com/123456789",                     // Vimeo
    "videos/aftermovie.mp4",                            // eigene Datei aus dem Ordner videos/
  ],
},
```

- Ein Projekt darf auch **nur aus Videos** bestehen (dann einfach `images` weglassen).
- Mit mehr Angaben: `{ link: "videos/reel.mp4", cover: "images/portfolio/x/cover.jpg", title: "Mein Reel", vertical: true }`
  – `cover` ist das Vorschaubild (bei YouTube automatisch), `vertical: true` für Hochformat.
- **Tipp:** Lade längere Videos am besten auf YouTube hoch und trage nur den Link ein. Eigene Dateien
  sollten klein sein (als MP4, unter ca. 50 MB – GitHub erlaubt max. 100 MB pro Datei).
- YouTube und Vimeo werden erst geladen, wenn jemand auf „Abspielen“ tippt (YouTube im datenschutzfreundlichen „nocookie“-Modus).
- Die Beispiel-Videos in `videos/` sind nur Platzhalter.

### Über-mich-Foto

Das Portrait liegt unter `images/about.jpg` (Format 4:5, Hochformat). Für ein neues Foto einfach die Datei
mit gleichem Namen ersetzen – am besten vorher auf 4:5 zuschneiden.

## 2. Instagram: immer der neueste Post

Instagram erlaubt es nicht, den Feed ohne Anmeldung direkt auf einer Webseite auszulesen.
Deshalb nutzt die Seite den kostenlosen Dienst **Behold**, der deinen Feed sicher bereitstellt
und sich automatisch aktualisiert:

1. Auf <https://behold.so> kostenlos registrieren.
2. Dein Instagram-Konto verbinden *(dafür muss es ein Business- oder Creator-Konto sein – kann man in der
   Instagram-App unter Einstellungen → Kontotyp kostenlos umstellen)*.
3. Einen neuen Feed vom Typ **JSON** anlegen und die Feed-URL kopieren (sieht aus wie `https://feeds.behold.so/AbC123xyz`).
4. In `js/config.js` eintragen:

   ```js
   feedUrl: "https://feeds.behold.so/AbC123xyz",
   ```

Fertig – ab dann zeigt die Startseite deinen **neuesten Post** (mit Datum und Text) plus die davor.
Das Layout passt sich an die Anzahl an: bei 2–3 Posts stehen alle gleich groß im Hochformat nebeneinander,
ab 5 Posts gibt es einen großen und 4 kleine daneben. Mit `postCount: 3` in `js/config.js` bleibt es
immer bei drei gleich großen Posts. Neue Posts erscheinen automatisch (je nach Behold-Tarif mit etwas Verzögerung). Ein Klick öffnet den Post direkt auf Instagram. Solange keine Feed-URL eingetragen ist,
erscheint stattdessen eine „Folge mir auf Instagram“-Karte.

Prüfe außerdem in `js/config.js`, ob `username` dein richtiger Instagram-Name ist.

## 3. YouTube: immer das neueste Video

Auf der Startseite erscheint automatisch dein **neuestes YouTube-Video** groß (mit Titel und Datum),
daneben die 3 davor. Ein Klick öffnet das Video auf YouTube. Dafür brauchst du nur deine **Kanal-ID**
– kein Konto bei einem anderen Dienst:

1. Deine Kanal-ID finden (beginnt mit `UC…`, ca. 24 Zeichen):
   - am PC: YouTube öffnen → Profilbild → **Einstellungen** → **Erweiterte Einstellungen** → „Kanal-ID“ kopieren
     (direkter Link: <https://www.youtube.com/account_advanced>), **oder**
   - auf deiner Kanalseite unter der Beschreibung auf „…mehr“ → **Kanal teilen** → **Kanal-ID kopieren**.
2. In `js/config.js` bei `youtube` eintragen:

   ```js
   channelId: "UCxxxxxxxxxxxxxxxxxxxxxx",
   ```

Fertig. Neue Videos erscheinen automatisch (mit etwas Verzögerung, meist unter einer Stunde).
Mit `shorts: false` blendest du Shorts aus, mit `videoCount` stellst du die Anzahl ein.
Solange keine Kanal-ID eingetragen ist, erscheint eine „Abonniere meinen YouTube-Kanal“-Karte.

*Technik: Die Seite liest den öffentlichen RSS-Feed deines Kanals über den kostenlosen Dienst rss2json.com.*

## 4. Online stellen mit GitHub Pages

1. Auf GitHub im Repository auf **Settings → Pages** gehen.
2. Bei *Source* „Deploy from a branch“ wählen, Branch **main** und Ordner **/ (root)** → *Save*.
3. Nach 1–2 Minuten ist die Seite erreichbar unter
   `https://nikolajspnev-bit.github.io/Portfolio_1/`.

Eine eigene Domain (z. B. `nikolajtry.media`) kannst du dort später unter *Custom domain* eintragen.

## 5. Vor dem Veröffentlichen: Impressum

Als Freelancer brauchst du in Deutschland ein Impressum. Fülle in `impressum.html` alle Angaben in
`[eckigen Klammern]` aus und ersetze den Datenschutz-Teil durch eine vollständige Datenschutzerklärung
(z. B. mit dem Generator von e-recht24.de oder datenschutz-generator.de).

## Lokal ansehen

Am besten über einen kleinen lokalen Server (dann funktionieren Schriften, Instagram- und YouTube-Feed wie online):

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

---

Schriften: [Syne](https://gitlab.com/bonjour-monde/fonderie/syne-typeface) und [Inter](https://rsms.me/inter/),
beide unter der SIL Open Font License, lokal eingebunden (keine Verbindung zu Google).
