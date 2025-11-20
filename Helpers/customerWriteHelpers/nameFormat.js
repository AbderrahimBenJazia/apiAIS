"use strict";

const nameFormat = (name, keepAccent = false, keepNumber = false) => {
  if (typeof name !== "string") return "";

  let processed = name;

  // Remove accents if requested (François → Francois)
  if (!keepAccent) {
    processed = processed.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  }


  if (!keepNumber) {
    // Remove numbers and special characters, but keep letters, spaces, apostrophes, hyphens
    if (keepAccent) {
      // Keep all unicode letters (including accented ones)
      processed = processed.replace(/[^\p{L} '\-]/gu, "");
    } else {
      // Only keep basic ASCII letters (accents already removed)
      processed = processed.replace(/[^a-zA-Z '\-]/g, "");
    }
  } else {
    // Keep numbers but remove other special characters
    if (keepAccent) {
      // Keep unicode letters, numbers, spaces, apostrophes, hyphens
      processed = processed.replace(/[^\p{L}0-9 '\-]/gu, "");
    } else {
      // Keep ASCII letters, numbers, spaces, apostrophes, hyphens
      processed = processed.replace(/[^a-zA-Z0-9 '\-]/g, "");
    }
  }

  // Final cleanup and formatting
  return processed
    .replace(/\s{2,}/g, " ")  // Replace multiple spaces with single space
    .replace(/^[\s\-']+|[\s\-']+$/g, "")  // Remove unwanted characters from start/end
    .split(" ")  // Split into words
    .filter((word) => word.length > 0)  // Remove empty words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())  // Title Case each word
    .join(" ");  // Join back together
};

module.exports = { nameFormat };


