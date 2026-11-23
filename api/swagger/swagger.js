// swagger-ui-dist tidak punya build ES module; SwaggerUIBundle dipasang di window oleh tag
// <script> CDN-nya di index.html, yang dijalankan sebelum modul ini.
window.SwaggerUIBundle({
    url: "./openapi.yaml",
    dom_id: "#swagger-ui",
    deepLinking: true,
});
