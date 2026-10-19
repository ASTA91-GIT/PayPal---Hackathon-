const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browserBin = fs.existsSync(chromePath) ? chromePath : edgePath;

const outDir = path.resolve(__dirname, "../public/readme");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const targets = [
  { name: "landing-page.png", url: "http://localhost:3000/" },
  { name: "ai-assistant.png", url: "http://localhost:3000/agent" },
  { name: "product-discovery.png", url: "http://localhost:3000/discover" },
  { name: "product-comparison.png", url: "http://localhost:3000/compare" },
  { name: "risk-investigation.png", url: "http://localhost:3000/investigate/prod-gpu-fake-010" },
  { name: "checkout.png", url: "http://localhost:3000/checkout" },
  { name: "order-history.png", url: "http://localhost:3000/orders" },
  { name: "trust-dashboard.png", url: "http://localhost:3000/dashboard" },
];

console.log("Using browser:", browserBin);

for (const target of targets) {
  const outFile = path.join(outDir, target.name);
  console.log(`Capturing ${target.url} -> ${target.name}...`);
  try {
    const res = spawnSync(browserBin, [
      "--headless=new",
      "--hide-scrollbars",
      "--window-size=1280,800",
      "--disable-gpu",
      `--screenshot=${outFile}`,
      target.url,
    ], { timeout: 12000 });

    if (fs.existsSync(outFile)) {
      const stats = fs.statSync(outFile);
      console.log(`  ✓ Created ${target.name} (${Math.round(stats.size / 1024)} KB)`);
    } else {
      console.error(`  ✗ Failed ${target.name}:`, res.stderr?.toString());
    }
  } catch (err) {
    console.error(`  Error capturing ${target.name}:`, err.message);
  }
}
console.log("Finished capturing all screens.");
