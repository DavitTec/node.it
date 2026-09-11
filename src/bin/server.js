#!/usr/bin/env node

/**
 * Module dependencies.
 */

const config = require("../config");
const debug = require("debug")("src:server");
const http = require("http");
const fs = require("fs");
const express = require("express");

/**
 * Build the app for the current mode: production renders live via the
 * dynamic Express app; development/staging serve a pre-built static export.
 */

function buildApp() {
  if (config.mode === "production") {
    return require("../app.js");
  }

  if (!fs.existsSync(config.staticDir)) {
    console.error(
      `No static build found at ${config.staticDir} for mode "${config.mode}".\n` +
        `Run 'pnpm build' first.`
    );
    process.exit(1);
  }

  const staticApp = express();
  staticApp.use(express.static(config.staticDir));
  return staticApp;
}

const app = buildApp();

/**
 * Get hostname/port from app config and store in Express.
 */

const hostname = config.server.hostname;
app.set("hostname", hostname);

const port = normalizePort(config.server.port);
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);

console.log(`Express server (${config.mode}) on http://${hostname}:${port}/;
  to Close crtl C or close terminal\n-----------------------------`);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
