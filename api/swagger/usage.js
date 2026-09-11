// How to call the API documented in openapi.yaml from a CrootJS frontend.
// Each function here corresponds 1:1 to an operationId in openapi.yaml.
import { getJSON, postJSON, putJSON, deleteJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.11/api.min.js";

const API_URL = "https://api.example.com";

// GET /notes — listNotes
export function listNotes(onResult) {
    getJSON(`${API_URL}/notes`, onResult);
}

// POST /notes — createNote
export function createNote(note, onResult) {
    postJSON(`${API_URL}/notes`, note, onResult);
}

// PUT /notes/{id} — updateNote
export function updateNote(id, note, onResult) {
    putJSON(`${API_URL}/notes/${id}`, note, onResult);
}

// DELETE /notes/{id} — deleteNote
export function removeNote(id, onResult) {
    deleteJSON(`${API_URL}/notes/${id}`, {}, onResult);
}

// Example call — every api.js response callback receives { status, data }
listNotes(({ status, data }) => {
    if (status === 200) {
        console.log("Notes:", data);
    }
});
