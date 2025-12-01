"use strict";

const titleCase = (str) => {
  return str
    ?.split(" ")
    ?.map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
    ?.join(" ")
    ?.trim();
};

module.exports = { titleCase };
