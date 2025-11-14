"use strict";

/**
 * Create a standardized info object for logging
 */
function createLogInfo({
  ip,
  professional,
  keyPublic,
  keyPrivate,
  body,
  error,
  ...additional
}) {
  const info = {
    ip: ip || null,
    date: new Date(),
    professional,
    body,
    error

  };

  // Add optional fields only if they exist

  if (keyPublic) info.keyPublic = keyPublic;
  if (keyPrivate) info.keyPrivate = keyPrivate;

  // Add any additional fields
  Object.assign(info, additional);

  return info;
}

module.exports = { createLogInfo };