const { buildTokenizedString } = require("../src/common/utils/buildTokenizedString");

/* will add a field `nom_etablissement_tokenized` to allow fuzzy search */
module.exports = {
  async up(db) {
    const collection = db.collection("statutsCandidats");
    const cursor = collection.find({ nom_etablissement: { $exists: true } });

    while (await cursor.hasNext()) {
      const document = await cursor.next();

      if (document.nom_etablissement) {
        await collection.findOneAndUpdate(
          { _id: document._id },
          {
            $set: {
              nom_etablissement_tokenized: buildTokenizedString(document.nom_etablissement, 3),
            },
          }
        );
      }
    }
  },

  async down(db) {
    const collection = db.collection("statutsCandidats");
    await collection.updateMany({}, { $unset: { nom_etablissement_tokenized: "" } });
  },
};
