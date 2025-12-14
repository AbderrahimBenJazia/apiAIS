"use strict";

const arrangeArray = (myArray, chunkSize) => {
  // split array on arrays of size chunkSize

  const arrayLength = myArray?.length;
  const splitArray = [];
  for (let index = 0; index < arrayLength; index += chunkSize) {
    const currentChunk = myArray.slice(index, index + chunkSize);
    splitArray.push(currentChunk);
  }

  return splitArray;
};

module.exports = { arrangeArray };
