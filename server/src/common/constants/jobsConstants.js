/**
 * Nom des jobs
 */
const JOB_NAMES = {
  seedSample: "seed-sample",
  seedCfas: "seed-cfas",
  seedReseauxCfas: "seed-reseauxCfas",
  clearSeedAssets: "clear-seed-assets",
  seedRandomizedSample: "seed-randomized-sample",
  identifyUaisInCatalog: "identify-uais-types-catalog",
  identifyNetworkDuplicates: "identify-network-duplicates",
  formationRetrieveFromCfd: "formation-retrieve-from-cfd",
  dossiersApprenantsRetrieveNetworks: "dossiersApprenants-retrieve-networks",
  dossiersApprenantsRetrieveNiveaux: "dossiersApprenants-retrieve-niveaux",
  dossiersApprenantsRetrieveFormateurGestionnairesCatalog: "dossiersApprenants-retrieve-formateur-gestionnaire-catalog",
  dossiersApprenantsBadHistoryIdentifyAntidated: "dossiersApprenants-bad-history-identify-antidated",
  createIndexes: "create-indexes",
  createEffectifsApprenantsCollection: "create-effectifs-apprenants-collection",
  clearUsers: "clear-users",
  clearCfas: "clear-cfas",
  clearDossiersApprenants: "clear-dossiersApprenants",
  clearDossiersApprenantsNetworks: "clear-dossiersApprenants-networks",
  clearLogs: "clear-logs",
  clearAll: "clear-all",
  repostLatestDossiersApprenantsReceived: "repost-latest-dossiersApprenants-received",
  warmUpCache: "warm-up-cache",
  retrieveRncps: "retrieve-rncps-in-tco-for-cfds",
  createErpUser: "users:create-erp-user",
  createUser: "users:create-user",
  generatePasswordUpdateToken: "users:generate-password-update-token",
};

/**
 * Statuts possibles pour les jobs
 */
const jobEventStatuts = {
  started: "started",
  executed: "executed",
  ended: "ended",
};

module.exports = { JOB_NAMES, jobEventStatuts };
