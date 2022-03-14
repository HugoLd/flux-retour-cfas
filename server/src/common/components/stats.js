const { DossierApprenantModel } = require("../../common/model");

module.exports = () => {
  return {
    getNbDistinctCfasByUai,
    getNbDistinctCfasBySiret,
  };
};

const getNbDistinctCfasByUai = async (filters = {}) => {
  const distinctCfas = await DossierApprenantModel.distinct("uai_etablissement", filters);
  return distinctCfas ? distinctCfas.length : 0;
};

const getNbDistinctCfasBySiret = async (filters = {}) => {
  const distinctCfas = await DossierApprenantModel.distinct("siret_etablissement", {
    ...filters,
    siret_etablissement_valid: true,
  });
  return distinctCfas ? distinctCfas.length : 0;
};
