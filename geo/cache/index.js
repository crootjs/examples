import { createMap } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.38/map.min.js";
import { cachedTiles } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.38/mapcache.min.js";
import { onClick, setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.38/element.min.js";

const tiles = cachedTiles(undefined, { name: "contoh-crootjs-osm" });
createMap("map", { tiles, center: [107.6098, -6.9147], zoom: 15 });

async function showCount() {
    const count = await tiles.count();
    setInnerText("status", `${count} tile tersimpan${navigator.onLine ? "" : " (sedang offline)"}.`);
}

showCount();
onClick("hitung", showCount);
onClick("hapus", async () => {
    // Tile yang sudah tampil tetap di layar; yang dimuat berikutnya disimpan lagi dari awal.
    await tiles.clear();
    showCount();
});
window.addEventListener("online", showCount);
window.addEventListener("offline", showCount);
