const cliProgress = require("cli-progress");

const { runScript } = require("../../scriptWrapper");
const logger = require("../../../common/logger");
const { asyncForEach } = require("../../../common/utils/asyncUtils");
const { jobNames, duplicatesTypesCodes } = require("../../../common/model/constants");
const { collectionNames } = require("../../constants");

const loadingBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

/**
 * Job d'identification des doublons d'UAIs
 * Construit une collection statutsCandidatsDoublonsUais contenant les doublons
 */
runScript(async ({ statutsCandidats, effectifs, db }) => {
  await identifyUaisDuplicates({ statutsCandidats, effectifs, db });
}, jobNames.statutsCandidatsBadHistoryIdentifyAntidated);

const identifyUaisDuplicates = async ({ statutsCandidats, effectifs, db }) => {
  logger.info("Run identification statuts-candidats with duplicates uais...");

  const resultsCollection = db.collection(collectionNames.statutsCandidatsDoublonsUais);
  await resultsCollection.deleteMany({});

  // Identify all uais duplicates
  const uaisDuplicates = await statutsCandidats.getDuplicatesList(
    duplicatesTypesCodes.uai_etablissement.code,
    {},
    { allowDiskUse: true }
  );
  loadingBar.start(uaisDuplicates.length, 0);

  // Calcul for total statuts & for this current duplicate
  let total = {
    nbApprentis: 0,
    nbInscritsSansContrats: 0,
    nbRupturants: 0,
    nbAbandons: 0,
  };

  // Create entry for each duplicate
  await asyncForEach(uaisDuplicates, async (currentDuplicate) => {
    loadingBar.increment();

    // Calcul de chaque effectif à la date du jour pour le groupe de doublons
    const calculDate = new Date();

    const { nbApprentis, nbInscritsSansContrats, nbRupturants, nbAbandons } = {
      nbApprentis: await effectifs.apprentis.getCountAtDate(calculDate, currentDuplicate.commonData),
      nbRupturants: await effectifs.rupturants.getCountAtDate(calculDate, currentDuplicate.commonData),
      nbInscritsSansContrats: await effectifs.inscritsSansContrats.getCountAtDate(
        calculDate,
        currentDuplicate.commonData
      ),
      nbAbandons: await effectifs.abandons.getCountAtDate(calculDate, currentDuplicate.commonData),
    };

    // Update du total
    total.nbApprentis += nbApprentis;
    total.nbInscritsSansContrats += nbInscritsSansContrats;
    total.nbApprentis += nbRupturants;
    total.nbApprentis += nbAbandons;

    await resultsCollection.insertOne({
      type: "Doublons d'UAI",
      champs_communs: currentDuplicate.commonData,
      nb_doublons: currentDuplicate.duplicatesCount,
      uais: currentDuplicate.discriminants.uais,
      ids_doublons: currentDuplicate.duplicatesIds,
      nb_apprentis_concernes: nbApprentis,
      nb_inscrits_sans_contrat_concerne: nbInscritsSansContrats,
      nb_rupturants_concernes: nbRupturants,
      nb_abandons_concernes: nbAbandons,
    });
  });

  // Ajout d'une entree stats avec le total
  await resultsCollection.insertOne({
    type: "Stats",
    total_apprentis: total.nbApprentis,
    total_inscrits_sans_contrat: total.nbInscritsSansContrats,
    total_rupturants: total.nbRupturants,
    total_abandons: total.nbAbandons,
  });

  loadingBar.stop();
  logger.info("End identification statuts-candidats with duplicates uais !");
};
