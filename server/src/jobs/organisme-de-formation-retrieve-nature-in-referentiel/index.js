const { runScript } = require("../scriptWrapper");
const { asyncForEach } = require("../../common/utils/asyncUtils");
const { CfaModel } = require("../../common/model");
const { getOrganismesWithUai, SLEEP_TIME_BETWEEN_API_REQUESTS } = require("../../common/apis/apiReferentielMna");
const { sleep } = require("../../common/utils/miscUtils");
const logger = require("../../common/logger");

/**
 * Ce script tente de récupérer pour chaque UAI présent dans la collection Cfa la nature de l'organisme de formation
 */
runScript(async ({ cfas, cache }) => {
  // Gets all cfa
  const allCfa = await CfaModel.find().lean();

  const getOrganismesWithUaiCached = getOrganismesWithUai(cache);

  await asyncForEach(allCfa, async (cfa) => {
    try {
      const { data: result, meta } = await getOrganismesWithUaiCached(cfa.uai);
      // skip if no result or more than one found in Referentiel
      const uniqueResult = result?.pagination.total > 1;

      if (uniqueResult) {
        const organismeFromReferentiel = result.organismes[0];
        // if cfa in db has only SIRET and it matches the one found in referentiel then it's a perfect match
        const perfectUaiSiretMatch = cfa.sirets.length === 1 && cfa.sirets[0] === organismeFromReferentiel.siret;

        await cfas.updateCfaNature(cfa.uai, {
          nature: organismeFromReferentiel.nature,
          natureValidityWarning: !perfectUaiSiretMatch,
        });
      }

      // if organisme was not retrieved from cache but from Referentiel, sleep to avoid exceeding their API quota
      if (!meta.fromCache) {
        await sleep(SLEEP_TIME_BETWEEN_API_REQUESTS);
      }
    } catch (err) {
      logger.error(err);
    }
  });
}, "retrieve-nature-organisme-de-formation-in-referentiel-uai-siret");
