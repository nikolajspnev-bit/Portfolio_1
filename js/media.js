/*
 * Liest die Projekte aus js/projekte.js ein und erkennt Videos automatisch
 * (YouTube-, Shorts- und Vimeo-Links oder eigene Videodateien).
 * Wird von der Startseite (Collage) und der Portfolio-Seite genutzt.
 */
(function () {
  "use strict";

  function slugify(text) {
    return String(text)
      .toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // "https://www.youtube.com/watch?v=abc", "youtu.be/abc", "youtube.com/shorts/abc" oder nur "abc"
  function youtubeId(value) {
    var s = String(value || "").trim();
    var m = s.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
    if (m) return m[1];
    return /^[\w-]{11}$/.test(s) ? s : "";
  }

  function vimeoId(value) {
    var m = String(value || "").match(/(\d{6,})/);
    return m ? m[1] : "";
  }

  function isVideoFile(value) {
    return /\.(mp4|m4v|webm|mov)(\?.*)?$/i.test(String(value || ""));
  }

  // Wandelt einen Video-Eintrag (Text oder Objekt) in ein einheitliches Format um
  function parseVideo(entry) {
    var v = typeof entry === "string" ? { link: entry } : entry || {};
    var link = v.link || v.url || "";
    var video = { kind: "", id: "", src: "", cover: v.cover || v.poster || "", title: v.title || v.titel || "", vertical: !!(v.vertical || v.hochformat) };

    var yt = v.youtube || (/youtu/i.test(link) ? link : "");
    var vm = v.vimeo || (/vimeo/i.test(link) ? link : "");
    var file = v.datei || v.video || v.src || (isVideoFile(link) ? link : "");

    if (yt && youtubeId(yt)) {
      video.kind = "youtube";
      video.id = youtubeId(yt);
      if (/\/shorts\//.test(yt)) video.vertical = true;
      if (!video.cover) video.cover = "https://i.ytimg.com/vi/" + video.id + "/hqdefault.jpg";
    } else if (vm && vimeoId(vm)) {
      video.kind = "vimeo";
      video.id = vimeoId(vm);
    } else if (file) {
      video.kind = "file";
      video.src = file;
    } else {
      return null;
    }
    video.type = "video";
    return video;
  }

  function normalizeProjects(list) {
    var usedIds = {};
    return (Array.isArray(list) ? list : [])
      .map(function (raw, index) {
        var images = (raw.images || raw.bilder || [])
          .map(function (img) {
            return typeof img === "string" ? { src: img } : img;
          })
          .filter(function (img) {
            return img && img.src;
          })
          .map(function (img) {
            return { type: "image", src: img.src, alt: img.alt || "" };
          });

        var videoEntries = [].concat(raw.videos || []);
        // ältere Schreibweise: ein Video direkt am Projekt
        if (raw.youtube) videoEntries.unshift({ youtube: raw.youtube, vertical: raw.vertical });
        if (raw.vimeo) videoEntries.unshift({ vimeo: raw.vimeo, vertical: raw.vertical });
        if (raw.video) videoEntries.unshift({ datei: raw.video, vertical: raw.vertical });
        var videos = videoEntries.map(parseVideo).filter(Boolean);

        var id = slugify(raw.id || raw.title || "projekt-" + (index + 1)) || "projekt-" + (index + 1);
        if (usedIds[id]) id += "-" + (index + 1);
        usedIds[id] = true;

        var firstVideoCover = videos.filter(function (v) { return v.cover; })[0];
        return {
          id: id,
          title: raw.title || "Projekt",
          category: raw.category || "",
          date: raw.date || "",
          location: raw.location || "",
          description: raw.description || "",
          featured: !!raw.featured,
          cover: raw.cover || (images[0] && images[0].src) || (firstVideoCover && firstVideoCover.cover) || "",
          images: images,
          videos: videos,
        };
      })
      .filter(function (project) {
        return project.cover || project.videos.length;
      });
  }

  window.PortfolioMedia = {
    normalizeProjects: normalizeProjects,
    parseVideo: parseVideo,
    youtubeId: youtubeId,
  };
})();
