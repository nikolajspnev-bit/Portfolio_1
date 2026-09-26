/*
 * Kontaktformular auf der Startseite.
 * Die Anfrage wird über FormSubmit (formsubmit.co) als E-Mail an dich geschickt.
 * Einstellungen in js/config.js (kontakt.email / kontakt.formEndpoint).
 *
 * Tipp: Mit einem Link wie  index.html?art=event#kontakt  ist die Art des Shootings
 * schon vorausgewählt (wird z. B. von der Portfolio-Seite genutzt); ?art=analog hakt
 * "Auch analoge Fotos" an.
 */
(function () {
  "use strict";

  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var cfg = (window.SITE_CONFIG && window.SITE_CONFIG.kontakt) || {};
  var toEmail = cfg.email || "nikolajtry.media@gmail.com";
  var endpoint = cfg.formEndpoint || "";

  var body = form.querySelector("[data-form-body]");
  var status = form.querySelector("[data-form-status]");
  var submitBtn = form.querySelector("[data-submit]");
  var submitLabel = form.querySelector("[data-submit-label]");
  var eventBox = form.querySelector("[data-event-types]");
  var otherBox = form.querySelector("[data-other-box]");
  var phoneLink = document.querySelector('a[href^="tel:"]');

  var ART_LABELS = {
    portrait: "Portraits",
    event: "Events",
    produkt: "Produktbilder",
    unternehmen: "Unternehmensbilder",
    automotive: "Auto-Shooting",
    "social-media": "Social Media Content",
    sonstiges: "Sonstiges",
  };

  var ICONS = {
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    mail:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>',
  };

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      if (key === "text") node.textContent = attrs[key];
      else if (key === "html") node.innerHTML = attrs[key];
      else node.setAttribute(key, attrs[key]);
    });
    (children || []).forEach(function (child) {
      if (child) node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  function radioValue(name) {
    var checked = form.querySelector('input[name="' + name + '"]:checked');
    return checked ? checked.value : "";
  }

  /* ---------- Zusatzfelder: Event-Auswahl bei "Events", Textfeld bei "Sonstiges" ---------- */
  function syncSubBoxes() {
    var art = radioValue("art");
    var showEvent = art === "event";
    eventBox.hidden = !showEvent;
    if (!showEvent) {
      form.querySelectorAll('input[name="anlass"]').forEach(function (input) {
        input.checked = false;
      });
    }
    var showOther = art === "sonstiges";
    otherBox.hidden = !showOther;
    if (!showOther) {
      form.elements.sonstiges.value = "";
      setError(OTHER_CHECK, ""); // alte Fehlermeldung entfernen
    }
  }

  /* ---------- Vorauswahl über den Link (?art=event) ---------- */
  var preset = new URLSearchParams(location.search).get("art");
  if (preset === "analog") {
    form.elements.analog.checked = true; // vom Analog-Projekt im Portfolio
  } else if (preset && /^[a-z-]+$/.test(preset)) {
    var presetRadio = form.querySelector('input[name="art"][value="' + preset + '"]');
    if (presetRadio) presetRadio.checked = true;
  }

  /* ---------- Prüfung der Eingaben ---------- */
  var CHECKS = [
    { name: "vorname", error: "cf-vorname-error", msg: "Bitte gib deinen Vornamen ein.",
      test: function (v) { return v.trim().length >= 2; } },
    { name: "nachname", error: "cf-nachname-error", msg: "Bitte gib deinen Nachnamen ein.",
      test: function (v) { return v.trim().length >= 2; } },
    { name: "email", error: "cf-email-error", msg: "Bitte gib eine gültige E-Mail-Adresse ein.",
      test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } },
    { name: "telefon", error: "cf-telefon-error", msg: "Bitte gib eine gültige Telefonnummer ein – oder lass das Feld leer.",
      test: function (v) { v = v.trim(); return !v || (/^[+()\d\s\/.-]+$/.test(v) && v.replace(/\D/g, "").length >= 6); } },
    { name: "art", error: "cf-art-error", radio: true, msg: "Bitte wähle aus, was für ein Shooting oder Dreh du dir wünschst." },
    // Pflicht nur, wenn "Sonstiges" gewählt ist
    { name: "sonstiges", error: "cf-sonstiges-error", msg: "Bitte schreib kurz, worum es geht – z. B. „Tiershooting“.",
      test: function (v) { return radioValue("art") !== "sonstiges" || v.trim().length >= 2; } },
    { name: "datenschutz", error: "cf-consent-error", checkbox: true, msg: "Bitte stimme zu, damit ich deine Anfrage bearbeiten darf." },
  ];

  var OTHER_CHECK = CHECKS.filter(function (check) { return check.name === "sonstiges"; })[0];
  syncSubBoxes();

  function fieldOf(check) {
    if (check.radio) return form.querySelector('input[name="' + check.name + '"]').closest("fieldset");
    return form.elements[check.name];
  }

  function focusTargetOf(check) {
    return check.radio ? form.querySelector('input[name="' + check.name + '"]') : form.elements[check.name];
  }

  function isValid(check) {
    if (check.radio) return !!radioValue(check.name);
    if (check.checkbox) return form.elements[check.name].checked;
    return check.test(form.elements[check.name].value);
  }

  function setError(check, message) {
    var errorEl = document.getElementById(check.error);
    if (errorEl) errorEl.textContent = message || "";
    var field = fieldOf(check);
    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
  }

  function validateAll() {
    var firstInvalid = null;
    CHECKS.forEach(function (check) {
      var ok = isValid(check);
      setError(check, ok ? "" : check.msg);
      if (!ok && !firstInvalid) firstInvalid = focusTargetOf(check);
    });
    return firstInvalid;
  }

  // Fehler verschwinden, sobald das Feld korrigiert wird
  form.addEventListener("input", onChange);
  form.addEventListener("change", onChange);
  function onChange(event) {
    var name = event.target.name;
    if (name === "art") syncSubBoxes();
    CHECKS.forEach(function (check) {
      if (check.name === name && document.getElementById(check.error).textContent && isValid(check)) setError(check, "");
    });
  }

  /* ---------- Daten zusammenstellen ---------- */
  function formatDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    return m ? m[3] + "." + m[2] + "." + m[1] : iso;
  }

  function collect() {
    var f = form.elements;
    var art = ART_LABELS[radioValue("art")] || radioValue("art");
    var anlass = radioValue("anlass");
    var sonstiges = radioValue("art") === "sonstiges" ? f.sonstiges.value.trim() : "";
    return {
      vorname: f.vorname.value.trim(),
      nachname: f.nachname.value.trim(),
      email: f.email.value.trim(),
      telefon: f.telefon.value.trim(),
      art: art + (anlass ? " (" + anlass + ")" : "") + (sonstiges ? " (" + sonstiges + ")" : ""),
      medium: radioValue("medium"),
      analog: f.analog.checked,
      datum: formatDate(f.datum.value),
      ort: f.ort.value.trim(),
      nachricht: f.nachricht.value.trim(),
      honey: f._honey.value,
    };
  }

  function mailFields(v) {
    return [
      ["Name", v.vorname + " " + v.nachname],
      ["E-Mail", v.email],
      ["Telefon", v.telefon || "–"],
      ["Art des Shootings / Drehs", v.art],
      ["Foto / Video", v.medium || "–"],
      ["Analoge Fotos (Film)", v.analog ? "Ja, gewünscht" : "–"],
      ["Wunschtermin", v.datum || "–"],
      ["Ort", v.ort || "–"],
      ["Nachricht", v.nachricht || "–"],
    ];
  }

  function subjectOf(v) {
    return "Neue Anfrage: " + v.art + " – " + v.vorname + " " + v.nachname;
  }

  function mailtoLink(v) {
    var text = mailFields(v)
      .map(function (row) {
        return row[0] + ": " + row[1];
      })
      .join("\r\n");
    return "mailto:" + toEmail + "?subject=" + encodeURIComponent(subjectOf(v)) + "&body=" + encodeURIComponent(text);
  }

  /* ---------- Rückmeldungen ---------- */
  function setSending(on) {
    submitBtn.disabled = on;
    submitLabel.textContent = on ? "Wird gesendet …" : "Anfrage senden";
    form.setAttribute("aria-busy", on ? "true" : "false");
  }

  function showSuccess(v) {
    var again = el("button", { class: "btn btn-ghost", type: "button", text: "Weitere Anfrage senden" });
    again.addEventListener("click", function () {
      form.reset();
      syncSubBoxes();
      status.replaceChildren();
      body.hidden = false;
      form.elements.vorname.focus();
    });
    body.hidden = true;
    status.replaceChildren(
      el("div", { class: "status-box" }, [
        el("span", { class: "status-icon", html: ICONS.check }),
        el("h3", { text: "Danke, " + v.vorname + "!" }),
        el("p", {
          text:
            "Deine Anfrage ist bei mir angekommen. Ich melde mich so schnell wie möglich bei dir – per E-Mail an " +
            v.email + (v.telefon ? " oder telefonisch." : "."),
        }),
        el("div", { class: "status-actions" }, [again]),
      ])
    );
    status.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showError(v, message) {
    var needsActivation = /activat/i.test(message || "");
    var mail = el("a", { class: "btn btn-primary", href: mailtoLink(v), html: ICONS.mail + " Per E-Mail senden" });
    var actions = el("div", { class: "status-actions" }, [mail]);
    if (phoneLink) actions.appendChild(el("a", { class: "btn btn-ghost", href: phoneLink.getAttribute("href"), text: "Anrufen" }));
    status.replaceChildren(
      el("div", { class: "status-box is-error" }, [
        el("p", {}, [
          el("strong", { text: "Das hat leider nicht geklappt. " }),
          needsActivation
            ? "Das Formular wird gerade eingerichtet. Schick mir deine Anfrage bitte per E-Mail – deine Angaben sind dort schon eingetragen."
            : "Deine Anfrage konnte gerade nicht gesendet werden. Schick sie mir einfach per E-Mail – deine Angaben sind dort schon eingetragen.",
        ]),
        actions,
      ])
    );
    status.focus({ preventScroll: true });
  }

  /* ---------- Absenden ---------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (form.getAttribute("aria-busy") === "true") return;

    var firstInvalid = validateAll();
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    var v = collect();
    if (v.honey) {
      showSuccess(v); // Spam-Bot: so tun, als hätte es geklappt
      return;
    }

    if (!endpoint) {
      window.location.href = mailtoLink(v); // kein Formular-Dienst eingestellt → E-Mail-Programm öffnen
      return;
    }

    var payload = {
      _subject: subjectOf(v),
      _template: "table",
      _captcha: "false",
      _replyto: v.email,
      email: v.email,
    };
    mailFields(v).forEach(function (row) {
      if (row[0] !== "E-Mail") payload[row[0]] = row[1];
    });

    setSending(true);
    status.replaceChildren();
    var controller = "AbortController" in window ? new AbortController() : null;
    var timeout = setTimeout(function () {
      if (controller) controller.abort();
    }, 15000);

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined,
    })
      .then(function (response) {
        return response
          .json()
          .catch(function () {
            return {};
          })
          .then(function (data) {
            var ok = response.ok && (data.success === true || data.success === "true" || data.ok === true);
            if (!ok) throw new Error(data.message || "Senden fehlgeschlagen (" + response.status + ")");
          });
      })
      .then(function () {
        showSuccess(v);
      })
      .catch(function (error) {
        console.warn("Kontaktformular:", error);
        showError(v, error && error.message);
      })
      .finally(function () {
        clearTimeout(timeout);
        setSending(false);
      });
  });
})();
