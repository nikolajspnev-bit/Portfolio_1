# Prompt für Claude Code – Portfolio-Webseite

Fülle zuerst die Platzhalter in `[ECKIGEN KLAMMERN]` aus. Dann kopierst du alles
zwischen den beiden Linien und fügst es in Claude Code ein.

---

Erstelle mir eine moderne, responsive Portfolio-Webseite für meine Arbeit als Freelance Fotograf & Videograf. Die Seite soll meine Arbeiten hochwertig präsentieren und potenzielle Kunden dazu bringen, mich zu buchen. Alle Texte auf Deutsch.

## Meine Daten
- Name: [DEIN VOLLER NAME]
- Marke / Logo-Schriftzug: nikolajtry
- Tätigkeit: Freelance Fotograf & Videograf
- E-Mail: nikolajtry.media@gmail.com
- Telefon: +49 1590 2631729 (Link: tel:+4915902631729)
- WhatsApp: https://wa.me/4915902631729
- Alle Links (Fancy Bio): https://fancy-bio.com/nikolajtry
- Instagram: https://www.instagram.com/[DEIN_INSTAGRAM_NAME]/
- Standort / Einsatzgebiet: [STADT / REGION]
- Über mich: [2–4 SÄTZE ÜBER DICH – wer du bist, was dich antreibt, wie du arbeitest]
- Leistungen: [z. B. Portraits, Events, Hochzeiten, Produktfotos, Social-Media-Reels, Imagefilme]

## Technik
- Reines HTML, CSS und Vanilla JavaScript – kein Framework, kein Build-Schritt. Die Seite soll kostenlos auf GitHub Pages oder Netlify laufen und für mich leicht zu pflegen sein.
- Ordnerstruktur:
  - index.html – Startseite
  - portfolio.html – Portfolio
  - impressum.html, datenschutz.html
  - css/style.css
  - js/main.js (Navigation, Animationen, Instagram), js/gallery.js (Galerie + Lightbox)
  - js/portfolio-data.js – hier trage ich meine Bilder und Videos ein
  - assets/images/ (hero.jpg, about.jpg, portfolio/), assets/videos/, assets/fonts/
