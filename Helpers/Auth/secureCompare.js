"use strict";

const crypto = require('crypto');

/**
 * Securely compare two strings in constant time to prevent timing attacks
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} - True if strings are equal
 */
function secureCompare(a, b) {
  if (!a || !b || typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  
  // crypto.timingSafeEqual requires Buffers and they must be the same length
  const bufferA = Buffer.from(a, 'utf8');
  const bufferB = Buffer.from(b, 'utf8');
  
  // If different lengths, return false (no timing attack possible on length check)
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  
  // crypto.timingSafeEqual handles the constant-time comparison internally
  return crypto.timingSafeEqual(bufferA, bufferB);
}

module.exports = secureCompare;