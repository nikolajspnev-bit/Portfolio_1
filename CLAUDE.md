# Absprachen mit Nikolaj für dieses Portfolio

Statische Seite (HTML/CSS/JS, kein Build), live über GitHub Pages aus dem Branch `main`.
Antworten an Nikolaj auf Deutsch.

## Neue Bilder → neues Projekt
- Nikolaj lädt Bilder in einen Upload-Ordner im Repo-Wurzelverzeichnis (z. B. `Charlene Portrait/`, mit README).
- Daraus die besten Bilder auswählen (keine Fast-Duplikate), auf max. 2000 px verkleinern, Metadaten entfernen,
  als `images/portfolio/<id>/01.jpg …` speichern und in `js/projekte.js` als Projekt eintragen.
- Reihenfolge so wählen, dass die Galerie-Spalten unten gleichmäßig enden (Desktop und Handy).
- 2–3 starke Bilder unter `startseite: [...]` eintragen, damit sie in der Collage auf der Startseite mitlaufen.
- **Der „Neu“-Hinweis (`neu: "…"`) wandert immer zum neuesten Projekt** – das darf ohne Nachfrage passieren,
  sobald Nikolaj neue Bilder für ein Projekt gibt. Es gibt immer nur ein Projekt mit `neu`.
- Danach die Original-Bilder aus dem Upload-Ordner löschen, die README dort bleibt.
- Sind Personen gut erkennbar, kurz nachfragen, ob sie mit der Veröffentlichung einverstanden sind.

## Texte und Technik
- Keine Gedankenstriche (– oder —) in sichtbaren Texten; stattdessen Komma, Punkt oder Doppelpunkt.
  Ausnahme: der Projekttitel „E30 und E28 - Ausfahrt durch den Schwarzwald“ bleibt so.
- Nach jeder Änderung an CSS/JS `python3 tools/version.py` ausführen (Cache-Versionen in den HTML-Dateien).
- Vor dem Push im Browser testen (Handy- und Desktop-Breite).
- Fuji-Rezepte stammen meist von Fuji X Weekly oder filmsimrecipes.com.
