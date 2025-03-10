/**
 * Codes des statuts des apprenants
 */
const CODES_STATUT_APPRENANT = {
  inscrit: 2,
  apprenti: 3,
  abandon: 0,
};

/**
 * Nom des statuts
 */
const LABELS_STATUT_APPRENANT = [
  { code: CODES_STATUT_APPRENANT.abandon, name: "abandon" },
  { code: CODES_STATUT_APPRENANT.inscrit, name: "inscrit" },
  { code: CODES_STATUT_APPRENANT.apprenti, name: "apprenti" },
];

/**
 * Fonction de récupération d'un nom de statut depuis son code
 * @param {*} statutCode
 * @returns
 */
const getStatutApprenantNameFromCode = (statutCode) =>
  LABELS_STATUT_APPRENANT.find((item) => item.code === statutCode)?.name ?? "NC";

/**
 * Code pour les types de doublons identifiables
 */
const DUPLICATE_TYPE_CODES = {
  unique: {
    name: "Uniques (clé d'unicité identique)",
    code: 1,
  },
  formation_cfd: {
    name: "CFDs",
    code: 2,
  },
  prenom_apprenant: {
    name: "Prenom",
    code: 3,
  },
  nom_apprenant: {
    name: "Nom",
    code: 4,
  },
  uai_etablissement: {
    name: "Uai",
    code: 5,
  },
};

/**
 * Liste des nom des indicateurs
 */
const EFFECTIF_INDICATOR_NAMES = {
  apprentis: "apprenti",
  inscritsSansContrats: "inscrit sans contrat",
  rupturants: "rupturant",
  abandons: "abandon",
};

module.exports = {
  CODES_STATUT_APPRENANT,
  DUPLICATE_TYPE_CODES,
  EFFECTIF_INDICATOR_NAMES,
  LABELS_STATUT_APPRENANT,
  getStatutApprenantNameFromCode,
};
