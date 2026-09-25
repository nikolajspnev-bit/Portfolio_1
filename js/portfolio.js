/*
 * Portfolio: Projekt-Übersicht → Shooting-Ansicht → Großansicht (Lightbox).
 * Die Inhalte kommen aus js/projekte.js.
 * Jedes Projekt hat einen eigenen Link, z. B. portfolio.html#/golden-hour
 */
(function () {
  "use strict";

  var overviewView = document.querySelector('[data-view="overview"]');
  var projectView = document.querySelector('[data-view="project"]');
  var grid = document.querySelector("[data-projects]");
  if (!overviewView || !projectView || !grid) return;

  var ICONS = {
    images:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/></svg>',
    video:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 13 5.2 3.5a.5.5 0 0 0 .8-.4V7.9a.5.5 0 0 0-.8-.4L16 11"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>',
    calendar:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    pin:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    arrow:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    play:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z"/></svg>',
  };

  /* ---------- Hilfsfunktionen ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      if (key === "text") node.textContent = attrs[key];
      else if (key === "html") node.innerHTML = attrs[key];
      else node.setAttribute(key, attrs[key]);
    });
    (children || []).forEach(function (child) {
      if (child) node.appendChild(child);
    });
    return node;
  }

  function slugify(text) {
    return String(text)
      .toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function imageCountText(n) {
    return n + (n === 1 ? " Bild" : " Bilder");
  }

  /* ---------- Daten aufbereiten ---------- */
  var usedIds = {};
  var projects = (Array.isArray(window.PROJECTS) ? window.PROJECTS : [])
    .map(function (raw, index) {
      var images = (raw.images || [])
        .map(function (img) {
          return typeof img === "string" ? { src: img } : img;
        })
        .filter(function (img) {
          return img && img.src;
        });
      var id = slugify(raw.id || raw.title || "projekt-" + (index + 1)) || "projekt-" + (index + 1);
      if (usedIds[id]) id += "-" + (index + 1);
      usedIds[id] = true;
      return {
        id: id,
        title: raw.title || "Projekt",
        category: raw.category || "",
        date: raw.date || "",
        location: raw.location || "",
        description: raw.description || "",
        cover: raw.cover || (images[0] && images[0].src) || "",
        images: images,
        youtube: raw.youtube || "",
        vimeo: raw.vimeo || "",
        video: raw.video || "",
        vertical: !!raw.vertical,
      };
    })
    .filter(function (project) {
      return project.cover;
    });

  function hasVideo(project) {
    return !!(project.youtube || project.vimeo || project.video);
  }

  function findProject(id) {
    for (var i = 0; i < projects.length; i++) if (projects[i].id === id) return projects[i];
    return null;
  }

  /* ---------- Übersicht: Projekt-Kacheln ---------- */
  var cards = projects.map(function (project, index) {
    var link = el("a", { class: "project-card", href: "#/" + project.id });

    link.appendChild(el("img", { src: project.cover, alt: "", loading: index < 6 ? "eager" : "lazy", decoding: "async" }));

    var badges = el("span", { class: "project-badges" });
    if (project.images.length) {
      badges.appendChild(el("span", { class: "project-badge", html: ICONS.images + " " + project.images.length }));
    }
    if (hasVideo(project)) badges.appendChild(el("span", { class: "project-badge", html: ICONS.video + " Video" }));
    link.appendChild(badges);

    link.appendChild(el("span", { class: "project-arrow", html: ICONS.arrow }));

    var meta = [project.images.length ? imageCountText(project.images.length) : "", project.date].filter(Boolean).join(" · ");
    link.appendChild(
      el("span", { class: "project-info" }, [
        project.category ? el("span", { class: "project-cat", text: project.category }) : null,
        el("span", { class: "project-title", text: project.title }),
        meta ? el("span", { class: "project-meta-line", text: meta }) : null,
      ])
    );

    var li = el("li", { class: "project-item" }, [link]);
    li.style.animationDelay = Math.min(index * 0.06, 0.6) + "s";
    li.dataset.category = project.category;
    grid.appendChild(li);
    return { project: project, li: li, link: link };
  });

  if (!projects.length) {
    grid.insertAdjacentHTML("afterend", '<p class="gallery-empty">Hier erscheinen bald meine Projekte.</p>');
  }

  /* ---------- Filter nach Kategorie ---------- */
  var filterBox = document.querySelector("[data-filters]");
  var categories = [];
  projects.forEach(function (project) {
    if (project.category && categories.indexOf(project.category) === -1) categories.push(project.category);
  });

  if (filterBox && categories.length > 1) {
    ["Alle"].concat(categories).forEach(function (category, i) {
      var count = i === 0 ? projects.length : projects.filter(function (p) { return p.category === category; }).length;
      var btn = el("button", { class: "filter", type: "button", "aria-pressed": i === 0 ? "true" : "false" });
      btn.appendChild(document.createTextNode(category + " "));
      btn.appendChild(el("span", { class: "count", text: String(count) }));
      btn.addEventListener("click", function () {
        filterBox.querySelectorAll(".filter").forEach(function (other) {
          other.setAttribute("aria-pressed", other === btn ? "true" : "false");
        });
        cards.forEach(function (card, index) {
          var show = i === 0 || card.project.category === category;
          card.li.hidden = !show;
          if (show) {
            card.li.style.animation = "none";
            void card.li.offsetWidth; // Einblend-Animation neu starten
            card.li.style.animation = "";
            card.li.style.animationDelay = Math.min(index * 0.04, 0.4) + "s";
          }
        });
      });
      filterBox.appendChild(btn);
    });
  } else if (filterBox) {
    filterBox.hidden = true;
  }

  /* ---------- Projekt-Ansicht (Shooting) ---------- */
  var pCat = projectView.querySelector("[data-p-cat]");
  var pTitle = projectView.querySelector("[data-p-title]");
  var pMeta = projectView.querySelector("[data-p-meta]");
  var pDesc = projectView.querySelector("[data-p-desc]");
  var pVideo = projectView.querySelector("[data-p-video]");
  var pImages = projectView.querySelector("[data-p-images]");
  var pNext = projectView.querySelector("[data-p-next]");
  var backLink = projectView.querySelector("[data-back]");

  var baseTitle = document.title;
  var currentProject = null;
  var overviewScroll = 0;

  function metaItem(icon, text) {
    return el("li", { html: icon }, [el("span", { text: text })]);
  }

  function renderVideo(project) {
    pVideo.replaceChildren();
    pVideo.hidden = !hasVideo(project);
    pVideo.classList.toggle("is-vertical", project.vertical);
    if (!hasVideo(project)) return;

    if (project.video) {
      pVideo.appendChild(el("video", { src: project.video, poster: project.cover, controls: "", preload: "metadata", playsinline: "" }));
      return;
    }

    // YouTube/Vimeo erst nach Klick laden (datenschutzfreundlich)
    var poster = el("button", { class: "video-poster", type: "button", "aria-label": "Video abspielen" }, [
      el("img", { src: project.cover, alt: "" }),
      el("span", { class: "video-play", html: ICONS.play }),
      el("span", { class: "video-hint", text: project.youtube ? "Video abspielen · YouTube" : "Video abspielen · Vimeo" }),
    ]);
    poster.addEventListener("click", function () {
      var src = project.youtube
        ? "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(project.youtube) + "?autoplay=1&rel=0&playsinline=1"
        : "https://player.vimeo.com/video/" + encodeURIComponent(project.vimeo) + "?autoplay=1&dnt=1";
      var frame = el("iframe", {
        src: src,
        title: project.title + " – Video",
        allow: "autoplay; fullscreen; picture-in-picture; encrypted-media",
        allowfullscreen: "",
      });
      pVideo.replaceChildren(frame);
      frame.focus();
    });
    pVideo.appendChild(poster);
  }

  function renderImages(project) {
    pImages.replaceChildren();
    project.images.forEach(function (image, index) {
      var btn = el("button", {
        class: "g-btn",
        type: "button",
        "aria-label": "Bild " + (index + 1) + " von " + project.images.length + " groß ansehen",
      }, [el("img", { src: image.src, alt: image.alt || project.title + " – Bild " + (index + 1), loading: index < 4 ? "eager" : "lazy", decoding: "async" })]);
      btn.addEventListener("click", function () {
        openLightbox(project, index, btn);
      });
      var li = el("li", { class: "g-item" }, [btn]);
      li.style.animationDelay = Math.min(index * 0.05, 0.6) + "s";
      pImages.appendChild(li);
    });
  }

  function renderNext(project) {
    pNext.replaceChildren();
    if (projects.length < 2) return;
    var next = projects[(projects.indexOf(project) + 1) % projects.length];
    var link = el("a", { class: "next-project", href: "#/" + next.id }, [
      el("img", { src: next.cover, alt: "", loading: "lazy", decoding: "async" }),
      el("span", { class: "next-text" }, [
        el("span", { class: "next-label", text: "Nächstes Projekt" }),
        el("span", { class: "next-title", text: next.title }),
      ]),
      el("span", { class: "project-arrow", html: ICONS.arrow }),
    ]);
    pNext.appendChild(link);
  }

  // Titel so weit verkleinern, dass auch lange Wörter (z. B. "Produktshooting") in eine Zeile passen
  function fitTitle() {
    if (projectView.hidden) return;
    pTitle.style.fontSize = "";
    pTitle.classList.add("is-measuring");
    var size = parseFloat(getComputedStyle(pTitle).fontSize);
    while (pTitle.scrollWidth > pTitle.clientWidth + 1 && size > 18) {
      size -= 1;
      pTitle.style.fontSize = size + "px";
    }
    pTitle.classList.remove("is-measuring");
  }

  var resizeFrame = null;
  window.addEventListener("resize", function () {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(fitTitle);
  });

  function showProject(project) {
    currentProject = project;
    pCat.textContent = project.category;
    pCat.hidden = !project.category;
    pTitle.textContent = project.title;

    pMeta.replaceChildren();
    if (project.date) pMeta.appendChild(metaItem(ICONS.calendar, project.date));
    if (project.location) pMeta.appendChild(metaItem(ICONS.pin, project.location));
    if (project.images.length) pMeta.appendChild(metaItem(ICONS.images, imageCountText(project.images.length)));
    if (hasVideo(project)) pMeta.appendChild(metaItem(ICONS.video, "Video"));

    pDesc.textContent = project.description;
    pDesc.hidden = !project.description;

    renderVideo(project);
    renderImages(project);
    renderNext(project);

    overviewView.hidden = true;
    projectView.hidden = false;
    fitTitle();
    projectView.classList.remove("view-enter");
    void projectView.offsetWidth;
    projectView.classList.add("view-enter");

    document.title = project.title + " – Portfolio | nikolajtry.media";
    window.scrollTo({ top: 0, behavior: "instant" });
    pTitle.focus({ preventScroll: true });
  }

  function showOverview() {
    var previous = currentProject;
    currentProject = null;
    pVideo.replaceChildren(); // stoppt laufende Videos
    projectView.hidden = true;
    overviewView.hidden = false;
    document.title = baseTitle;
    window.scrollTo({ top: overviewScroll, behavior: "instant" });
    if (previous) {
      var card = cards.filter(function (c) { return c.project === previous; })[0];
      if (card) card.link.focus({ preventScroll: true });
    }
  }

  /* ---------- Navigation über den Link (#/projekt-id) ---------- */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  function route() {
    var hash = decodeURIComponent(location.hash || "");
    if (hash.indexOf("#/") === 0) {
      var project = findProject(hash.slice(2));
      if (project) {
        showProject(project);
        return;
      }
    } else if (hash && hash !== "#") {
      return; // andere Sprungmarken (z. B. #inhalt) nicht anfassen
    }
    if (currentProject) showOverview();
  }

  // Wie tief wir von der Übersicht aus in Projekte geklickt haben (für "Alle Projekte")
  function depth() {
    return (history.state && history.state.depth) || 0;
  }

  function isPlainClick(event) {
    return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  }

  function openProject(event, id, newDepth) {
    if (!isPlainClick(event)) return; // Strg/Cmd-Klick öffnet normal in neuem Tab
    event.preventDefault();
    if (!currentProject) overviewScroll = window.scrollY;
    history.pushState({ depth: newDepth }, "", "#/" + id);
    route();
  }

  cards.forEach(function (card) {
    card.link.addEventListener("click", function (event) {
      openProject(event, card.project.id, 1);
    });
  });

  pNext.addEventListener("click", function (event) {
    var link = event.target.closest("a.next-project");
    if (link) openProject(event, link.getAttribute("href").slice(2), depth() + 1);
  });

  backLink.addEventListener("click", function (event) {
    event.preventDefault();
    if (depth() > 0) {
      history.go(-depth()); // zurück zur Übersicht, Browser-Verlauf bleibt sauber
    } else {
      history.pushState(null, "", location.pathname + location.search);
      showOverview();
    }
  });

  window.addEventListener("popstate", route);
  route();

  /* ---------- Lightbox (Großansicht) ---------- */
  var dialog = document.querySelector("[data-lightbox]");
  var lightboxReady = dialog && typeof dialog.showModal === "function";

  var stage, media, counter, titleEl, catEl, prevBtn, nextBtn, closeBtn;
  var lbImages = [];
  var lbProject = null;
  var position = 0;
  var lastTrigger = null;

  function openLightbox(project, index, trigger) {
    if (!lightboxReady) {
      window.open(project.images[index].src, "_blank", "noopener");
      return;
    }
    lbProject = project;
    lbImages = project.images;
    lastTrigger = trigger;
    var single = lbImages.length < 2;
    prevBtn.hidden = single;
    nextBtn.hidden = single;
    show(index);
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();
    closeBtn.focus();
  }

  function preload(index) {
    var image = lbImages[(index + lbImages.length) % lbImages.length];
    if (image) new Image().src = image.src;
  }

  function show(index) {
    position = (index + lbImages.length) % lbImages.length;
    var image = lbImages[position];
    var img = el("img", { src: image.src, alt: image.alt || lbProject.title + " – Bild " + (position + 1) });
    media.replaceChildren(img);
    titleEl.textContent = lbProject.title;
    catEl.textContent = lbProject.category;
    counter.innerHTML = "<b>" + (position + 1) + "</b> / " + lbImages.length;
    preload(position + 1);
    preload(position - 1);
  }

  if (!lightboxReady) return;

  stage = dialog.querySelector("[data-lb-stage]");
  media = dialog.querySelector("[data-lb-media]");
  counter = dialog.querySelector("[data-lb-counter]");
  titleEl = dialog.querySelector("[data-lb-title]");
  catEl = dialog.querySelector("[data-lb-cat]");
  prevBtn = dialog.querySelector("[data-lb-prev]");
  nextBtn = dialog.querySelector("[data-lb-next]");
  closeBtn = dialog.querySelector("[data-lb-close]");

  function closeLightbox() {
    if (dialog.open) dialog.close();
  }

  dialog.addEventListener("close", function () {
    media.replaceChildren();
    document.documentElement.style.overflow = "";
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
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
    if (lbImages.length < 2) return;
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
    if (touchX === null || lbImages.length < 2) return;
    var dx = event.changedTouches[0].clientX - touchX;
    var dy = event.changedTouches[0].clientY - touchY;
    touchX = touchY = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      show(dx < 0 ? position + 1 : position - 1);
    }
  });
})();