- Setze Platzhalterbilder ein (z. B. von https://picsum.photos), damit die Galerie sofort gefüllt aussieht. Ich ersetze sie später durch meine eigenen Arbeiten.

## Design
- Dunkles, edles Design: fast schwarzer Hintergrund (z. B. #0e0e0e), Karten in #1a1a1a, helle Schrift (#f2f2f2) – so wirken Fotos und Videos am besten.
- Orange als Akzent für Kontraste: Buttons, Links, Hover-Effekte, aktiver Reiter, Trennlinien, Fokus-Rahmen und einzelne hervorgehobene Wörter in Überschriften (z. B. #FF6A00, Hover #FF8533). Orange gezielt als Akzent einsetzen, nicht als große Fläche.
- Alle Farben, Abstände und Schriften als CSS-Variablen in :root.
- Überschriften in einer kräftigen Display-Schrift (z. B. "Bebas Neue"), Fließtext in "Inter". Schriften lokal aus assets/fonts laden, nicht von Google-Servern (DSGVO).
- Dezente Animationen: Einblenden beim Scrollen, leichter Zoom beim Hover über Bildern. prefers-reduced-motion respektieren.

## Navigation (auf allen Seiten gleich)
- Links der Schriftzug "nikolajtry", rechts die Reiter "Start" und "Portfolio" sowie "Kontakt" (springt zum Kontaktbereich der Startseite).
- Sticky Header, der beim Scrollen einen halbtransparenten dunklen Hintergrund mit Blur bekommt.
- Auf dem Handy ein Burger-Menü mit Vollbild-Overlay.
- Der aktive Reiter ist orange markiert.
- Footer auf allen Seiten: Kontakt, Instagram, Fancy-Bio-Link, Impressum, Datenschutz, Copyright mit aktuellem Jahr.

## Reiter 1: Startseite (index.html)
1. Hero: Vollbild-Foto (optional stummes Hintergrundvideo im Loop) mit dunklem Verlauf, großer Name, Untertitel "Freelance Fotograf & Videograf – [STADT]". Zwei Buttons: "Portfolio ansehen" (→ portfolio.html, orange gefüllt) und "Alle meine Links" (→ Fancy Bio, orange umrandet).
2. Über mich: Portraitfoto neben meinem Text (auf dem Handy untereinander).
3. Was ich mache: 3–4 Karten (z. B. Fotografie, Videografie, Social-Media-Content, Events) mit Inline-SVG-Icons in Orange und kurzer Beschreibung.
4. Neuester Instagram-Post (Details siehe unten).
5. Fancy Bio: auffälliger Call-to-Action-Block mit großem orangefarbenem Button "Alle meine Links" → https://fancy-bio.com/nikolajtry (neuer Tab, rel="noopener").
6. Kontakt: Überschrift "Lass uns zusammenarbeiten", große, gut tippbare Buttons für E-Mail (mailto:), Anrufen (tel:), WhatsApp und Instagram.

## Reiter 2: Portfolio (portfolio.html)
- Kurze Einleitung, darunter Filter-Tabs: "Alle", "Fotografie", "Videografie". Weitere Kategorien sollen automatisch als Tab erscheinen, wenn ich sie in den Daten verwende.
- Masonry-Galerie (CSS columns oder Grid): Desktop 3–4 Spalten, Tablet 2, Handy 1–2. Bilder behalten ihr Seitenverhältnis.
- Videos erscheinen als Vorschaubild mit orangefarbenem Play-Symbol. Unterstützt werden eigene MP4-Dateien, YouTube (über youtube-nocookie.com) und Vimeo – eingebettet wird erst beim Öffnen.
- Klick auf ein Element öffnet eine selbst gebaute Lightbox (ohne externe Bibliothek): großes Bild bzw. Video, Pfeile vor/zurück, Tastatur (← → Esc), Wischgesten auf dem Handy, Titel und Kategorie, Zähler (z. B. 3 / 24), Schließen per X oder Klick auf den Hintergrund; die Seite dahinter scrollt nicht mit.
- Lazy Loading (loading="lazy") und Alt-Texte für alle Bilder.
- Alle Einträge kommen aus js/portfolio-data.js, z. B.:
  { type: "image", src: "assets/images/portfolio/portrait-01.jpg", category: "Fotografie", title: "Portrait-Shooting" },
  { type: "video", src: "https://www.youtube.com/watch?v=VIDEO_ID", thumb: "assets/images/portfolio/imagefilm.jpg", category: "Videografie", title: "Imagefilm" }
  Ein neues Werk hinzufügen = eine Zeile ergänzen.

## Instagram-Integration (neuester Post)
Ziel: Auf der Startseite erscheint automatisch immer mein neuester Instagram-Post; ein Klick darauf öffnet den Post auf Instagram.
- Instagram liefert Posts nur über die offizielle API mit Zugangstoken, und dieser Token darf nie im Frontend-Code stehen. Nutze deshalb einen Feed-Dienst wie Behold (behold.so), der eine öffentliche JSON-Feed-URL bereitstellt.
- In js/main.js ganz oben eine Konstante INSTAGRAM_FEED_URL = "" mit Kommentar, wo ich die URL herbekomme. Per fetch() nur den neuesten Post laden und als Karte anzeigen: Bild (bei Reels/Videos das Vorschaubild mit Play-Symbol), gekürzte Caption, Datum und Button "Auf Instagram ansehen" → Permalink des Posts (neuer Tab). Die ganze Karte ist klickbar.
- Datenschutz: standardmäßig eine Zwei-Klick-Lösung – zuerst eine Platzhalter-Karte mit kurzem Hinweis und Button "Neuesten Post laden"; erst danach wird der Feed geladen. Die Zustimmung in localStorage merken, damit wiederkehrende Besucher den Post direkt sehen. Über eine Konstante INSTAGRAM_REQUIRE_CONSENT (true/false) umschaltbar.
- Fallback: Wenn keine URL eingetragen ist oder das Laden fehlschlägt, eine schöne Karte "Folge mir auf Instagram" mit Button zu meinem Profil anzeigen – nie ein leerer oder kaputter Bereich.

## Rechtliches (Deutschland)
- impressum.html und datenschutz.html im gleichen Design, mit klar markierten Platzhaltern (z. B. [ANSCHRIFT]) und dem Hinweis, dass ich die Texte mit einem Generator erstelle und einfüge. In der Datenschutzerklärung Abschnitte für Instagram/Behold, YouTube und Vimeo vorsehen.

## Qualität
- Mobile-first, sauber auf 360 px, 768 px, 1024 px und 1440 px Breite. Keine horizontale Scrollleiste, Touch-Ziele mindestens 44 px.
- SEO: aussagekräftiger title und meta description pro Seite, Open-Graph-Tags (Vorschaubild beim Teilen auf WhatsApp/Instagram), Favicon, semantisches HTML.
- Barrierefreiheit: gute Kontraste, sichtbare orange Fokus-Rahmen, aria-labels für Icon-Buttons, Lightbox per Tastatur bedienbar.
- Performance: Bilder mit width/height gegen Layout-Sprünge, Hero-Bild bevorzugt laden, Galerie lazy.

## Zum Schluss
- Erstelle eine README.md auf Deutsch mit: Bilder und Videos hinzufügen (inkl. Tipp: WebP, max. ca. 2000 px Breite), Texte und Farben ändern, Instagram-Feed mit Behold verbinden (Schritt für Schritt), Seite kostenlos mit GitHub Pages veröffentlichen.
- Teste die Seite in Desktop- und Handy-Ansicht und nenne mir am Ende eine Liste aller Platzhalter, die ich noch ausfüllen muss.

---

## Hinweise

- **Wortwahl:** „Freelance Fotograf & Videograf“ statt „Content Creator“. Kunden suchen
  nach diesen Begriffen, und es klingt nach einer buchbaren Dienstleistung.
  „Content Creator“ verbindet man eher mit einem eigenen Social-Media-Kanal.
  Social-Media-Content steht trotzdem als Leistung mit drin.
- **Instagram:** Damit der neueste Post automatisch erscheint, muss dein Konto ein
  Creator- oder Business-Konto sein (kostenlos in den Instagram-Einstellungen umstellbar).
  Danach bei behold.so anmelden, Instagram verbinden, einen Feed anlegen und die
  JSON-Feed-URL in `js/main.js` eintragen.
- **Impressum & Datenschutz:** Für eine geschäftliche Webseite in Deutschland
  sind beide Pflicht, deshalb stehen sie im Prompt.
