const logger = require("../../../common/logger");
const config = require("../../../../config");
const { fullSampleWithUpdates } = require("../../../../tests/data/sample");
const { createRandomStatutsCandidatsList } = require("../../../../tests/data/randomizedSample");
const { User } = require("../../../common/model/index");
const { asyncForEach } = require("../../../common/utils/asyncUtils");
const { readJsonFromCsvFile } = require("../../../common/utils/fileUtils");
const fs = require("fs-extra");
const ovhStorageManager = require("../../../common/utils/ovhStorageManager");

const seedUsers = async (usersModule) => {
  const users = Object.values(config.users);
  await asyncForEach(users, async (user) => {
    if ((await User.countDocuments({ username: user.name })) !== 0) {
      logger.info(`User ${user.name} already exists - no creation needed`);
    } else {
      logger.info(`Creating user ${user.name}`);
      try {
        await usersModule.createUser(user.name, user.password, {
          permissions: user.permissions,
        });
      } catch (err) {
        logger.error(err);
        logger.error(`Failed to create user ${user.name}`);
      }
    }
  });
};

const seedSample = async (statutsCandidats) => {
  await statutsCandidats.addOrUpdateStatuts(fullSampleWithUpdates);
};

const seedRandomizedSample = async (statutsCandidats) => {
  await statutsCandidats.addOrUpdateStatuts(createRandomStatutsCandidatsList());
};

const seedRandomizedSampleWithStatut = async (statutsCandidats, nbStatuts, statutValue) => {
  const randomStatuts = createRandomStatutsCandidatsList(nbStatuts).map((statutCandidat) => {
    return {
      ...statutCandidat,
      statut_apprenant: statutValue,
    };
  });

  await statutsCandidats.addOrUpdateStatuts(randomStatuts);
};

const buildCfasFromCsvAndExcludedFile = async (referenceFilePath, excludedFilePath, encoding) => {
  const allCfasForNetwork = readJsonFromCsvFile(referenceFilePath, encoding);
  const excludedCfas = readJsonFromCsvFile(excludedFilePath, encoding);

  if (excludedCfas.length > 0 && allCfasForNetwork.length > 0) {
    const excludedSirets = excludedCfas.filter((item) => item.siret).map((item) => item.siret);
    return allCfasForNetwork.filter((item) => !excludedSirets.includes(item.siret));
  }

  return [];
};

/**
 * Télécharge le fichier depuis OvhStorage si non présent
 * @param {*} downloadDestinationFilePath
 * @param {*} referenceFilePath
 */
const downloadIfNeeded = async (downloadDestinationFilePath, referenceFilePath) => {
  if (!fs.existsSync(referenceFilePath)) {
    const storageMgr = await ovhStorageManager();
    await storageMgr.downloadFileTo(downloadDestinationFilePath, referenceFilePath);
  } else {
    logger.info(`File ${referenceFilePath} already present.`);
  }
};

module.exports = {
  downloadIfNeeded,
  seedUsers,
  seedSample,
  seedRandomizedSample,
  seedRandomizedSampleWithStatut,
  buildCfasFromCsvAndExcludedFile,
};
