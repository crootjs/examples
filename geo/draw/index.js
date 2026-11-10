// Menggambar dan mengubah geometri di peta; hasilnya GeoJSON yang diukur dan bisa diunduh.
import { createMap } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.27/map.min.js";
import { addScaleBar } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.27/mapcontrol.min.js";
import { addDrawControl } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.27/mapdraw.min.js";
import { getLength, getArea } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.27/geomeasure.min.js";
import { formatLength, formatArea } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.27/maptools.min.js";
import { onClick, setValue } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.27/element.min.js";

// Satu area contoh di sekitar Gedung Sate, supaya alat Ubah dan Hapus langsung bisa dicoba.
const SAMPLE = {
    type: "Feature",
    properties: { nama: "Area contoh" },
    geometry: { type: "Polygon", coordinates: [[[107.6175, -6.9015], [107.6205, -6.9015], [107.6205, -6.8995], [107.6175, -6.8995], [107.6175, -6.9015]]] },
};
const NAMES = { Point: "Titik", LineString: "Garis", Polygon: "Area" };     // menurut tipe geometri
const TOOL_NAMES = { point: "Titik", line: "Garis", polygon: "Area" };      // menurut alat gambar

createMap("map", { center: [107.619, -6.9005], zoom: 17, maxZoom: 19 });
addScaleBar("map");
const drawing = addDrawControl("map", {
    data: SAMPLE,
    properties: (type) => ({ nama: `${TOOL_NAMES[type]} baru` }),
    onChange: show,
});
show(drawing.getData());

function measureOf(feature) {
    const type = feature.geometry.type;
    if (type === "LineString") return formatLength(getLength(feature));
    if (type === "Polygon") return `${formatArea(getArea(feature))}, keliling ${formatLength(getLength(feature))}`;
    return feature.geometry.coordinates.map((value) => value.toFixed(6)).reverse().join(", ");
}

function show(collection) {
    const list = document.getElementById("features");
    list.textContent = "";
    collection.features.forEach((feature) => {
        const item = document.createElement("li");
        item.textContent = `${feature.properties.nama || NAMES[feature.geometry.type]} — ${measureOf(feature)}`;
        list.appendChild(item);
    });
    document.getElementById("empty").hidden = collection.features.length > 0;
    setValue("geojson", JSON.stringify(collection, null, 2));
}

onClick("download", () => {
    const blob = new Blob([JSON.stringify(drawing.getData(), null, 2)], { type: "application/geo+json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "gambar.geojson";
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
});

onClick("clear", () => drawing.clear());
