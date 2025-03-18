#!/usr/bin/env node
// index.js
require("dotenv").config();
const car = require("./car");

process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
const args = process.argv.slice(2);

function capitalize(s) {
  return s.toLowerCase().replace(/\b./g, function (a) {
    return a.toUpperCase();
  });
}

var myName = args[0];

if (!!myName) {
  myName;
} else {
  myName = process.env.USER_NAME.split(" ")[0];
}

console.log("\nProcess started\n--------------------\n");

console.log("Hello " + capitalize(myName) + ", \n");
console.log("My car is a " + car.brand + " " + car.model + "");
console.log("My %s has %d wheels", "car", car.wheels);
console.log("what ID:@" + process.env.USER_ID); // "239482"

console.log("\nProcess terminated");
process.exit(0);

//References
//split(" ") will convert your string into an array of words (substrings resulted from the division of the string using space as divider) and then you can get the first word accessing the first array element with [0]. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
// -----
// if (!!str) {
//    // Some code here
// } // It returns false for null, undefined, 0, 000, "", false.
// https://brianflove.com/2014-09-02/whats-the-double-exclamation-mark-for-in-javascript/
