// Tiga menara BTS 3D di peta. Klik menara untuk memilihnya; slider memutar azimuth-nya.
import { createMap } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.27/map.min.js";
// highlightPart diimpor dari mapmodel.js (yang mengekspor ulang model3d.js), supaya penampil
// model di peta dan fungsinya berasal dari salinan modul yang sama.
import { addModel, highlightPart } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.27/mapmodel.min.js";
import { onInput, getValue, setValue, setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.27/element.min.js";

const SITES = [
    { name: "BTS Dago", position: [107.6135, -6.8875], heading: 30 },
    { name: "BTS Cikapayang", position: [107.6158, -6.8902], heading: 150 },
    { name: "BTS Taman Sari", position: [107.6101, -6.8912], heading: 260 },
];

createMap("map", { center: [107.6131, -6.8896], zoom: 17, maxZoom: 19 });

let selected = null;
SITES.forEach((site) => {
    site.model = addModel("map", site.position, "../../3d/models/bts.glb", {
        heading: site.heading,
        scale: 3,
        minZoom: 15,
        onClick: (hit) => select(site, hit),
    });
});

function select(site, hit) {
    if (selected) highlightPart(selected.model.viewerId, null);
    selected = site;
    highlightPart(site.model.viewerId, hit.part);
    const slider = document.getElementById("heading");
    slider.disabled = false;
    setValue("heading", site.heading);
    setInnerText("heading-text", site.heading + "°");
    setInnerText("status", `${site.name}: ${hit.path.join(" › ")}`);
}

onInput("heading", () => {
    if (!selected) return;
    selected.heading = Number(getValue("heading"));
    selected.model.setHeading(selected.heading);
    setInnerText("heading-text", selected.heading + "°");
});
