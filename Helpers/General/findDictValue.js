"use strict";

const findDictValue = (keyList, dict) => {
  // Input validation
  if (!Array.isArray(keyList) || keyList.length === 0) {
    return null;
  }

  if (!dict || typeof dict !== "object" || Array.isArray(dict)) {
    return null;
  }

  // Search for first matching key
  for (const key of keyList) {
    if (key in dict) {
      return [dict[key], key];
    }
  }

  return [null, null];
};

module.exports = { findDictValue };
