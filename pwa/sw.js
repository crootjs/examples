// Service worker contoh ini. Harus berada di domain dan folder situs sendiri; isinya dari CrootJS.
importScripts("https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.33/serviceworker.min.js");

crootjsServiceWorker({
    version: "1",
    precache: [
        "./",
        "style.css",
        "index.js",
        "manifest.webmanifest",
        "icons/icon-192.png",
        "icons/icon-512.png",
        "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.33/croot.min.css",
        "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.33/pwa.min.js",
        "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.33/storage.min.js"
    ]
});
