# crootjs/examples — Project Instructions

This repo holds working, live-deployed examples for [CrootJS](https://github.com/crootjs/lib), published at https://croot.js.org/examples/.

## Mandatory conventions

Every example must follow CrootJS's coding conventions: HTML, CSS, and JS in separate files; no inline `<style>`/`<script>` blocks; no `onclick`/`style=""` attributes; JS loaded as `<script type="module">`. Full rules: https://croot.js.org/docs/conventions

## When adding or editing an example

- Import CrootJS from a pinned CDN version tag, never `@latest`.
- Keep each example self-contained in its own folder (`index.html` + its own `.css`/`.js` files).
- These pages are live and linked from `crootjs.github.io`'s "See CrootJS in Action" section — if you rename or remove a folder, update that section too, or the link breaks.
