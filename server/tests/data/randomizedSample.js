const faker = require("faker/locale/fr");
const RandExp = require("randexp");
const sampleLibelles = require("./sampleLibelles.json");
const sampleSize = require("lodash").sampleSize;

const isInePresent = () => Math.random() < 0.65;
const getRandomIne = () => new RandExp(/^[0-9]{9}[A-Z]{2}$/).gen().toUpperCase();
const getRandomIdFormation = () => new RandExp(/^[0-9]{8}$/).gen().toUpperCase();
const getRandomUaiEtablissement = () => new RandExp(/^[0-9]{7}[A-Z]{1}$/).gen().toUpperCase();
const getRandomStatutApprenant = () => Math.floor(Math.random() * Math.floor(4));

const createRandomStatutCandidat = () => {
  return {
    ine_apprenant: isInePresent() ? getRandomIne() : null,
    nom_apprenant: faker.name.lastName().toUpperCase(),
    prenom_apprenant: faker.name.firstName(),
    prenom2_apprenant: faker.random.boolean() ? faker.name.firstName().toUpperCase() : null,
    prenom3_apprenant: faker.random.boolean() ? faker.name.firstName().toUpperCase() : null,
    ne_pas_solliciter: faker.random.boolean(),
    email_contact: faker.internet.email(),

    nom_representant_legal: faker.random.boolean() ? faker.name.lastName().toUpperCase() : null,
    tel_representant_legal: faker.random.boolean() ? faker.phone.phoneNumberFormat().trim().toUpperCase() : null,
    tel2_representant_legal: faker.random.boolean() ? faker.phone.phoneNumberFormat().trim().toUpperCase() : null,

    id_formation: getRandomIdFormation(),
    libelle_court_formation: faker.random.boolean() ? sampleSize(sampleLibelles, 1)[0].intitule_court : null,
    libelle_long_formation: faker.random.boolean() ? sampleSize(sampleLibelles, 1)[0].intitule_long : null,
    uai_etablissement: getRandomUaiEtablissement(),
    nom_etablissement: `ETABLISSEMENT ${faker.random.word()}`.toUpperCase(),

    statut_apprenant: getRandomStatutApprenant(),
    date_metier_mise_a_jour_statut: faker.random.boolean() ? faker.date.past() : null,
  };
};
module.exports.createRandomStatutCandidat = createRandomStatutCandidat;

const createRandomStatutsCandidatsList = (nbItems = null) => {
  const randomList = [];
  if (!nbItems) {
    nbItems = Math.floor(Math.random() * Math.floor(100));
  }
  for (let index = 0; index < nbItems; index++) {
    randomList.push(createRandomStatutCandidat());
  }
  return randomList;
};
module.exports.createRandomStatutsCandidatsList = createRandomStatutsCandidatsList;
