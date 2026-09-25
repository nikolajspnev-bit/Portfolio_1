/*
 * ============================================================
 *  PORTFOLIO-INHALTE
 * ============================================================
 *  So fügst du eine Arbeit hinzu:
 *  1. Bild in den Ordner  images/portfolio/  legen (z. B. hochzeit-01.jpg)
 *  2. Unten einen neuen Eintrag anlegen (Reihenfolge = Reihenfolge auf der Seite)
 *
 *  Felder:
 *    type      "foto" oder "video"
 *    src       Bild (bei Videos: das Vorschaubild)
 *    title     Titel, der in der Großansicht erscheint
 *    category  z. B. "Portrait", "Event", "Produkt", "Reel"
 *    featured  true = wird zusätzlich auf der Startseite gezeigt (max. 3)
 *
 *  Nur für Videos (eins davon angeben):
 *    youtube   YouTube-Video-ID, z. B. "dQw4w9WgXcQ" aus youtube.com/watch?v=dQw4w9WgXcQ
 *    vimeo     Vimeo-Video-ID, z. B. "76979871"
 *    video     eigene Videodatei, z. B. "videos/aftermovie.mp4"
 *    Ohne Angabe wird nur das Vorschaubild gezeigt.
 */
window.GALLERY = [
  { type: "foto", src: "images/portfolio/foto-01.svg", title: "Golden Hour Portrait", category: "Portrait", featured: true },
  { type: "foto", src: "images/portfolio/foto-02.svg", title: "Stadt bei Nacht", category: "Street" },
  { type: "video", src: "images/portfolio/video-01.svg", title: "Event Aftermovie", category: "Event", featured: true },
  { type: "foto", src: "images/portfolio/foto-03.svg", title: "Editorial Shooting", category: "Portrait" },
  { type: "foto", src: "images/portfolio/foto-04.svg", title: "Produktfoto", category: "Produkt" },
  { type: "video", src: "images/portfolio/video-03.svg", title: "Instagram Reel", category: "Reel" },
  { type: "foto", src: "images/portfolio/foto-05.svg", title: "Konzert", category: "Event", featured: true },
  { type: "foto", src: "images/portfolio/foto-06.svg", title: "Outdoor Portrait", category: "Portrait" },
  { type: "foto", src: "images/portfolio/foto-07.svg", title: "Landschaft", category: "Landschaft" },
  { type: "video", src: "images/portfolio/video-02.svg", title: "Imagefilm", category: "Imagefilm" },
  { type: "foto", src: "images/portfolio/foto-08.svg", title: "Streetstyle", category: "Street" },
  { type: "foto", src: "images/portfolio/foto-09.svg", title: "Sonnenuntergang", category: "Landschaft" },
];
