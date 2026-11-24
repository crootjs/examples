import { registerServiceWorker, onNetworkChange, isStandalone, installButton } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.41/pwa.min.js";
import { getLocal, setLocal } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.41/storage.min.js";

const KEY = "contoh-pwa-catatan";
let notes = getLocal(KEY) || [];

const list = document.getElementById("daftar");
const empty = document.getElementById("kosong");
const dateFormat = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" });

function render() {
    list.replaceChildren(...notes.map(note => {
        const item = document.createElement("li");
        const text = document.createElement("p");
        text.textContent = note.text;
        const time = document.createElement("time");
        time.dateTime = new Date(note.at).toISOString();
        time.textContent = dateFormat.format(note.at);
        text.appendChild(time);
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "secondary";
        remove.textContent = "Hapus";
        remove.setAttribute("aria-label", `Hapus catatan: ${note.text.slice(0, 40)}`);
        remove.addEventListener("click", () => {
            notes = notes.filter(other => other.at !== note.at);
            setLocal(KEY, notes);
            render();
        });
        item.append(text, remove);
        return item;
    }));
    empty.hidden = notes.length > 0;
}

document.getElementById("tambah").addEventListener("submit", event => {
    event.preventDefault();
    const field = event.target.elements.isi;
    const text = field.value.trim();
    if (!text) return;
    notes = [{ text, at: Date.now() }, ...notes];
    setLocal(KEY, notes);
    field.value = "";
    render();
});

const network = document.getElementById("jaringan");
onNetworkChange(online => {
    network.textContent = online ? "Online" : "Offline: memakai salinan tersimpan";
    network.classList.toggle("offline", !online);
});

if (isStandalone()) document.getElementById("mode").textContent = "Dibuka sebagai aplikasi";
installButton("pasang");
registerServiceWorker("sw.js");
render();
