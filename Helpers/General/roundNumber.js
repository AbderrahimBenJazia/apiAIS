"use strict";

const roundNumber = (number, decimal = 2) => {
  if (decimal === 0) {
    return Math.round(number);
  }

  let multiplier = 10 ** decimal;
  return Math.round(number * multiplier) / multiplier;
};
module.exports = { roundNumber };
