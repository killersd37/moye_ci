import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";
import https from "https";
import selfsigned from "selfsigned";

// 100 % local — no external API required

// Plain-JS module (avoids jimp v1 TypeScript generics issues)
const { loadReferenceImages, identifyImage } = await import("./imagematcher.mjs") as {
  loadReferenceImages: (dir: string) => Promise<void>;
  identifyImage: (base64: string) => Promise<{ slug: string; label: string; url: string } | null>;
};




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VIRTUAL_ADAPTER_KEYWORDS = ["vmware", "vmnet", "virtualbox", "vethernet", "wsl", "hyper-v", "loopback"];

function getNetworkIPs(): string[] {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];
  for (const [name, addrs] of Object.entries(interfaces)) {
    const nameLower = name.toLowerCase();
    if (VIRTUAL_ADAPTER_KEYWORDS.some(kw => nameLower.includes(kw))) continue;
    for (const iface of addrs ?? []) {
      if (iface.family === "IPv4" && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing (needed for /api/identify)
  app.use(express.json({ limit: "10mb" }));

  // Generate self-signed certificate for HTTPS
  const attrs = [{ name: "commonName", value: "moyé-dev-server" }];
  // @ts-ignore
  const pems = await selfsigned.generate(attrs, { days: 365 });
  const credentials = { key: pems.private, cert: pems.cert };

  // ── "L'Œil de Moyé" — Cultural sites (served as static HTML) ──
  const oeilDir = path.join(__dirname, "oeil moye");
  const moyeSites: Record<string, string> = {
    "bete": "1 er Masque Bété Gla",
    "baoule": "2 e Masque Baoulé",
    "dan-kagle": "3 ème Masque Dan Kagle",
    "dida": "Pagne Dida",
    "pont-liane": "Pont de liane",
  };

  for (const [slug, folder] of Object.entries(moyeSites)) {
    const siteDir = path.join(oeilDir, folder);
    app.use(`/moye/${slug}`, express.static(siteDir, { index: "index.html" }));
    app.get(`/moye/${slug}/*`, (_req, res) => {
      res.sendFile(path.join(siteDir, "index.html"));
    });
    
    const encodedFolder = encodeURIComponent(folder);
    app.use(`/oeil%20moye/${encodedFolder}`, express.static(siteDir, { index: "index.html" }));
    app.get(`/oeil%20moye/${encodedFolder}/*`, (_req, res) => {
      res.sendFile(path.join(siteDir, "index.html"));
    });
  }

  // Pre-load reference images into memory
  await loadReferenceImages(oeilDir);

  // ── /api/identify — Image fingerprint matching ─────────────────
  app.post("/api/identify", async (req, res) => {
    try {
      const { image } = req.body as { image?: string };
      if (!image) {
        res.status(400).json({ error: "Missing 'image' field (base64 string)" });
        return;
      }

      const match = await identifyImage(image);

      if (match) {
        res.json({ found: true, slug: match.slug, label: match.label, url: match.url });
      } else {
        res.json({ found: false });
      }
    } catch (err) {
      console.error("[/api/identify] Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ── Health check ───────────────────────────────────────────────
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "MOYÉ" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { protocol: "wss" },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(PORT, "0.0.0.0", () => {
    const networkIPs = getNetworkIPs();
    console.log("\n  MOYÉ Dev Server (HTTPS Mode)\n");
    console.log(`  ➜  Local:   https://localhost:${PORT}`);
    networkIPs.forEach(ip => console.log(`  ➜  Network: https://${ip}:${PORT}`));
    if (!networkIPs.length) console.log("  ➜  Network: (aucune interface réseau détectée)");
    console.log("\n  ℹ  Note: Since this is a self-signed certificate, your browser will show a warning.");
    console.log("  ℹ  Click 'Advanced' -> 'Proceed' on your phone to access the app.\n");
  });
}

startServer();
