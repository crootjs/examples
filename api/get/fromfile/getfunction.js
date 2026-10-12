import { addChild } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.13/element.min.js";

export let URLGeoJson = "./data.json";
export let tableTag="tr";
export let tableRowClass="content is-small";
export let tableTemplate=`
<td>#TYPE#</td>
<td>#NAME#</td>
<td>#KORDINAT#</td>
`

// getJSON memanggil callback dengan { status, data } — bukan body respons
// langsung — dan status 0 berarti request gagal total (offline/timeout).
export function responseData(response){
    if (response.status !== 200) {
        console.log("gagal mengambil data, status:", response.status);
        return;
    }
    console.log(response.data.features);
    response.data.features.forEach(isiRow);
}

export function isiRow(value){
    let content=tableTemplate.replace("#TYPE#",value.geometry.type).replace("#NAME#",value.properties.name).replace("#KORDINAT#",value.geometry.coordinates);
    console.log(content);
    addChild("lokasi",tableTag,tableRowClass,content);
}
