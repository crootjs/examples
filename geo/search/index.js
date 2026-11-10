// Pencarian tempat dan alamat: kotak pencarian di peta, dan alamat dari titik yang diklik.
import { createMap, onMapClick, showPopup } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.28/map.min.js";
import { addSearchControl, reverseGeocode } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.28/mapsearch.min.js";
import { setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.28/element.min.js";

createMap("map", { center: [107.6098, -6.9147], zoom: 13 });

addSearchControl("map", {
    countryCodes: "id",
    language: "id",
    onSelect: (result) => setInnerText("status", `${result.name} (${result.position[1].toFixed(5)}, ${result.position[0].toFixed(5)})`),
});

onMapClick("map", async (position) => {
    setInnerText("status", "Mencari alamat...");
    const result = await reverseGeocode(position, null, { language: "id" });
    const text = result ? result.name : "Tidak ada alamat di titik ini.";
    setInnerText("status", text);
    showPopup("map", position, text);
});
