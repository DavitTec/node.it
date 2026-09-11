// Force-removes build artifacts so the next generate-static run starts from
// a clean ./dist instead of updating/overwriting stale files in place.
const fs = require("fs").promises;
const path = require("path");

const targets = [
  path.join(__dirname, "..", "dist"),
  path.join(__dirname, "..", "stage"),
];

async function clean() {
  for (const target of targets) {
    await fs.rm(target, { recursive: true, force: true });
    console.log(`Removed ${path.relative(process.cwd(), target)}`);
  }
}

clean().catch((err) => {
  console.error("Error cleaning build artifacts:", err);
  process.exit(1);
});
