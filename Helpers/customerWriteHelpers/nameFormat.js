"use strict";

const nameFormat = (name, keepAccent = false, keepNumber = false) => {
  if (typeof name !== "string") return "";

  let processed = name;

  if (!keepAccent) {
    processed = processed.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  }

  if (!keepNumber) {
    if (keepAccent) {
      processed = processed.replace(/[^\p{L} '\-]/gu, "");
    } else {
      processed = processed.replace(/[^a-zA-Z '\-]/g, "");
    }
  } else {
    if (keepAccent) {
      processed = processed.replace(/[^\p{L}0-9 '\-]/gu, "");
    } else {
      processed = processed.replace(/[^a-zA-Z0-9 '\-]/g, "");
    }
  }
  return processed
    .replace(/\s{2,}/g, " ") // Multiple spaces
    .replace(/^[\s\-']+|[\s\-']+$/g, "") // Trim edges
    .split(" ")
    .filter((word) => word.length > 0) // Remove empty words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

module.exports = { nameFormat };


