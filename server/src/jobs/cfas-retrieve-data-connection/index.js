const { runScript } = require("../scriptWrapper");
const cliProgress = require("cli-progress");
const logger = require("../../common/logger");
const { DossierApprenantModel, CfaModel } = require("../../common/model");
const { asyncForEach } = require("../../common/utils/asyncUtils");
const { JOB_NAMES } = require("../../common/constants/jobsConstants");

const loadingBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

/**
 * Ce script permet de mettre à jour le référentiel des CFAs en
 * précisant si des données sont trouvées dans les DossierApprenant
 */
runScript(async () => {
  logger.info("Run Cfas Branchement Retrieving Job");
  await retrieveDataConnections();
  logger.info("End Cfas Branchement Retrieving Job");
}, JOB_NAMES.cfasRetrieveDataConnection);

/**
 * Parse tous les CFAs et vérifie s'il existe des données dans les statuts pour ce CFA
 * Si données trouvé update le champ branchement_flux_cfa_erp
 * Se base sur l'uai de l'établissement
 */
const retrieveDataConnections = async () => {
  // Parse tous les CFAs du référentiel
  const allCfas = await CfaModel.find({}).lean();

  logger.info(`Searching for ${allCfas.length} CFAs in référentiel`);
  loadingBar.start(allCfas.length, 0);

  await asyncForEach(allCfas, async (cfaReferentiel) => {
    // Si uai fourni on update les statuts pour cet uai
    if (cfaReferentiel.uai) {
      // Vérification d'existence de DossierApprenant pour cet uai
      const statutsForUai = await DossierApprenantModel.exists({ uai_etablissement: cfaReferentiel.uai });
      if (statutsForUai) {
        await CfaModel.findByIdAndUpdate(
          cfaReferentiel._id,
          {
            $set: { branchement_flux_cfa_erp: true },
          },
          { new: true }
        );
      }
    }

    loadingBar.increment();
  });

  loadingBar.stop();
};
