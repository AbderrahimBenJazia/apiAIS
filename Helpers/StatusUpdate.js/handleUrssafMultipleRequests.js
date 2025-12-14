const { sleep } = require("../General/sleep");

const RETIES_NUMBER = 4;
const STARTING_DELAY = 10000;
const DELAY_MULTIPLIER = 2;

const retryRequest = async (requestFunction, inputData, retriesLeft, delay) => {
  try {
    // Try to execute the request
    const response = await requestFunction(inputData);
    return response;
  } catch (error) {
    if (retriesLeft === 0) {
      // If no retries left, throw the error to propagate it
      throw error;
    }

    // Wait for delay before retrying (exponential backoff)
    await sleep(delay);

    // Retry the request with reduced retries and increased delay
    return retryRequest(
      requestFunction,
      inputData,
      retriesLeft - 1,
      delay * DELAY_MULTIPLIER
    );
  }
};

export const handleUrssafMultipleRequests = async (
  requests,
  chunk,
  requestFunction
) => {
  const results = [];

  const initialResults = await Promise.allSettled(requests);

  for (let i = 0; i < initialResults.length; i++) {
    const result = initialResults[i];
    if (result.status === "fulfilled") {
      // If successful, push the result
      results.push(result.value);
    } else {
      // Only retry those that failed
      try {
        const retryResult = await retryRequest(
          requestFunction,
          chunk[i],
          RETIES_NUMBER,
          STARTING_DELAY
        );
        results.push(retryResult);
      } catch (error) {
        console.error(`Request failed after retries: ${error.message}`);
      }
    }
  }

  return results;
};
