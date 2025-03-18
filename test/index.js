#!/usr/bin/env node
/* eslint-disable no-undef */
// index.mjs

import { config } from "dotenv";
import car from "./car.js";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { version } = require("../package.json");

console.log(`Node.js version: ${process.version}`);
console.log(`Project version: ${version}\n`);

config(); // Initialize dotenv

process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
const args = process.argv.slice(2);

function capitalize(s) {
  return s.toLowerCase().replace(/\b./g, (a) => a.toUpperCase());
}

let myName = args[0];

if (!myName) {
  myName = process.env.USER_NAME.split(" ")[0];
}

console.log("\nProcess started\n--------------------\n");

console.log(`Hello ${capitalize(myName)}, \n`);
console.log(`My car is a ${car.brand} ${car.model}`);
console.log(`My %s has %d wheels`, "car", car.wheels);
console.log(`what ID:@${process.env.USER_ID}`); // "239482"

console.log("\nProcess terminated");
process.exit(0);
