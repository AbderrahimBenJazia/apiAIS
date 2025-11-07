"use strict";

const sanitize = (obj) => {
  // Handle null and undefined
  if (obj === null || obj === undefined) return obj;
  
  // Handle primitive values (strings, numbers, booleans)
  if (typeof obj !== "object") {
    if (typeof obj === "string") {
      return sanitizeString(obj);
    }
    // For numbers, booleans, etc., return as-is
    return obj;
  }
  
  // Handle Date objects - preserve as ISO string or keep as Date
  if (obj instanceof Date) {
    return obj; // Keep as Date object, or use obj.toISOString() for string
  }
  
  // Handle arrays - preserve array structure
  if (Array.isArray(obj)) {
    return obj.map(item => sanitize(item));
  }
  
  // Handle regular objects
  const sanitized = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      let value = obj[key];
      
      // Skip functions for security
      if (typeof value === "function") {
        continue; // Exclude functions completely
      }
      
      if (typeof value === "string") {
        value = sanitizeString(value);
      } else if (typeof value === "object" && value !== null) {
        value = sanitize(value); // Recursively sanitize nested objects/arrays
      }
      
      sanitized[key] = value;
    }
  }
  return sanitized;
};

// Helper function for consistent string sanitization
const sanitizeString = (str) => {
  if (typeof str !== "string") return str;
  
  return str
    .replace(/<script.*?>.*?<\/script>/gi, "") // Remove script tags
    .replace(/[<>]/g, "") // Remove < and > characters
    .trim(); // Remove leading/trailing whitespace
};

module.exports = sanitize;
