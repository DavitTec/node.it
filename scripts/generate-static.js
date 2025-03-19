const ejs = require("ejs");
const fs = require("fs").promises;
const path = require("path");

async function generateStaticFiles() {
  const outputDir = path.join(__dirname, "..", "dist"); // Output directory for static files
  await fs.mkdir(outputDir, { recursive: true });

  // Define pages with folder names and data
  const pages = [
    { folder: "", file: "index.ejs", data: { title: "Home" } }, // Root index
    { folder: "about", file: "about.ejs", data: { title: "About" } },
    { folder: "contact", file: "contact.ejs", data: { title: "Contact" } },
    {
      folder: "profile",
      file: "profile.ejs",
      data: {
        title: "Joe Bloggs's Profile",
        user: {
          name: "Joe Bloggs",
          firstname: "Joe",
          id: "239482",
          key: ["reading", "gaming", "hiking"],
        },
      },
    },
  ];

  for (const page of pages) {
    const templatePath = path.join(__dirname, "..", "src", "views", page.file);
    const templateStr = await fs.readFile(templatePath, "utf8");

    // Render EJS with data
    const html = ejs.render(templateStr, {
      ...page.data,
      filename: templatePath, // For partials to work
    });

    // Create folder and write index.html
    const pageDir = path.join(outputDir, page.folder);
    await fs.mkdir(pageDir, { recursive: true });
    const outputPath = path.join(pageDir, "index.html");
    await fs.writeFile(outputPath, html);
    console.log(`Generated ${page.folder || "root"}/index.html`);
  }

  // Copy static assets (public folder)
  const publicDir = path.join(__dirname, "..", "src", "public");
  await copyDir(publicDir, path.join(outputDir, "public"));
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

generateStaticFiles().catch((err) => console.error("Error:", err));
