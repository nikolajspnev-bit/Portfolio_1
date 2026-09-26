/*
 * ============================================================
 *  EINSTELLUNGEN – hier kannst du alles Wichtige anpassen
 * ============================================================
 */
window.SITE_CONFIG = {
  instagram: {
    // Dein Instagram-Name (ohne @). Wird für den "Folgen"-Button genutzt.
    username: "nikolajtry",

    // Damit immer automatisch dein NEUESTER Post angezeigt wird, brauchst du
    // einen kostenlosen Feed von https://behold.so (Anleitung in README.md).
    // Trage hier die Feed-URL ein, z. B. "https://feeds.behold.so/AbC123xyz".
    // Solange das Feld leer ist, zeigt die Seite eine "Folge mir"-Karte an.
    feedUrl: "https://feeds.behold.so/uVALLJu02kJpRy2On70Y",

    // Wie viele Posts höchstens angezeigt werden. Das Layout passt sich an:
    //   3 = alle gleich groß nebeneinander, 5 = ein großer + 4 kleine daneben.
    // Hat dein Feed weniger Posts, wird automatisch das passende Layout gewählt.
    postCount: 5,
  },

  youtube: {
    // Link zu deinem YouTube-Kanal (für den "Abonnieren"-Button).
    channelUrl: "https://www.youtube.com/@nikolajtry",

    // Damit automatisch deine NEUESTEN Videos erscheinen, trage hier deine
    // Kanal-ID ein – sie beginnt mit "UC…" (wo du sie findest: siehe README.md).
    // Solange das Feld leer ist, zeigt die Seite eine "Abonnieren"-Karte an.
    channelId: "UCS1gYw85ppcSfh2U5Exw0pA",

    // Wie viele Videos angezeigt werden (1 = nur das neueste, größer = 1 großes + kleine daneben).
    videoCount: 1,

    // Sollen YouTube Shorts auch angezeigt werden? (true = ja, false = nein)
    shorts: false,
  },

  kontakt: {
    // An diese Adresse gehen die Anfragen aus dem Kontaktformular.
    email: "nikolajtry.media@gmail.com",

    // Dienst, der das Formular per E-Mail an dich weiterleitet (FormSubmit, kostenlos, ohne Anmeldung).
    // WICHTIG: Beim allerersten Absenden schickt FormSubmit dir eine E-Mail mit "Activate Form" –
    // einmal draufklicken, danach kommen alle Anfragen automatisch bei dir an.
    formEndpoint: "https://formsubmit.co/ajax/nikolajtry.media@gmail.com",
  },
};
