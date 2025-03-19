const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

async function generateFavicons() {
  // Define paths
  const scriptDir = __dirname; // scripts/
  const projectRoot = path.resolve(scriptDir, ".."); // Root of project
  const svgPath = path.join(
    projectRoot,
    "src",
    "public",
    "icons",
    "favicon.svg"
  );
  const outputDir = path.join(projectRoot, "src", "public", "icons");

  console.log("SVG Path:", svgPath);
  console.log("Output Dir:", outputDir);

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });
  console.log("Output directory created or already exists");

  // Sizes for each favicon type (all PNG)
  const sizes = [
    { size: 32, output: "favicon-32.png" }, // PNG for standard browsers
    { size: 180, output: "apple-touch-icon.png" },
    { size: 192, output: "icon-192.png" },
  ];

  for (const { size, output } of sizes) {
    const outputPath = path.join(outputDir, output);
    console.log(`Processing ${output} (${size}x${size})`);

    await sharp(svgPath).resize(size, size).png().toFile(outputPath);
    console.log(`Generated ${output}`);
  }
}

generateFavicons().catch((err) => console.error("Error:", err));
