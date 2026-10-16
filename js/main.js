/*
 * Allgemeine Funktionen für alle Seiten:
 * Header, Einblend-Animationen, Hero-Collage und Instagram-Feed.
 * Einstellungen findest du in js/config.js.
 */
(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};
  var insta = config.instagram || {};

  /* ---------- kleine Helfer ---------- */
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

  var ICONS = {
    external:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    instagram:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    video:
      '<svg class="media-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z"/></svg>',
    carousel:
      '<svg class="media-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><rect x="7" y="7" width="14" height="14" rx="2"/><path d="M3 17V5a2 2 0 0 1 2-2h12"/></svg>',
  };

  /* ---------- Jahr im Footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  /* ---------- Header-Linie beim Scrollen ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Einblenden beim Scrollen ---------- */
  function observeReveals(root) {
    var items = (root || document).querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach(function (item) {
      observer.observe(item);
    });
  }
  observeReveals();

  /* ---------- Instagram-Name überall einsetzen ---------- */
  var username = (insta.username || "").replace(/^@/, "").trim();
  var profileUrl = username ? "https://www.instagram.com/" + encodeURIComponent(username) + "/" : "https://www.instagram.com/";
  document.querySelectorAll("[data-insta-profile]").forEach(function (link) {
    link.href = profileUrl;
  });
  document.querySelectorAll("[data-insta-handle]").forEach(function (node) {
    node.textContent = "@" + username;
  });

  /* ---------- YouTube-Kanal-Link überall einsetzen ---------- */
  var ytConfig = config.youtube || {};
  if (ytConfig.channelUrl) {
    document.querySelectorAll("[data-yt-channel]").forEach(function (link) {
      link.href = ytConfig.channelUrl;
    });
    var ytHandle = ytConfig.channelUrl.match(/@([\w.-]+)/);
    document.querySelectorAll("[data-yt-handle]").forEach(function (node) {
      node.textContent = ytHandle ? "@" + ytHandle[1] : "Kanal";
    });
  }

  /* ---------- Hero-Collage (Startseite) ---------- */
  var collage = document.querySelector("[data-hero-collage]");
  if (collage && window.PortfolioMedia) {
    var heroProjects = window.PortfolioMedia.normalizeProjects(window.PROJECTS);
    var CARDS = 3;
    var isPhoto = function (src) {
      return src && !/\.svg$/i.test(src); // Platzhalter-Grafiken nie auf der Startseite zeigen
    };

    // Bilder pro Projekt: die unter "startseite" gewählten, sonst das Cover der "featured"-Projekte
    var picksPerProject = heroProjects
      .map(function (project) {
        var list = project.highlights.length ? project.highlights : project.featured ? [project.cover] : [];
        return list.filter(isPhoto).map(function (src) {
          return { src: src, project: project.id };
        });
      })
      .filter(function (list) {
        return list.length;
      });
    // zu wenig ausgewählt? Dann mit den Covern der übrigen echten Projekte auffüllen
    if (picksPerProject.length < CARDS) {
      heroProjects.forEach(function (project) {
        var known = picksPerProject.some(function (list) { return list[0].project === project.id; });
        if (!known && isPhoto(project.cover) && picksPerProject.length < CARDS) {
          picksPerProject.push([{ src: project.cover, project: project.id }]);
        }
      });
    }

    // Reißverschluss: erst von jedem Projekt das erste Bild, dann das zweite …
    // und so auf die Karten verteilt, dass jede Karte nach und nach alle Projekte zeigt
    var queues = [[], [], []];
    var rounds = Math.max.apply(null, [0].concat(picksPerProject.map(function (list) { return list.length; })));
    for (var round = 0; round < rounds; round++) {
      var slot = 0;
      picksPerProject.forEach(function (list) {
        if (!list[round]) return;
        queues[(slot + round) % CARDS].push(list[round]);
        slot++;
      });
    }
    queues = queues.filter(function (queue) { return queue.length; });

    var shown = [];
    queues.forEach(function (queue, index) {
      var card = el("span", { class: "card" }, [el("img", { src: queue[0].src, alt: "", loading: "eager", decoding: "async" })]);
      collage.appendChild(card);
      shown.push({ card: card, queue: queue, pos: 0 });
    });
    if (collage.children.length) {
      collage.appendChild(el("span", { class: "sticker", html: "Foto<br>✦<br>Video" }));
    }

    // Bilder durchwechseln: alle 4,5 Sekunden ist eine Karte dran, jede Karte also alle 13,5 Sekunden
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var canRotate = shown.some(function (entry) { return entry.queue.length > 1; });
    if (canRotate && !reduceMotion) {
      var onScreen = true;
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          onScreen = entries[0].isIntersecting;
        }).observe(collage);
      }
      var turn = 0;
      var advance = function (entry) {
        var queue = entry.queue;
        if (queue.length < 2) return;
        // nächstes Bild, das gerade nicht schon auf einer anderen Karte zu sehen ist
        var visible = shown.map(function (other) { return other.queue[other.pos].project; });
        var next = (entry.pos + 1) % queue.length;
        for (var tries = 0; tries < queue.length - 1; tries++) {
          var candidate = (entry.pos + 1 + tries) % queue.length;
          if (visible.indexOf(queue[candidate].project) === -1) {
            next = candidate;
            break;
          }
        }
        var img = el("img", { src: queue[next].src, alt: "", decoding: "async", class: "is-entering" });
        var swap = function () {
          entry.pos = next;
          entry.card.appendChild(img);
          void img.offsetWidth; // Startzustand übernehmen, damit die Überblendung läuft
          img.classList.remove("is-entering");
          setTimeout(function () {
            while (entry.card.firstChild && entry.card.firstChild !== img) entry.card.removeChild(entry.card.firstChild);
          }, 1700);
        };
        if (img.decode) img.decode().then(swap, swap);
        else img.onload = swap;
      };
      setInterval(function () {
        if (document.hidden || !onScreen) return;
        advance(shown[turn % shown.length]);
        turn++;
      }, 4500);
    }

    // "Neu"-Hinweis zum neuesten Projekt (Feld "neu" in js/projekte.js)
    var newest = heroProjects.filter(function (project) { return project.newLabel; })[0];
    var visual = document.querySelector("[data-hero-visual]");
    if (newest && visual && collage.children.length) {
      visual.appendChild(
        el("a", { class: "hero-new", href: "portfolio.html#/" + newest.id }, [
          el("span", { class: "hero-new-tag", text: "Neu" }),
          el("span", { class: "hero-new-text", text: newest.newLabel }),
          el("span", { class: "hero-new-arrow", html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' }),
        ])
      );
    }
  }

  /* ---------- Instagram-Feed ---------- */
  var feedBox = document.querySelector("[data-insta-feed]");
  if (!feedBox) return;

  var dateFormat = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric" });

  function renderFallback() {
    var link = el("a", { class: "btn btn-primary", href: profileUrl, target: "_blank", rel: "noopener" });
    link.innerHTML = ICONS.instagram + " Zu Instagram " + ICONS.external;
    feedBox.replaceChildren(
      el("div", { class: "insta-fallback" }, [
        el("span", { class: "ig-icon", html: ICONS.instagram }),
        el("h3", { text: "Folge mir auf Instagram" }),
        el("span", { class: "handle", text: "@" + username }),
        el("p", { text: "Dort findest du meine neuesten Fotos, Reels und Blicke hinter die Kulissen." }),
        link,
      ])
    );
  }

  // Unterstützt das aktuelle Behold-Format ({ posts: [...] }) und das ältere (nur ein Array).
  function normalizePosts(data) {
    var posts = Array.isArray(data) ? data : (data && data.posts) || [];
    return posts
      .map(function (post) {
        var sizes = post.sizes || {};
        var isVideo = post.mediaType === "VIDEO";
        var fallbackImage = isVideo ? post.thumbnailUrl : post.mediaUrl;
        return {
          url: post.permalink,
          image: (sizes.large && sizes.large.mediaUrl) || fallbackImage,
          thumb: (sizes.medium && sizes.medium.mediaUrl) || fallbackImage,
          caption: (post.prunedCaption || post.caption || "").trim(),
          date: post.timestamp ? new Date(post.timestamp) : null,
          type: post.mediaType,
        };
      })
      .filter(function (post) {
        return post.url && post.image;
      })
      .sort(function (a, b) {
        return (b.date || 0) - (a.date || 0);
      });
  }

  function mediaIcon(type) {
    if (type === "VIDEO") return ICONS.video;
    if (type === "CAROUSEL_ALBUM") return ICONS.carousel;
    return "";
  }

  function shorten(text, max) {
    return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, "") + " …" : text;
  }

  function postLink(post, extraClass, children) {
    var link = el("a", { class: "insta-post" + (extraClass ? " " + extraClass : ""), href: post.url, target: "_blank", rel: "noopener" }, children);
    link.insertAdjacentHTML("beforeend", mediaIcon(post.type));
    return link;
  }

  function renderPosts(posts) {
    // Layout je nach Anzahl der Posts, damit keine Lücken entstehen:
    //   1 Post      → einzeln, mittig
    //   2–4 Posts   → alle gleich groß im Hochformat nebeneinander (max. 3)
    //   5+ Posts    → ein großer Post + 4 kleine im 2×2-Raster
    var count = Math.min(posts.length, Math.max(1, insta.postCount || 5));
    var layout = count >= 5 ? "bento" : count > 1 ? "row" : "single";
    count = layout === "bento" ? 5 : Math.min(count, 3);

    var latest = posts[0];
    var more = posts.slice(1, count);
    var dateText = latest.date && !isNaN(latest.date) ? dateFormat.format(latest.date) : "";
    var altText = latest.caption ? shorten(latest.caption, 120) : "Neuester Instagram-Post";

    var caption = el("div", { class: "insta-caption" }, [
      dateText ? el("time", { datetime: latest.date.toISOString(), text: dateText }) : null,
      latest.caption ? el("p", { text: shorten(latest.caption, 180) }) : null,
      el("span", { class: "open", html: "Auf Instagram ansehen " + ICONS.external }),
    ]);

    var latestLink = postLink(latest, "insta-post--latest", [
      el("img", { src: latest.image, alt: altText, decoding: "async" }),
      el("span", { class: "insta-badge", text: "Neuester Post" }),
      caption,
    ]);

    var grid = el("div", { class: "insta-grid is-" + layout, "data-count": String(count) }, [latestLink]);
    grid.style.setProperty("--cols", String(count));

    var smallPosts = more.map(function (post) {
      return postLink(post, "", [
        el("img", {
          src: layout === "row" ? post.image : post.thumb, // in der Reihe sind die Posts groß → große Bildversion
          alt: post.caption ? shorten(post.caption, 100) : "Instagram-Post",
          loading: "lazy",
          decoding: "async",
        }),
      ]);
    });

    if (layout === "bento") {
      grid.appendChild(el("div", { class: "insta-more" }, smallPosts));
    } else {
      smallPosts.forEach(function (link) {
        grid.appendChild(link);
      });
    }

    feedBox.replaceChildren(grid);
  }

  if (!insta.feedUrl) {
    renderFallback();
    return;
  }

  var controller = "AbortController" in window ? new AbortController() : null;
  var timeout = setTimeout(function () {
    if (controller) controller.abort();
  }, 8000);

  fetch(insta.feedUrl, controller ? { signal: controller.signal } : undefined)
    .then(function (response) {
      if (!response.ok) throw new Error("Feed nicht erreichbar (" + response.status + ")");
      return response.json();
    })
    .then(function (data) {
      var posts = normalizePosts(data);
      if (!posts.length) throw new Error("Feed ist leer");
      renderPosts(posts);
    })
    .catch(function (error) {
      console.warn("Instagram-Feed konnte nicht geladen werden:", error);
      renderFallback();
    })
    .finally(function () {
      clearTimeout(timeout);
    });
})();
