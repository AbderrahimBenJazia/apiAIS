"use strict";

const dateFormatMongo = (date) => {
  try {
    let processed;
    
    // Step 1: Convert to string representation
    if (date instanceof Date) {
      // Handle Date objects - convert to ISO string
      processed = date.toISOString();
    } else {
      // Handle string inputs
      processed = date.toString();
    }
    
    // Step 2: Extract date portion and clean up
    // For ISO strings: "2023-01-15T10:30:00.000Z" → "2023-01-15"
    // For other strings: keep as is but ensure we have enough characters
    if (processed.includes('T')) {
      // ISO format - extract date part
      processed = processed.split('T')[0];
    } else {
      // Non-ISO format - clean and normalize
      processed = processed.trim();
    }
    
    // Step 3: Normalize separators to hyphens
    // "2023/01/15" → "2023-01-15", "2023.01.15" → "2023-01-15"
    processed = processed.replace(/[/.]/g, '-');
    
    // Step 4: Detect format and convert to DD-MM-YYYY
    const isoFormatRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/; // YYYY-MM-DD
    const europeanFormatRegex = /^[0-9]{2}-[0-9]{2}-[0-9]{4}$/; // DD-MM-YYYY
    
    if (isoFormatRegex.test(processed)) {
      // Convert YYYY-MM-DD → DD-MM-YYYY
      const year = processed.slice(0, 4);   
      const month = processed.slice(5, 7);   
      const day = processed.slice(8, 10);
      processed = `${day}-${month}-${year}`;
    } else if (europeanFormatRegex.test(processed)) {
      // Already in DD-MM-YYYY format, keep as is
      // No need to reassign, just continue to validation
    } else {
      // Invalid format
      return null;
    }
    
    // Step 5: Validate actual date using JavaScript Date (like dateFormatUrssaf)
    const parts = processed.split('-');
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]); 
    const year = parseInt(parts[2]);
    
    // Validate actual date values
    const testDate = new Date(year, month - 1, day); // month is 0-indexed in Date
    if (testDate.getFullYear() !== year || 
        testDate.getMonth() !== month - 1 || 
        testDate.getDate() !== day) {
      return null; 
    }

    return processed;
    
  } catch (error) {
    // Return null for any parsing errors
    return null;
  }
};

module.exports = { dateFormatMongo };


