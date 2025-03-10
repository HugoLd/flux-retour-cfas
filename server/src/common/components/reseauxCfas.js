const { ReseauCfaModel } = require("../model");
const { escapeRegExp } = require("../utils/regexUtils");

const create = async ({ nom_reseau, nom_etablissement, uai, siret }) => {
  const saved = await new ReseauCfaModel({
    nom_reseau,
    nom_etablissement,
    uai,
    siret,
    created_at: new Date(),
  }).save();

  return saved.toObject();
};

/**
 * Returns list of RESEAU CFA information matching passed criteria
 * @param {{}} searchCriteria
 * @return {Array<{uai: string, nom_reseau: string, nom_etablissement: string, siret: string}>} Array of RESEAU CFA information
 */
const searchReseauxCfas = async (searchCriteria) => {
  const { searchTerm } = searchCriteria;

  const matchStage = {};

  if (searchTerm) {
    matchStage.$or = [
      { $text: { $search: searchTerm } },
      { uai: new RegExp(escapeRegExp(searchTerm), "i") },
      { siret: new RegExp(escapeRegExp(searchTerm), "i") },
      { nom_reseau: new RegExp(escapeRegExp(searchTerm), "i") },
    ];
  }

  const sortStage = searchTerm ? { score: { $meta: "textScore" }, nom_etablissement: 1 } : { nom_etablissement: 1 };
  const found = await ReseauCfaModel.aggregate([{ $match: matchStage }, { $sort: sortStage }]);

  return found.map((reseauCfa) => {
    return {
      id: reseauCfa._id,
      uai: reseauCfa.uai,
      siret: reseauCfa.siret,
      nom_reseau: reseauCfa.nom_reseau,
      nom_etablissement: reseauCfa.nom_etablissement,
    };
  });
};

module.exports = () => ({
  getAll: async () => {
    return await ReseauCfaModel.find().lean();
  },
  delete: async (id) => {
    return await ReseauCfaModel.deleteOne({ _id: id });
  },
  create,
  searchReseauxCfas,
});
