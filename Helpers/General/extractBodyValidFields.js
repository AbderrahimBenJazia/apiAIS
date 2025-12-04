"use strict";

const extractBodyValidFields = (body, allowedFields) => {
  const cleanBody = Object.create(null);

  for (const field of allowedFields) {
    if (body.hasOwnProperty(field)) {
      cleanBody[field] = body[field];
    }
  }

  return cleanBody;
};

module.exports = { extractBodyValidFields };
