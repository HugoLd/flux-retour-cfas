const { ReseauCfaModel } = require("../model");

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

module.exports = () => ({
  create,
});
