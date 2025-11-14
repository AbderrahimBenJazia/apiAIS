"use strict";

const queryData = async (
  db,
  collectionName,
  filter,
  projection,
  pagination
) => {
  const totalCount = await db.collection(collectionName).countDocuments(filter);

  const data = await db
    .collection(collectionName)
    .find(filter, { projection })
    .sort({ date: -1 }) // Always sort by "date" field, newest to oldest
    .skip(pagination.skip)
    .limit(pagination.limit)
    .toArray();

  return { data, totalCount };
};

module.exports = { queryData };
