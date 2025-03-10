const { runScript } = require("../scriptWrapper");
const cliProgress = require("cli-progress");
const logger = require("../../common/logger");
const { DossierApprenantModel, CfaModel } = require("../../common/model");
const { asyncForEach } = require("../../common/utils/asyncUtils");
const { JOB_NAMES } = require("../../common/constants/jobsConstants");

const loadingBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

/**
 * Ce script permet de récupérer les réseaux de cfas
 * pour chaque DossierApprenant
 */
runScript(async () => {
  logger.info("Run Cfas Network Retrieving Job");
  await retrieveNetworks();
  logger.info("End Cfas Network Retrieving Job");
}, JOB_NAMES.dossiersApprenantsRetrieveNetworks);

/**
 * Parse tous les CFAs ayant un réseau de cfas
 * MAJ les DossierApprenant pour ce CFA
 */
const retrieveNetworks = async () => {
  // Parse tous les CFAs avec au moins un réseau
  const cfasWithReseaux = await CfaModel.find({ reseaux: { $exists: true, $ne: [] } }).lean();

  logger.info(`Récupération des réseaux pour ${cfasWithReseaux.length} CFAs avec au moins un réseau`);
  loadingBar.start(cfasWithReseaux.length, 0);

  await asyncForEach(cfasWithReseaux, async (currentCfaWithReseau) => {
    // Si liste de sirets on update les dossiers apprenants pour ces sirets
    if (currentCfaWithReseau.sirets?.length > 0) {
      // Récupération des DossierApprenant pour ces sirets
      const dossiersForSirets = await DossierApprenantModel.find({
        siret_etablissement: { $in: currentCfaWithReseau.sirets },
      }).lean();

      if (dossiersForSirets) {
        await updateNetworksForDossiersApprenants(dossiersForSirets, currentCfaWithReseau);
      }
    } else {
      // Sinon si uai fourni on update les dossiers apprenants pour cet uai
      if (currentCfaWithReseau.uai) {
        // Recupération des DossierApprenant pour cet uai
        const dossiersForUai = await DossierApprenantModel.find({ uai_etablissement: currentCfaWithReseau.uai }).lean();
        if (dossiersForUai) {
          await updateNetworksForDossiersApprenants(dossiersForUai, currentCfaWithReseau);
        }
      }
    }

    loadingBar.increment();
  });

  loadingBar.stop();
};

/**
 * Méthode de MAJ d'une liste de DossierApprenant à partir d'un CFA du référentiel
 * @param {*} dossiersToUpdate
 * @param {*} cfaReferentiel
 * @returns
 */
const updateNetworksForDossiersApprenants = async (dossiersToUpdate, cfaReferentiel) => {
  await asyncForEach(dossiersToUpdate, async (currentDossier) => {
    // Update du dossier apprenant s'il n'a pas de réseau
    if (!currentDossier.etablissement_reseaux) {
      await addReseauxToDossierApprenant(currentDossier, cfaReferentiel.reseaux);
    } else {
      // Identification des réseaux manquants dans le dossier apprenant, et update si nécessaire
      const missingNetworks = cfaReferentiel.reseaux.filter((x) => !currentDossier.etablissement_reseaux.includes(x));
      if (missingNetworks.length > 0) {
        await addReseauxToDossierApprenant(currentDossier, missingNetworks);
      }
    }
  });
};

/**
 * Ajout de réseaux à un DossierApprenant
 * @param {*} currentDossierForSiret
 * @param {*} reseauxToAdd
 */
const addReseauxToDossierApprenant = async (currentDossierForSiret, reseauxToAdd) => {
  await DossierApprenantModel.findByIdAndUpdate(
    currentDossierForSiret._id,
    {
      $addToSet: {
        etablissement_reseaux: reseauxToAdd,
      },
    },
    { new: true }
  );
};
