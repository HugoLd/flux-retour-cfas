const { validateCfd } = require("../src/common/domain/cfd");

module.exports = {
  async up(db) {
    const collection = db.collection("statutsCandidats");
    const cursor = collection.find();
    while (await cursor.hasNext()) {
      const document = await cursor.next();

      const isCfdValid = validateCfd(document.id_formation);
      await collection.findOneAndUpdate({ _id: document._id }, { $set: { id_formation_valid: isCfdValid } });
    }
  },

  async down(db) {
    const collection = db.collection("statutsCandidats");
    await collection.updateMany({}, { $unset: { id_formation_valid: "" } });
  },
};
