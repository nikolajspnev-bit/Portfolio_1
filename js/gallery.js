/*
 * Portfolio-Galerie mit Filter und Großansicht (Lightbox).
 * Die Inhalte kommen aus js/gallery-data.js.
 */
(function () {
  "use strict";

  var data = Array.isArray(window.GALLERY) ? window.GALLERY : [];
  var list = document.querySelector("[data-gallery]");
  var filterBox = document.querySelector("[data-filters]");
  if (!list) return;

  // Standard: Bild in neuem Tab öffnen – wird unten durch die Lightbox ersetzt
  var openEntry = function (entry) {
    window.open(entry.item.full || entry.item.src, "_blank", "noopener");
  };

  var PLAY_ICON =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z"/></svg>';

  /* ---------- Galerie aufbauen ---------- */
  var entries = data.map(function (item, index) {
    var type = item.type === "video" ? "video" : "foto";
    var li = document.createElement("li");
    li.className = "g-item";
    li.dataset.type = type;
    li.style.animationDelay = Math.min(index * 0.04, 0.6) + "s";

    var button = document.createElement("button");
    button.type = "button";
    button.className = "g-btn";
    button.dataset.type = type;
    button.setAttribute("aria-label", (item.title || "Arbeit") + (type === "video" ? " – Video abspielen" : " – groß ansehen"));

    var img = document.createElement("img");
    img.src = item.src;
    img.alt = item.title || "";
    img.loading = index < 6 ? "eager" : "lazy";
    img.decoding = "async";
    button.appendChild(img);

    if (type === "video") {
      var play = document.createElement("span");
      play.className = "g-play";
      play.innerHTML = PLAY_ICON;
      button.appendChild(play);
    }

    var info = document.createElement("span");
    info.className = "g-info";
    if (item.category) {
      var cat = document.createElement("span");
      cat.className = "g-cat";
      cat.textContent = item.category;
      info.appendChild(cat);
    }
    var title = document.createElement("span");
    title.className = "g-title";
    title.textContent = item.title || "";
    info.appendChild(title);
    button.appendChild(info);

    li.appendChild(button);
    list.appendChild(li);

    var entry = { item: item, type: type, li: li, button: button, img: img };
    button.addEventListener("click", function () {
      openEntry(entry);
    });
    return entry;
  });

  if (!entries.length) {
    list.insertAdjacentHTML("afterend", '<p class="gallery-empty">Hier erscheinen bald meine Arbeiten.</p>');
  }

  /* ---------- Filter ---------- */
  var counts = { alle: entries.length, foto: 0, video: 0 };
  entries.forEach(function (entry) {
    counts[entry.type]++;
  });

  var filters = [
    { key: "alle", label: "Alle" },
    { key: "foto", label: "Fotografie" },
    { key: "video", label: "Videografie" },
  ];

  // Filter nur anzeigen, wenn es sowohl Fotos als auch Videos gibt
  if (filterBox && counts.foto && counts.video) {
    filters.forEach(function (filter, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filter";
      btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      btn.innerHTML = filter.label + ' <span class="count">' + counts[filter.key] + "</span>";
      btn.addEventListener("click", function () {
        filterBox.querySelectorAll(".filter").forEach(function (other) {
          other.setAttribute("aria-pressed", other === btn ? "true" : "false");
        });
        applyFilter(filter.key);
      });
      filterBox.appendChild(btn);
    });
  } else if (filterBox) {
    filterBox.hidden = true;
  }

  function applyFilter(key) {
    entries.forEach(function (entry, index) {
      var show = key === "alle" || entry.type === key;
      entry.li.hidden = !show;
      if (show) {
        // Einblend-Animation neu starten
        entry.li.style.animation = "none";
        void entry.li.offsetWidth;
        entry.li.style.animation = "";
        entry.li.style.animationDelay = Math.min(index * 0.03, 0.4) + "s";
      }
    });
  }

  function visibleEntries() {
    return entries.filter(function (entry) {
      return !entry.li.hidden;
    });
  }

  /* ---------- Lightbox ---------- */
  var dialog = document.querySelector("[data-lightbox]");
  if (!dialog || typeof dialog.showModal !== "function") return; // sehr alte Browser
  openEntry = openLightbox;

  var stage = dialog.querySelector("[data-lb-stage]");
  var media = dialog.querySelector("[data-lb-media]");
  var counter = dialog.querySelector("[data-lb-counter]");
  var titleEl = dialog.querySelector("[data-lb-title]");
  var catEl = dialog.querySelector("[data-lb-cat]");
  var prevBtn = dialog.querySelector("[data-lb-prev]");
  var nextBtn = dialog.querySelector("[data-lb-next]");
  var closeBtn = dialog.querySelector("[data-lb-close]");

  var current = [];
  var position = 0;
  var lastTrigger = null;

  function embed(src, ratio) {
    var wrap = document.createElement("div");
    wrap.className = "embed";
    wrap.style.setProperty("--ratio", ratio);
    var frame = document.createElement("iframe");
    frame.src = src;
    frame.title = "Video";
    frame.allow = "autoplay; fullscreen; picture-in-picture; encrypted-media";
    frame.allowFullscreen = true;
    wrap.appendChild(frame);
    return wrap;
  }

  function renderMedia(entry) {
    var item = entry.item;
    var ratio = entry.img.naturalWidth && entry.img.naturalHeight ? entry.img.naturalWidth / entry.img.naturalHeight : 16 / 9;
    var node;

    if (entry.type === "video" && item.youtube) {
      node = embed("https://www.youtube-nocookie.com/embed/" + encodeURIComponent(item.youtube) + "?autoplay=1&rel=0&playsinline=1", ratio);
    } else if (entry.type === "video" && item.vimeo) {
      node = embed("https://player.vimeo.com/video/" + encodeURIComponent(item.vimeo) + "?autoplay=1&dnt=1", ratio);
    } else if (entry.type === "video" && item.video) {
      node = document.createElement("video");
      node.src = item.video;
      node.poster = item.src;
      node.controls = true;
      node.autoplay = true;
      node.playsInline = true;
    } else {
      node = document.createElement("img");
      node.src = item.full || item.src;
      node.alt = item.title || "";
    }
    media.replaceChildren(node);
  }

  function preload(index) {
    var entry = current[(index + current.length) % current.length];
    if (entry && entry.type === "foto") {
      var img = new Image();
      img.src = entry.item.full || entry.item.src;
    }
  }

  function show(index) {
    position = (index + current.length) % current.length;
    var entry = current[position];
    renderMedia(entry);
    titleEl.textContent = entry.item.title || "";
    catEl.textContent = entry.item.category || "";
    counter.innerHTML = "<b>" + (position + 1) + "</b> / " + current.length;
    preload(position + 1);
    preload(position - 1);
  }

  function openLightbox(entry) {
    current = visibleEntries();
    lastTrigger = entry.button;
    var single = current.length < 2;
    prevBtn.hidden = single;
    nextBtn.hidden = single;
    show(current.indexOf(entry));
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();
    closeBtn.focus();
  }

  function closeLightbox() {
    if (dialog.open) dialog.close();
  }

  dialog.addEventListener("close", function () {
    media.replaceChildren(); // stoppt laufende Videos
    document.documentElement.style.overflow = "";
    if (lastTrigger) lastTrigger.focus();
  });

  prevBtn.addEventListener("click", function () {
    show(position - 1);
  });
  nextBtn.addEventListener("click", function () {
    show(position + 1);
  });
  closeBtn.addEventListener("click", closeLightbox);

  // Klick neben das Bild schließt die Großansicht
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog || event.target === stage || event.target === media) closeLightbox();
  });

  dialog.addEventListener("keydown", function (event) {
    if (current.length < 2) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      show(position + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(position - 1);
    }
  });

  // Wischen auf dem Handy
  var touchX = null;
  var touchY = null;
  stage.addEventListener(
    "touchstart",
    function (event) {
      touchX = event.touches[0].clientX;
      touchY = event.touches[0].clientY;
    },
    { passive: true }
  );
  stage.addEventListener("touchend", function (event) {
    if (touchX === null || current.length < 2) return;
    var dx = event.changedTouches[0].clientX - touchX;
    var dy = event.changedTouches[0].clientY - touchY;
    touchX = touchY = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      show(dx < 0 ? position + 1 : position - 1);
    }
  });
})();
