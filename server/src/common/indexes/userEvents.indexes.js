const createUserEventsCollectionIndexes = async (db) => {
  const collection = db.collection("userEvents");

  await collection.createIndex({ username: 1 }, { name: "username" });
  await collection.createIndex({ action: 1 }, { name: "action" });
};

const dropUserEventsCollectionIndexes = async (db) => {
  const collection = db.collection("userEvents");

  await collection.dropIndexes();
};

module.exports = { createUserEventsCollectionIndexes, dropUserEventsCollectionIndexes };
