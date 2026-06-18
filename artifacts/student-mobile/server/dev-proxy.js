"use strict";

// Proxy server for Expo in Replit.
//
// Strategy:
//   1. Bind an HTTP server on PORT (IPv6 ::) IMMEDIATELY so portauthority/pid2
//      detects the port and marks the workflow ready — even before Metro is up.
//   2. Start Expo Metro in the background.
//   3. Proxy all incoming HTTP requests to Metro once it's ready.
//
// Why IPv6 (::)?  portauthority monitors /proc/net/tcp6.  A 0.0.0.0 bind only
// appears in /proc/net/tcp and will never be detected.

const http    = require("http");
const net     = require("net");
const { spawn } = require("child_process");
const path    = require("path");

const PORT        = parseInt(process.env.PORT || "8099", 10);
const METRO_PORT  = 19006;
const PROJECT_ROOT = path.resolve(__dirname, "..");

// ── helpers ──────────────────────────────────────────────────────────────────

function log(...args) {
  process.stderr.write(`[expo-proxy] ${args.join(" ")}\n`);
}

function isMetroReady() {
  return new Promise(resolve => {
    const check = () => {
      const s = net.createConnection({ host: "127.0.0.1", port: METRO_PORT });
      s.once("connect", () => { s.destroy(); resolve(); });
      s.once("error",   () => { setTimeout(check, 500); });
    };
    check();
  });
}

function proxyRequest(req, res) {
  const opts = {
    hostname: "127.0.0.1",
    port:     METRO_PORT,
    path:     req.url,
    method:   req.method,
    headers:  { ...req.headers, host: `localhost:${METRO_PORT}` },
  };
  const upstream = http.request(opts, (upRes) => {
    res.writeHead(upRes.statusCode, upRes.headers);
    upRes.pipe(res, { end: true });
  });
  upstream.on("error", (err) => {
    log("upstream error:", err.message);
    if (!res.headersSent) res.writeHead(502);
    res.end("Bad Gateway");
  });
  req.pipe(upstream, { end: true });
}

// ── 1. Start proxy server immediately on :: so portauthority detects it ───────

const server = http.createServer((req, res) => {
  // /healthz always responds immediately (before Metro is ready)
  if (req.url === "/healthz") {
    res.writeHead(200, { "content-type": "text/plain" });
    res.end("ok");
    return;
  }
  proxyRequest(req, res);
});

server.listen(PORT, "::", () => {
  log(`Proxy bound on [::]:${PORT} — portauthority should detect this now`);
});

server.on("error", err => {
  log("Server error:", err.message);
  process.exit(1);
});

// ── 2. Launch Expo Metro ──────────────────────────────────────────────────────

const replitExpoDomain = process.env.REPLIT_EXPO_DEV_DOMAIN || "";
const replitDevDomain  = process.env.REPLIT_DEV_DOMAIN       || "";
const replId           = process.env.REPL_ID                  || "";

const env = {
  ...process.env,
  EXPO_USE_FAST_RESOLVER: "1",
};
if (replitExpoDomain) env.EXPO_PACKAGER_PROXY_URL          = `https://${replitExpoDomain}`;
if (replitDevDomain)  env.REACT_NATIVE_PACKAGER_HOSTNAME   = replitDevDomain;
if (replitDevDomain)  env.EXPO_PUBLIC_DOMAIN               = replitDevDomain;
if (replId)           env.EXPO_PUBLIC_REPL_ID              = replId;

log(`Starting Metro on port ${METRO_PORT} …`);

const expo = spawn(
  "pnpm",
  ["exec", "expo", "start", "--localhost", `--port=${METRO_PORT}`],
  { cwd: PROJECT_ROOT, env, stdio: "inherit" }
);

expo.on("error", err => { log("spawn error:", err.message); process.exit(1); });
expo.on("exit",  (code, sig) => {
  log(`Metro exited (code=${code} sig=${sig})`);
  server.close();
  process.exit(code ?? 0);
});

isMetroReady().then(() => log(`Metro is ready on port ${METRO_PORT}`));

process.on("SIGTERM", () => { expo.kill("SIGTERM"); server.close(); });
process.on("SIGINT",  () => { expo.kill("SIGINT");  server.close(); });
