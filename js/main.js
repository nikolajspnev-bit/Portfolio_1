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
    var withCover = window.PortfolioMedia.normalizeProjects(window.PROJECTS).filter(function (project) {
      return project.cover;
    });
    var featured = withCover.filter(function (project) {
      return project.featured;
    });
    featured = featured.concat(
      withCover.filter(function (project) {
        return !project.featured;
      })
    );
    featured.slice(0, 3).forEach(function (project) {
      collage.appendChild(
        el("span", { class: "card" }, [el("img", { src: project.cover, alt: "", loading: "eager", decoding: "async" })])
      );
    });
    if (collage.children.length) {
      collage.appendChild(el("span", { class: "sticker", html: "Foto<br>✦<br>Video" }));
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

  function renderPosts(posts) {
    var latest = posts[0];
    var more = posts.slice(1, Math.max(1, insta.postCount || 5));
    var dateText = latest.date && !isNaN(latest.date) ? dateFormat.format(latest.date) : "";
    var altText = latest.caption ? shorten(latest.caption, 120) : "Neuester Instagram-Post";

    var caption = el("div", { class: "insta-caption" }, [
      dateText ? el("time", { datetime: latest.date.toISOString(), text: dateText }) : null,
      latest.caption ? el("p", { text: shorten(latest.caption, 180) }) : null,
      el("span", { class: "open", html: "Auf Instagram ansehen " + ICONS.external }),
    ]);

    var latestLink = el(
      "a",
      { class: "insta-post insta-post--latest", href: latest.url, target: "_blank", rel: "noopener" },
      [el("img", { src: latest.image, alt: altText, decoding: "async" }), el("span", { class: "insta-badge", text: "Neuester Post" }), caption]
    );
    latestLink.insertAdjacentHTML("beforeend", mediaIcon(latest.type));

    var grid = el("div", { class: "insta-grid" + (more.length ? " has-more" : "") }, [latestLink]);

    if (more.length) {
      var moreBox = el("div", { class: "insta-more" });
      more.forEach(function (post) {
        var link = el("a", { class: "insta-post", href: post.url, target: "_blank", rel: "noopener" }, [
          el("img", {
            src: post.thumb,
            alt: post.caption ? shorten(post.caption, 100) : "Instagram-Post",
            loading: "lazy",
            decoding: "async",
          }),
        ]);
        link.insertAdjacentHTML("beforeend", mediaIcon(post.type));
        moreBox.appendChild(link);
      });
      grid.appendChild(moreBox);
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
