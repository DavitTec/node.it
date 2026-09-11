// Generates public/icons/* from the original artwork kept in src/assets/icons.
// Originals live under src/ at full quality and are never written to directly —
// this script is the only thing that produces the public/icons build output.
const sharp = require("sharp");
const { encode } = require("ico-endec");
const fs = require("fs").promises;
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const sourceDir = path.join(projectRoot, "src", "assets", "icons");
const outputDir = path.join(projectRoot, "public", "icons");

// DAVIT-ICON mark: primitive vector original, scales cleanly to any size.
const iconSource = path.join(sourceDir, "davit-icon.svg");
// DAVIT-ICON + "D" composite: pre-rendered original covering the 16-48px range.
const compositeSource = path.join(sourceDir, "davit-icon-d.ico");

const ICO_SIZES = [16, 32, 48];
const PNG_TARGETS = [
  { size: 32, output: "favicon-32.png" },
  { size: 180, output: "apple-touch-icon.png" },
  { size: 192, output: "icon-192.png" },
];

async function buildFaviconIco() {
  const outputPath = path.join(outputDir, "favicon.ico");

  if (path.extname(compositeSource).toLowerCase() === ".ico") {
    // Already a multi-size composite at the right resolutions — use as-is.
    await fs.copyFile(compositeSource, outputPath);
    console.log("Copied favicon.ico from composite original (davit-icon-d.ico)");
    return;
  }

  // A higher-resolution composite original (svg/png): rasterize each size and encode.
  const frames = [];
  for (const size of ICO_SIZES) {
    const buffer = await sharp(compositeSource).resize(size, size).png().toBuffer();
    frames.push({ width: size, height: size, buffer });
  }
  await fs.writeFile(outputPath, encode(frames));
  console.log(`Generated favicon.ico (${ICO_SIZES.join(", ")}) from composite original`);
}

async function buildFaviconSvg() {
  // The primitive favicon.svg output IS the icon-only vector original, verbatim.
  await fs.copyFile(iconSource, path.join(outputDir, "favicon.svg"));
  console.log("Copied favicon.svg from icon original (davit-icon.svg)");
}

async function buildPngIcons() {
  for (const { size, output } of PNG_TARGETS) {
    const outputPath = path.join(outputDir, output);
    await sharp(iconSource).resize(size, size).png().toFile(outputPath);
    console.log(`Generated ${output} (${size}x${size})`);
  }
}

async function generateFavicons() {
  await fs.mkdir(outputDir, { recursive: true });
  await buildFaviconIco();
  await buildFaviconSvg();
  await buildPngIcons();
}

generateFavicons().catch((err) => {
  console.error("Error generating favicons:", err);
  process.exit(1);
});
