const sharp = require("sharp");
const { encode } = require("ico-endec");
const fs = require("fs").promises;
const path = require("path");

async function generateFavicons() {
  // Define paths relative to the script's location
  const scriptDir = __dirname; // scripts/
  const projectRoot = path.resolve(scriptDir, ".."); // Root of project
  const svgPath = path.join(
    projectRoot,
    "src",
    "public",
    "icons",
    "favicon.svg"
  );
  const outputDir = path.join(projectRoot, "src", "public", "icons", "temp");

  console.log("SVG Path:", svgPath);
  console.log("Output Dir:", outputDir);

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });
  console.log("Output directory created or already exists");

  // Sizes for each favicon type
  // ICO can contain multiple sizes, but we'll use 32x32
  const sizes = [
    { size: 32, output: "favicon.ico" },
    { size: 180, output: "apple-touch-icon.png" },
    { size: 192, output: "icon-192.png" },
  ];

  for (const { size, output } of sizes) {
    const outputPath = path.join(outputDir, output);
    console.log(`Processing ${output} (${size}x${size})`);

    if (output.endsWith(".ico")) {
      // Generate PNG first, then convert to ICO
      const pngBuffer = await sharp(svgPath)
        .resize(size, size)
        .png()
        .toBuffer();
      console.log(
        "PNG Buffer for ICO:",
        pngBuffer instanceof Buffer,
        pngBuffer.length
      );

      // Convert PNG buffer to ICO format
      const icoBuffer = encode([
        {
          width: size,
          height: size,
          buffer: pngBuffer,
        },
      ]);
      console.log("ICO Buffer:", icoBuffer instanceof Buffer, icoBuffer.length);
      // Fixed: use icoBuffer
      await fs.writeFile(outputPath, icoBuffer);
      console.log(`Generated ${output}`);
    } else {
      // Generate PNG directly
      await sharp(svgPath).resize(size, size).png().toFile(outputPath);
      console.log(`Generated ${output}`);
    }
  }
}

generateFavicons().catch((err) => console.error("Error:", err));
