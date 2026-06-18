#!/usr/bin/env node
/**
 * Stub build for production deployment.
 *
 * The full Metro-based bundle build is temporarily disabled while we
 * stabilize the Expo build pipeline. This stub creates the minimum file
 * structure that server/serve.js expects so the artifact can deploy and
 * serve its landing page. Mobile clients (Expo Go) will see an empty
 * manifest until the real build is restored.
 */

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const staticBuild = path.join(projectRoot, "static-build");

function writeStubManifest(platform) {
  const dir = path.join(staticBuild, platform);
  fs.mkdirSync(dir, { recursive: true });
  const manifest = {
    id: `stub-${platform}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    runtimeVersion: "1.0.0",
    launchAsset: null,
    assets: [],
    metadata: {},
    extra: {
      note: "Mobile build temporarily unavailable. Web app is live.",
    },
  };
  fs.writeFileSync(
    path.join(dir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  console.log(`Wrote stub manifest for ${platform}`);
}

fs.mkdirSync(staticBuild, { recursive: true });
writeStubManifest("ios");
writeStubManifest("android");
console.log("Stub build complete. Landing page will be served.");
