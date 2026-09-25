/*
 * YouTube-Bereich auf der Startseite: zeigt automatisch die neuesten Videos
 * deines Kanals. Ein Klick öffnet das Video auf YouTube.
 * Einstellungen in js/config.js (youtube.channelId).
 *
 * Technik: YouTube stellt für jeden Kanal einen öffentlichen RSS-Feed bereit.
 * Weil Browser diesen nicht direkt lesen dürfen, wird er über rss2json.com geladen
 * (kostenlos, ohne Anmeldung).
 */
(function () {
  "use strict";

  var box = document.querySelector("[data-yt-feed]");
  if (!box) return;

  var yt = (window.SITE_CONFIG && window.SITE_CONFIG.youtube) || {};
  var channelUrl = yt.channelUrl || "https://www.youtube.com/";
  var handleMatch = channelUrl.match(/@([\w.-]+)/);
  var handle = handleMatch ? "@" + handleMatch[1] : "";
  // Kanal-ID auch aus einem kompletten Link wie youtube.com/channel/UC… herauslesen
  var idMatch = String(yt.channelId || "").match(/UC[\w-]{22}/);
  var channelId = idMatch ? idMatch[0] : "";

  var ICONS = {
    youtube:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.8 15.1V8.9l5.4 3.1-5.4 3.1Z"/></svg>',
    play:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z"/></svg>',
    external:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  };

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

  var dateFormat = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric" });

  function renderFallback() {
    var link = el("a", { class: "btn btn-primary", href: channelUrl, target: "_blank", rel: "noopener" });
    link.innerHTML = ICONS.youtube + " Zum Kanal " + ICONS.external;
    box.replaceChildren(
      el("div", { class: "insta-fallback" }, [
        el("span", { class: "ig-icon", html: ICONS.youtube }),
        el("h3", { text: "Abonniere meinen YouTube-Kanal" }),
        handle ? el("span", { class: "handle", text: handle }) : null,
        el("p", { text: "Dort findest du meine neuesten Videos und Projekte in voller Länge." }),
        link,
      ])
    );
  }

  function videoIdOf(item) {
    var m = String(item.guid || "").match(/yt:video:([\w-]{11})/) || String(item.link || "").match(/(?:v=|\/shorts\/|youtu\.be\/)([\w-]{11})/);
    return m ? m[1] : "";
  }

  function parseDate(text) {
    // rss2json liefert "2026-09-24 18:30:00" (UTC)
    var d = new Date(String(text || "").replace(" ", "T") + (/Z|[+-]\d\d:?\d\d$/.test(text) ? "" : "Z"));
    return isNaN(d) ? null : d;
  }

  function normalize(data) {
    var items = (data && data.items) || [];
    return items
      .map(function (item) {
        var id = videoIdOf(item);
        var isShort = /\/shorts\//.test(item.link || "");
        return {
          id: id,
          title: item.title || "",
          url: isShort ? "https://www.youtube.com/shorts/" + id : "https://www.youtube.com/watch?v=" + id,
          date: parseDate(item.pubDate),
          isShort: isShort,
        };
      })
      .filter(function (video) {
        return video.id && (yt.shorts !== false || !video.isShort);
      })
      .sort(function (a, b) {
        return (b.date || 0) - (a.date || 0);
      });
  }

  // Großes Vorschaubild; falls es das bei einem Video nicht gibt, das normale nehmen
  function thumb(id, big) {
    var img = el("img", {
      src: "https://i.ytimg.com/vi/" + id + (big ? "/maxresdefault.jpg" : "/hqdefault.jpg"),
      alt: "",
      loading: big ? "eager" : "lazy",
      decoding: "async",
    });
    if (big) {
      var fallback = function () {
        if (img.src.indexOf("maxresdefault") !== -1) img.src = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
      };
      img.addEventListener("error", fallback);
      img.addEventListener("load", function () {
        if (img.naturalWidth <= 120) fallback(); // YouTube liefert sonst ein graues Platzhalterbild
      });
    }
    return img;
  }

  function dateText(video) {
    return video.date ? dateFormat.format(video.date) : "";
  }

  function render(videos) {
    var latest = videos[0];
    var more = videos.slice(1, Math.max(1, yt.videoCount || 4));

    var latestLink = el("a", { class: "yt-latest", href: latest.url, target: "_blank", rel: "noopener" }, [
      el("span", { class: "yt-thumb" }, [
        thumb(latest.id, true),
        el("span", { class: "insta-badge", text: latest.isShort ? "Neuester Short" : "Neuestes Video" }),
        el("span", { class: "video-play", html: ICONS.play }),
      ]),
      el("span", { class: "yt-latest-info" }, [
        latest.date ? el("time", { datetime: latest.date.toISOString(), text: dateText(latest) }) : null,
        el("span", { class: "yt-latest-title", text: latest.title }),
        el("span", { class: "open", html: "Auf YouTube ansehen " + ICONS.external }),
      ]),
    ]);

    var grid = el("div", { class: "yt-grid" + (more.length ? " has-more" : "") }, [latestLink]);

    if (more.length) {
      var list = el("ul", { class: "yt-list" });
      more.forEach(function (video) {
        list.appendChild(
          el("li", {}, [
            el("a", { class: "yt-item", href: video.url, target: "_blank", rel: "noopener" }, [
              el("span", { class: "yt-thumb" }, [thumb(video.id, false), el("span", { class: "yt-mini-play", html: ICONS.play })]),
              el("span", { class: "yt-item-text" }, [
                el("span", { class: "yt-item-title", text: video.title }),
                video.date ? el("time", { datetime: video.date.toISOString(), text: dateText(video) }) : null,
              ]),
            ]),
          ])
        );
      });
      grid.appendChild(list);
    }

    box.replaceChildren(grid);
  }

  if (!channelId) {
    renderFallback();
    return;
  }

  var feedUrl = "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelId;
  var apiUrl = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(feedUrl);

  var controller = "AbortController" in window ? new AbortController() : null;
  var timeout = setTimeout(function () {
    if (controller) controller.abort();
  }, 8000);

  fetch(apiUrl, controller ? { signal: controller.signal } : undefined)
    .then(function (response) {
      if (!response.ok) throw new Error("Feed nicht erreichbar (" + response.status + ")");
      return response.json();
    })
    .then(function (data) {
      if (data && data.status && data.status !== "ok") throw new Error(data.message || "Feed-Fehler");
      var videos = normalize(data);
      if (!videos.length) throw new Error("Keine Videos gefunden");
      render(videos);
    })
    .catch(function (error) {
      console.warn("YouTube-Feed konnte nicht geladen werden:", error);
      renderFallback();
    })
    .finally(function () {
      clearTimeout(timeout);
    });
})();
