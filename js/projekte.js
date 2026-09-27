/*
 * ============================================================
 *  PORTFOLIO – DEINE PROJEKTE / SHOOTINGS
 * ============================================================
 *  Jedes Projekt erscheint im Portfolio als Kachel (Cover-Bild).
 *  Tippt man darauf, öffnet sich das Shooting mit allen Bildern und Videos.
 *
 *  So legst du ein neues Shooting an:
 *  1. Ordner anlegen:  images/portfolio/<name>/   (z. B. images/portfolio/hochzeit-anna/)
 *  2. Bilder hineinlegen und durchnummerieren: 01.jpg, 02.jpg, 03.jpg …
 *  3. Unten einen Eintrag hinzufügen – z. B.:
 *
 *     {
 *       id: "hochzeit-anna",
 *       title: "Hochzeit Anna & Tom",
 *       category: "Event",
 *       date: "Mai 2026",
 *       location: "Hamburg",
 *       description: "Ein kurzer Text zum Shooting.",
 *       images: bilder("hochzeit-anna", 12),   // lädt 01.jpg bis 12.jpg aus dem Ordner
 *     },
 *
 *  Felder:
 *    id           kurzer Name ohne Leerzeichen (wird Teil des Links: portfolio.html#/hochzeit-anna)
 *    title        Titel des Projekts
 *    category     z. B. "Portrait", "Event", "Produkt", "Unternehmen", "Automotive", "Social Media", "Analog", "Fuji X-E5"
 *                 – daraus entstehen automatisch die Filter-Buttons im Portfolio
 *    date         optional, z. B. "Mai 2026"
 *    location     optional, z. B. "Berlin" oder "Studio"
 *    description  optional, kurzer Text zum Projekt
 *    cover        optional, Cover-Bild der Kachel (sonst wird das erste Bild genommen)
 *    featured     true = Cover erscheint in der Collage auf der Startseite (die ersten 3)
 *    images       die Bilder des Shootings (optional bei reinen Video-Projekten) – mit bilder("ordner", anzahl)
 *                 oder als Liste: ["images/portfolio/x/a.jpg", "images/portfolio/x/b.jpg"]
 *
 *  VIDEOS (optional) – beliebig viele pro Projekt, einfach den Link einfügen:
 *
 *     videos: [
 *       "https://www.youtube.com/watch?v=XXXXXXXXXXX",   // YouTube-Video
 *       "https://youtube.com/shorts/XXXXXXXXXXX",         // YouTube Short (wird hochkant gezeigt)
 *       "https://vimeo.com/123456789",                     // Vimeo
 *       "videos/aftermovie.mp4",                            // eigene Datei aus dem Ordner videos/
 *     ],
 *
 *     Mit mehr Angaben geht es auch so:
 *       { link: "videos/reel.mp4", cover: "images/portfolio/x/cover.jpg", title: "Mein Reel", vertical: true }
 *       cover     Vorschaubild (bei YouTube automatisch, bei eigenen Dateien empfohlen)
 *       title     Titel des Videos
 *       vertical  true = Hochformat (Reel/TikTok)
 *
 *     Tipp: Große Videos besser auf YouTube hochladen und nur den Link eintragen –
 *     eigene Dateien sollten klein sein (unter ca. 50 MB).
 *
 *  FUJI-REZEPTE (optional) – das Projekt wird zum "Ordner": pro Rezept eine Kachel,
 *  jedes Rezept hat eine eigene Seite mit Einstellungen, "Rezept kopieren" und Bildern:
 *
 *     rezepte: [
 *       {
 *         name: "Kodak Portra 400",
 *         favorit: true,                                            // optional: ★ Lieblingsrezept, steht immer zuerst
 *         hinweis: "Warm, weich – perfekt für Golden Hour",      // optional
 *         einstellungen: {
 *           "Filmsimulation": "Classic Negative",
 *           "Weißabgleich": "Auto, +2 Rot / −4 Blau",
 *           // … beliebig viele Zeilen, Reihenfolge wie hier
 *         },
 *         images: bilder("fuji-rezepte/portra-400", 6),        // Ordner images/portfolio/fuji-rezepte/portra-400/
 *       },
 *     ],
 *
 *  Reihenfolge hier = Reihenfolge auf der Seite (am besten neuestes Projekt oben).
 */

// Hilfsfunktion: bilder("ordner", 8) → 01.jpg bis 08.jpg aus images/portfolio/ordner/
function bilder(ordner, anzahl, endung) {
  var liste = [];
  for (var i = 1; i <= anzahl; i++) {
    liste.push("images/portfolio/" + ordner + "/" + (i < 10 ? "0" + i : i) + "." + (endung || "jpg"));
  }
  return liste;
}

