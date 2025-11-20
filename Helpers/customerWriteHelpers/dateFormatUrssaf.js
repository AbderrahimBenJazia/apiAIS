"use strict";

const dateFormatUrssaf = (date) => {
  try {
    // Convert to string and take first 10 characters, remove spaces
    // "2023-01-01T02:00:00Z" → "2023-01-01"
    // " 01/01/2023 " → "01/01/2023"
    let processed = date.toString().slice(0, 10).replace(/ /g, "");

    // Handle European date format (DD/MM/YYYY or DD.MM.YYYY or DD-MM-YYYY)
    // Convert to YYYY-MM-DD format
    const europeanDateRegex = /^[0-9]{2}[-/.][0-9]{2}[-/.][0-9]{4}$/;
    if (europeanDateRegex.test(processed)) {
      // Extract day, month, year and rearrange: DD/MM/YYYY → YYYY-MM-DD
      const day = processed.slice(0, 2);
      const month = processed.slice(3, 5);
      const year = processed.slice(6, 10);
      processed = `${year}-${month}-${day}`;
    }

    // Normalize separators and extract parts for validation
    const normalizedDate = processed.replace(/[/.]/g, "-");
    const parts = normalizedDate.split("-");

    // Validate we have exactly 3 parts and convert to numbers
    if (parts.length !== 3) return null;

    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);

    // Validate actual date using JavaScript Date (handles all edge cases)
    const testDate = new Date(year, month - 1, day); // month is 0-indexed in Date
    if (
      testDate.getFullYear() !== year ||
      testDate.getMonth() !== month - 1 ||
      testDate.getDate() !== day
    ) {
      return null; // Invalid date (e.g., Feb 30, April 31, month 15, etc.)
    }

    // Add URSSAF-required timestamp
    return normalizedDate + "T02:00:00Z";
  } catch (error) {
    // Return null for any parsing errors instead of throwing
    return null;
  }
};

module.exports = { dateFormatUrssaf };

