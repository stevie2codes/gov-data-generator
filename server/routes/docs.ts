import { Router, Request, Response } from "express";
import { buildOpenApiSpec } from "../utils/openapi.js";

const router = Router();

// ─── GET /api/openapi.json — raw OpenAPI 3.0 spec ─────────────────────────────

router.get("/openapi.json", (_req: Request, res: Response) => {
  res.json(buildOpenApiSpec());
});

// ─── GET /api/docs — Swagger UI (loaded from CDN, zero dependencies) ──────────

router.get("/docs", (_req: Request, res: Response) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>MockMakeData API — Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body { margin: 0; background: #1a1a2e; }
    #swagger-ui .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: "/api/openapi.json",
      dom_id: "#swagger-ui",
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset,
      ],
      layout: "BaseLayout",
    });
  </script>
</body>
</html>`;

  res.type("html").send(html);
});

export default router;
