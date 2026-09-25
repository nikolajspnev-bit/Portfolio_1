/*
 * ============================================================
 *  PORTFOLIO – DEINE PROJEKTE / SHOOTINGS
 * ============================================================
 *  Jedes Projekt erscheint im Portfolio als Kachel (Cover-Bild).
 *  Tippt man darauf, öffnet sich das Shooting mit allen Bildern.
 *
 *  So legst du ein neues Shooting an:
 *  1. Ordner anlegen:  images/portfolio/<name>/   (z. B. images/portfolio/hochzeit-anna/)
 *  2. Bilder hineinlegen und durchnummerieren: 01.jpg, 02.jpg, 03.jpg …
 *  3. Unten einen Eintrag hinzufügen – z. B.:
 *
 *     {
 *       id: "hochzeit-anna",
 *       title: "Hochzeit Anna & Tom",
 *       category: "Hochzeit",
 *       date: "Mai 2026",
 *       location: "Hamburg",
 *       description: "Ein kurzer Text zum Shooting.",
 *       images: bilder("hochzeit-anna", 12),   // lädt 01.jpg bis 12.jpg aus dem Ordner
 *     },
 *
 *  Felder:
 *    id           kurzer Name ohne Leerzeichen (wird Teil des Links: portfolio.html#/hochzeit-anna)
 *    title        Titel des Projekts
 *    category     z. B. "Portrait", "Event", "Produkt" – daraus entstehen die Filter-Buttons
 *    date         optional, z. B. "Mai 2026"
 *    location     optional, z. B. "Berlin" oder "Studio"
 *    description  optional, kurzer Text zum Projekt
 *    cover        optional, Cover-Bild der Kachel (sonst wird das erste Bild genommen)
 *    featured     true = Cover erscheint in der Collage auf der Startseite (die ersten 3)
 *    images       die Bilder des Shootings – entweder mit bilder("ordner", anzahl)
 *                 oder als Liste: ["images/portfolio/x/a.jpg", "images/portfolio/x/b.jpg"]
 *
 *  Video zum Projekt (optional, eins davon):
 *    youtube      YouTube-Video-ID, z. B. "dQw4w9WgXcQ" aus youtube.com/watch?v=dQw4w9WgXcQ
 *    vimeo        Vimeo-Video-ID, z. B. "76979871"
 *    video        eigene Videodatei, z. B. "videos/aftermovie.mp4"
 *    vertical     true = Hochformat-Video (Reel/TikTok)
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

// Die folgenden Projekte sind PLATZHALTER – ersetze sie durch deine eigenen Shootings.
window.PROJECTS = [
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
    description: "Fotos vom Festival – die Energie der Menge, Lichter und die besten Momente auf und vor der Bühne.",
    // youtube: "DEINE-VIDEO-ID",   ← hier z. B. das Aftermovie eintragen
    featured: true,
    images: bilder("sommer-festival", 7, "svg"),
  },
  {
    id: "urban-streets",
    title: "Urban Streets",
    category: "Street",
    date: "2026",
    location: "Stadt",
    description: "Streetstyle-Shooting bei Nacht – Stadtlichter, starke Kontraste und ein urbaner Look.",
    images: bilder("urban-streets", 6, "svg"),
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
    // youtube: "DEINE-VIDEO-ID",
    vertical: true,
    featured: true,
    images: bilder("reels-content", 4, "svg"),
  },
  {
    id: "berge-weite",
    title: "Berge & Weite",
    category: "Landschaft",
    date: "2026",
    location: "Outdoor",
    description: "Landschaftsfotografie zwischen Sonnenaufgang und Abendrot.",
    images: bilder("berge-weite", 6, "svg"),
  },
];
