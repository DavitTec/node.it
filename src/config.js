// App/package configuration.
//
// Two sources, kept deliberately separate:
//  - ./data/config.json: app data (server defaults, site copy, user, pages).
//  - .env (DAVIT infra tooling): only PROJECT_STATUS is read from it, as the
//    explicit MODE switch, plus HOST/PORT/DEBUG overrides for staging and
//    production. Development always ignores .env and runs on the plain
//    data/config.json values. No other app data is ever sourced from .env.
const path = require("path");
const dotenv = require("dotenv");
const config = require("../data/config.json");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const MODE_ALIASES = {
  dev: "development",
  development: "development",
  stage: "staging",
  staging: "staging",
  prod: "production",
  production: "production",
};
const mode =
  MODE_ALIASES[(process.env.PROJECT_STATUS || "").toLowerCase()] ||
  "development";

// dev/staging serve a pre-built static export instead of rendering live.
const STATIC_DIR_BY_MODE = {
  development: path.resolve(__dirname, "..", "dist"),
  staging: path.resolve(__dirname, "..", "stage"),
};

// Development ignores .env entirely; staging and production take
// HOST/PORT/DEBUG overrides from it, falling back to config.json per field.
const allowEnvOverride = mode !== "development";

const server = {
  ...config.server,
  hostname: allowEnvOverride
    ? process.env.HOST || config.server.hostname
    : config.server.hostname,
  port: allowEnvOverride
    ? process.env.PORT
      ? Number(process.env.PORT)
      : config.server.port
    : config.server.port,
  debug: allowEnvOverride
    ? process.env.DEBUG !== undefined
      ? process.env.DEBUG === "true"
      : config.server.debug
    : config.server.debug,
};

module.exports = {
  ...config,
  server,
  mode,
  // null in production: it renders live, there is no static build to serve.
  staticDir: STATIC_DIR_BY_MODE[mode] || null,
};