// Ab "golden-hour" sind die Projekte PLATZHALTER – ersetze sie nach und nach durch deine eigenen Shootings.
// (Deren Ordner in images/portfolio/… und videos/ enthalten nur Platzhalter-Dateien.)
window.PROJECTS = [
  {
    id: "e30-e28-schwarzwald",
    title: "E30 und E28 - Ausfahrt durch den Schwarzwald",
    category: "Automotive",
    location: "Schwarzwald",
    description: "Zwei BMW-Klassiker auf Tour: Rolling Shots auf kurvigen Landstraßen, ein Stopp im Wald und jede Menge Details – von der Heizclub-Front bis zu den goldenen Alpina-Felgen.",
    featured: true,
    images: bilder("e30-e28-schwarzwald", 14),
  },
  {
    id: "talhof-beising",
    title: "TalHof - Beising",
    category: "Unternehmen",
    date: "2026",
    description: "Erntezeit auf dem TalHof Beising – Traktor und Mähdrescher im Einsatz, festgehalten im warmen Gegenlicht.",
    featured: true,
    images: bilder("talhof-beising", 5),
  },
  {
    // Fuji X-E5 Rezepte – ein Eintrag pro Rezept (Anleitung in README.md)
    id: "fuji-x-e5-rezepte",
    title: "Fuji X-E5 Rezepte",
    category: "Fuji X-E5",
    description: "Direkt aus der Kamera: JPEGs mit meinen Film-Rezepten auf der Fujifilm X-E5 – ohne Nachbearbeitung.",
    rezepte: [
      {
        name: "Ilford HP5 Plus",
        hinweis: "Körniges Schwarz-Weiß mit weichen Lichtern und tiefen Schatten.",
        // Einstellungen folgen, sobald die Original-JPEGs (mit Metadaten) ausgelesen sind.
        // Solange die Liste leer ist, blendet die Seite den Einstellungs-Block einfach aus.
        einstellungen: {},
        images: bilder("fuji-rezepte/ilford-hp5-plus", 6),
      },
    ],
  },
  {
    id: "golden-hour",
    title: "Golden Hour Portrait",
    category: "Portrait",
    date: "2026",
    location: "Outdoor",
    description: "Portrait-Shooting zur goldenen Stunde – warmes Licht, natürliche Posen und ganz viel Atmosphäre.",
    featured: true,
    images: bilder("golden-hour", 8, "svg"),
  },
  {
    id: "sommer-festival",
    title: "Sommer Festival",
    category: "Event",
    date: "2026",
    location: "Open Air",
    description: "Aftermovie und Fotos vom Festival – die Energie der Menge, Lichter und die besten Momente auf und vor der Bühne.",
    videos: [
      // Platzhalter-Video – ersetze es z. B. durch "https://www.youtube.com/watch?v=…"
      { link: "videos/festival-aftermovie.mp4", cover: "images/portfolio/sommer-festival/video-cover.jpg", title: "Aftermovie" },
    ],
    featured: true,
    images: bilder("sommer-festival", 7, "svg"),
  },
  {
    id: "business-shooting",
    title: "Business Shooting",
    category: "Unternehmen",
    date: "2026",
    location: "Office",
    description: "Team- und Mitarbeiterfotos für Website, LinkedIn und Presse – professionell, aber nahbar.",
    images: bilder("business-shooting", 6, "svg"),
  },
  {
    id: "produktshooting",
    title: "Produktshooting",
    category: "Produkt",
    date: "2026",
    location: "Studio",
    description: "Klare, hochwertige Produktfotos für Onlineshop, Website und Social Media.",
    images: bilder("produktshooting", 5, "svg"),
  },
  {
    id: "reels-content",
    title: "Reels & Social Content",
    category: "Social Media",
    date: "2026",
    description: "Kurzvideos im Hochformat für Instagram und TikTok – geplant, gedreht und geschnitten.",
    videos: [
      // Platzhalter-Video – ersetze es z. B. durch "https://youtube.com/shorts/…"
      { link: "videos/reel-01.mp4", cover: "images/portfolio/reels-content/video-cover.jpg", title: "Reel", vertical: true },
    ],
    featured: true,
    images: bilder("reels-content", 4, "svg"),
  },
  {
    id: "analog",
    title: "Analog – auf Film",
    category: "Analog",
    date: "2026",
    description: "Fotos auf echtem Film – mit Korn, Charakter und dem besonderen Look, den man digital kaum nachbauen kann.",
    images: bilder("analog", 6, "svg"),
  },
];
