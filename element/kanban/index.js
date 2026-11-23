import { onClick, setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.32/element.min.js";
import { getLocal, setLocal } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.32/storage.min.js";
import { handleForm } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.32/form.min.js";

const COLUMNS = [
    { id: "todo", name: "Tugas" },
    { id: "doing", name: "Dikerjakan" },
    { id: "done", name: "Selesai" },
];
const KEY = "contoh-kanban";

// Kartu: { id, text, column }. Data lama yang rusak atau kosong diganti contoh awal.
let cards = Array.isArray(getLocal(KEY)) ? getLocal(KEY) : [
    { id: 1, text: "Baca dokumentasi croot.css", column: "done" },
    { id: 2, text: "Pindahkan kartu ini ke kolom Selesai", column: "doing" },
    { id: 3, text: "Tambah kartu sendiri", column: "todo" },
];
let addingTo = "todo";

const save = () => setLocal(KEY, cards);
const columnName = id => COLUMNS.find(column => column.id === id).name;
const announce = text => setInnerText("status", text);

function button(label, text, run, className) {
    const element = document.createElement("button");
    element.type = "button";
    element.className = "secondary" + (className ? " " + className : "");
    element.textContent = text;
    element.setAttribute("aria-label", label);
    element.addEventListener("click", run);
    return element;
}

function move(card, column) {
    card.column = column;
    save();
    render();
    // Papan digambar ulang; fokus dikembalikan ke kartu yang dipindah supaya pengguna keyboard
    // bisa langsung memindahkannya lagi.
    const moved = document.querySelector(`.card-item[data-id="${card.id}"] button`);
    if (moved) moved.focus();
    announce(`"${card.text}" dipindah ke ${columnName(column)}.`);
}

function cardElement(card) {
    const item = document.createElement("li");
    item.className = "card-item";
    item.draggable = true;
    item.dataset.id = card.id;
    const text = document.createElement("p");
    text.textContent = card.text;
    const actions = document.createElement("div");
    actions.className = "card-actions";
    const index = COLUMNS.findIndex(column => column.id === card.column);
    if (index > 0) {
        const target = COLUMNS[index - 1];
        actions.append(button(`Pindah "${card.text}" ke ${target.name}`, "←", () => move(card, target.id)));
    }
    if (index < COLUMNS.length - 1) {
        const target = COLUMNS[index + 1];
        actions.append(button(`Pindah "${card.text}" ke ${target.name}`, "→", () => move(card, target.id)));
    }
    actions.append(button(`Hapus "${card.text}"`, "Hapus", () => {
        cards = cards.filter(other => other !== card);
        save();
        render();
        announce(`"${card.text}" dihapus.`);
    }, "remove ghost"));
    item.addEventListener("dragstart", event => {
        event.dataTransfer.setData("text/plain", String(card.id));
        item.classList.add("dragging");
    });
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
    item.append(text, actions);
    return item;
}

function columnElement(column) {
    const section = document.createElement("section");
    section.className = "column";
    section.setAttribute("aria-labelledby", `title-${column.id}`);
    const own = cards.filter(card => card.column === column.id);
    const heading = document.createElement("h2");
    heading.id = `title-${column.id}`;
    heading.textContent = column.name;
    const count = document.createElement("span");
    count.className = "badge";
    count.textContent = own.length;
    heading.append(count);
    const list = document.createElement("ul");
    list.className = "cards";
    list.append(...own.map(cardElement));
    const add = button(`Tambah kartu ke ${column.name}`, "+ Tambah", () => {
        addingTo = column.id;
        document.getElementById("dialog").showModal();
    }, "ghost");
    section.addEventListener("dragover", event => {
        event.preventDefault();
        section.classList.add("over");
    });
    section.addEventListener("dragleave", event => {
        if (!section.contains(event.relatedTarget)) section.classList.remove("over");
    });
    section.addEventListener("drop", event => {
        event.preventDefault();
        section.classList.remove("over");
        const card = cards.find(other => String(other.id) === event.dataTransfer.getData("text/plain"));
        if (card && card.column !== column.id) move(card, column.id);
    });
    section.append(heading, list, add);
    return section;
}

function render() {
    document.getElementById("board").replaceChildren(...COLUMNS.map(columnElement));
}

const dialog = document.getElementById("dialog");
const form = handleForm("new-card", data => {
    const card = { id: Date.now(), text: data.text.trim(), column: addingTo };
    cards.push(card);
    save();
    render();
    document.getElementById("new-card").reset();
    dialog.close();
    announce(`"${card.text}" ditambahkan ke ${columnName(addingTo)}.`);
}, {
    rules: { text: value => (value.trim() ? null : "Tulis tugasnya dulu.") },
});
onClick("cancel", () => dialog.close());
dialog.addEventListener("close", () => {
    document.getElementById("new-card").reset();
    form.clear();
});
onClick("reset", () => {
    cards = [];
    save();
    render();
    announce("Papan dikosongkan.");
});

render();
