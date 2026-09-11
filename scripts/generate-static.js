const ejs = require("ejs");
const fs = require("fs").promises;
const path = require("path");
const config = require("../src/config");
const { getDisplayUser } = require("../src/lib/user");

async function generateStaticFiles() {
  if (!config.staticDir) {
    throw new Error(
      `generate-static has nothing to build in mode "${config.mode}" — ` +
        `production renders live and has no static output directory.`
    );
  }

  const outputDir = config.staticDir; // ./dist (development) or ./stage (staging)
  await fs.mkdir(outputDir, { recursive: true });

  // config.site.basePath ("/node.it") is the GitHub Pages project-site
  // prefix — only correct when the build is actually published there.
  // Local dev/staging previews are served from their own root, so they
  // need an empty basePath instead.
  const basePath = process.env.GH_PAGES ? config.site.basePath : "";

  // Pages sourced from data/config.json, plus the computed profile page
  const pages = config.pages.map(({ route, file, title }) => ({
    folder: route,
    file,
    data: { title, basePath },
  }));

  const user = getDisplayUser(config);
  pages.push({
    folder: "profile",
    file: "profile.ejs",
    data: {
      title: `${user.name}'s Profile`,
      basePath,
      user,
    },
  });

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

  // Copy root public/ into the output directory's public/
  const publicDir = path.join(__dirname, "..", "public");
  await copyDir(publicDir, path.join(outputDir, "public"));

  console.log(`Static build for mode "${config.mode}" written to ${outputDir}`);
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

generateStaticFiles().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
