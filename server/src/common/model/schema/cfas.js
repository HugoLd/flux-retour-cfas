const { Schema } = require("mongoose");

const cfasSchema = new Schema({
  uai: {
    type: String,
    default: null,
    description: "Code uai de l'établissement",
  },
  sirets: {
    type: [String],
    default: [],
    description: "Liste des sirets reliés à l'établissement",
  },
  nom: {
    type: String,
    default: null,
    description: "Nom de l'établissement",
  },
  branchement_tdb: {
    type: Boolean,
    default: false,
    description: "Indique si le flux vers ce CFA a été mis en place et les données récupérées depuis son ERP",
  },
  erps: {
    type: [String],
    default: [],
    description: "ERPs rattachés au CFA, s'ils existent",
  },
  reseaux: {
    type: [String],
    default: [],
    description: "Réseaux du CFA, s'ils existent",
  },
  region_nom: {
    type: String,
    default: null,
    description: "Région du CFA",
  },
  region_num: {
    type: String,
    default: null,
    description: "Numéro de la région du CFA",
  },
  source_seed_cfa: {
    type: String,
    default: null,
    description: "Source du seed du cfa dans la collection (StatutsCandidats ou fichier d'origine)",
  },
  first_transmission_date: {
    type: Date,
    default: null,
    description: "Date de la première transmission de données",
  },
  metiers: {
    type: [String],
    default: [],
    description: "Les domaines métiers rattachés à l'établissement",
  },
});

module.exports = cfasSchema;
