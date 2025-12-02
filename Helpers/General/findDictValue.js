"use strict";

const findDictValue = (keyList, dict, throwIfEmpty = true) => {
  // Input validation
  if (!Array.isArray(keyList) || keyList.length === 0) {
    throw new Error("[findDictValue] keyList must be a non-empty array");
  }

  if (!dict || typeof dict !== "object" || Array.isArray(dict)) {
    throw new Error("[findDictValue] dict must be a valid object");
  }

  // Search for first matching key
  for (const key of keyList) {
    if (key in dict) {
      return [dict[key], key];
    }
  }

  // No match found
  if (throwIfEmpty) {
    throw new Error(
      `[findDictValue] Aucune des clés [${keyList.join(
        ", "
      )}] n'a été trouvée dans l'objet`
    );
  }

  return [null, null];
};

module.exports = { findDictValue };
