# nikolajtry.media – Portfolio-Webseite

Portfolio für Fotografie & Videografie. Reines HTML/CSS/JavaScript, ohne Build-Schritt,
läuft kostenlos auf **GitHub Pages**. Funktioniert auf Desktop und Handy.

| Seite | Inhalt |
| --- | --- |
| `index.html` (Start) | Über mich, Leistungen, neuester Instagram-Post, Link-Button zu Fancy Bio, Kontakt |
| `portfolio.html` (Portfolio) | Galerie mit Filter (Alle / Fotografie / Videografie) und Großansicht |
| `impressum.html` | Impressum & Datenschutz (Platzhalter – bitte ausfüllen!) |

## Die wichtigsten Dateien zum Bearbeiten

| Datei | Wofür |
| --- | --- |
| `js/gallery-data.js` | Deine Fotos & Videos im Portfolio |
| `js/config.js` | Instagram-Name und Instagram-Feed |
| `index.html` | Texte der Startseite (Über mich, Leistungen, Kontakt) |
| `images/about.svg` | Dein Portrait für "Über mich" (ersetzen, siehe unten) |
| `css/style.css` | Design – ganz oben bei `:root` kannst du z. B. das Orange (`--orange`) ändern |

## 1. Eigene Bilder ins Portfolio

1. Bilder in den Ordner `images/portfolio/` legen, z. B. `images/portfolio/hochzeit-01.jpg`
   *(Tipp: vorher auf ca. 2000 px Breite verkleinern, als JPG oder WebP – dann lädt die Seite schnell.)*
2. In `js/gallery-data.js` einen Eintrag hinzufügen:

   ```js
   { type: "foto", src: "images/portfolio/hochzeit-01.jpg", title: "Hochzeit am See", category: "Hochzeit" },
   ```
3. Die Platzhalter (`foto-01.svg` …) aus der Liste und dem Ordner löschen.

Mit `featured: true` erscheint ein Bild zusätzlich in der Collage oben auf der Startseite (die ersten 3).

### Videos

Für ein Video brauchst du ein Vorschaubild (`src`) und eine dieser Quellen:

```js
{ type: "video", src: "images/portfolio/reel-vorschau.jpg", title: "Reel", category: "Reel", youtube: "VIDEO-ID" },
{ type: "video", src: "images/portfolio/film.jpg",          title: "Imagefilm", category: "Imagefilm", vimeo: "123456789" },
{ type: "video", src: "images/portfolio/clip.jpg",          title: "Clip", category: "Event", video: "videos/clip.mp4" },
```

YouTube wird im datenschutzfreundlichen „nocookie“-Modus eingebunden. Hochformat-Videos (Reels) werden
automatisch hochkant angezeigt, wenn das Vorschaubild hochkant ist.

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
