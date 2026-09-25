# nikolajtry.media – Portfolio-Webseite

Portfolio für Fotografie & Videografie. Reines HTML/CSS/JavaScript, ohne Build-Schritt,
läuft kostenlos auf **GitHub Pages**. Funktioniert auf Desktop und Handy.

| Seite | Inhalt |
| --- | --- |
| `index.html` (Start) | Über mich, Leistungen, neuester Instagram-Post, Link-Button zu Fancy Bio, Kontakt |
| `portfolio.html` (Portfolio) | Projekt-Übersicht (Shootings) mit Filter → Tippen öffnet das ganze Shooting → Großansicht |
| `impressum.html` | Impressum & Datenschutz (Platzhalter – bitte ausfüllen!) |

## Die wichtigsten Dateien zum Bearbeiten

| Datei | Wofür |
| --- | --- |
| `js/projekte.js` | Deine Projekte/Shootings im Portfolio |
| `js/config.js` | Instagram-Name und Instagram-Feed |
| `index.html` | Texte der Startseite (Über mich, Leistungen, Kontakt) |
| `images/about.svg` | Dein Portrait für "Über mich" (ersetzen, siehe unten) |
| `css/style.css` | Design – ganz oben bei `:root` kannst du z. B. das Orange (`--orange`) ändern |

## 1. Eigene Shootings ins Portfolio

Das Portfolio ist nach **Projekten** aufgebaut: In der Übersicht sieht man pro Shooting ein Cover-Bild.
Tippt man darauf, öffnet sich das Shooting mit allen Bildern (und optional einem Video). Jedes Projekt
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

### Video zu einem Projekt

Ein Projekt kann zusätzlich ein Video haben – es erscheint dann über den Bildern:

```js
youtube: "VIDEO-ID",          // aus youtube.com/watch?v=VIDEO-ID
vimeo: "123456789",           // oder Vimeo
video: "videos/clip.mp4",     // oder eigene Videodatei
vertical: true,               // für Hochformat-Videos (Reels/TikTok)
```

YouTube und Vimeo werden erst geladen, wenn jemand auf „Abspielen“ tippt (datenschutzfreundlich,
YouTube im „nocookie“-Modus).

### Über-mich-Foto

Lege ein Foto von dir als `images/about.jpg` ab und ändere in `index.html` die Zeile
`<img src="images/about.svg" …>` zu `<img src="images/about.jpg" …>`.

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

Fertig – ab dann zeigt die Startseite groß deinen **neuesten Post** (mit Datum und Text) plus
die 4 davor. Neue Posts erscheinen automatisch (je nach Behold-Tarif mit etwas Verzögerung). Ein Klick öffnet den Post direkt auf Instagram. Solange keine Feed-URL eingetragen ist,
erscheint stattdessen eine „Folge mir auf Instagram“-Karte.

Prüfe außerdem in `js/config.js`, ob `username` dein richtiger Instagram-Name ist.

## 3. Online stellen mit GitHub Pages

1. Auf GitHub im Repository auf **Settings → Pages** gehen.
2. Bei *Source* „Deploy from a branch“ wählen, Branch **main** und Ordner **/ (root)** → *Save*.
3. Nach 1–2 Minuten ist die Seite erreichbar unter
   `https://nikolajspnev-bit.github.io/Portfolio_1/`.

Eine eigene Domain (z. B. `nikolajtry.media`) kannst du dort später unter *Custom domain* eintragen.

## 4. Vor dem Veröffentlichen: Impressum

Als Freelancer brauchst du in Deutschland ein Impressum. Fülle in `impressum.html` alle Angaben in
`[eckigen Klammern]` aus und ersetze den Datenschutz-Teil durch eine vollständige Datenschutzerklärung
(z. B. mit dem Generator von e-recht24.de oder datenschutz-generator.de).

## Lokal ansehen

Am besten über einen kleinen lokalen Server (dann funktionieren Schriften und Instagram-Feed wie online):

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

---

Schriften: [Syne](https://gitlab.com/bonjour-monde/fonderie/syne-typeface) und [Inter](https://rsms.me/inter/),
beide unter der SIL Open Font License, lokal eingebunden (keine Verbindung zu Google).
