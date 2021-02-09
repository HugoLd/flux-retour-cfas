const { codesStatutsCandidats } = require("../../src/common/model/constants");

const simpleStatut = {
  ine_apprenant: "12345",
  nom_apprenant: "testNom",
  prenom_apprenant: "testPrenom",
  ne_pas_solliciter: false,
  email_contact: "testemail_contact@test.fr",
  nom_representant_legal: "testnom_representant_legal",
  tel_representant_legal: "testtel_representant_legal",
  tel2_representant_legal: "testtel2_representant_legal",
  id_formation: "testid_formation",
  libelle_court_formation: "testlibelle_court_formation",
  libelle_long_formation: "testlibelle_long_formation",
  uai_etablissement: "testuai_etablissement",
  siret_etablissement: "11111111111111",
  nom_etablissement: "testnom_etablissement",
  statut_apprenant: 3,
  date_metier_mise_a_jour_statut: "1970-01-10T17:42:36.000Z",
  periode_formation: [2020, 2021],
  annee_formation: 2020,
};

const simpleProspectStatut = {
  ine_apprenant: "12345",
  nom_apprenant: "testNom",
  prenom_apprenant: "testPrenom",
  ne_pas_solliciter: false,
  email_contact: "testemail_contact@test.fr",
  nom_representant_legal: "testnom_representant_legal",
  tel_representant_legal: "testtel_representant_legal",
  tel2_representant_legal: "testtel2_representant_legal",
  id_formation: "testid_formation",
  libelle_court_formation: "testlibelle_court_formation",
  libelle_long_formation: "testlibelle_long_formation",
  uai_etablissement: "testuai_etablissement",
  siret_etablissement: "11111111111111",
  nom_etablissement: "testnom_etablissement",
  statut_apprenant: codesStatutsCandidats.prospect,
  date_metier_mise_a_jour_statut: "1970-01-10T17:42:36.000Z",
  periode_formation: [2020, 2021],
  annee_formation: 2020,
};

const statutsTest = [
  {
    ine_apprenant: "12345",
    nom_apprenant: "testNom",
    prenom_apprenant: "testPrenom",
    ne_pas_solliciter: false,
    email_contact: "testemail_contact@test.fr",
    nom_representant_legal: "testnom_representant_legal",
    tel_representant_legal: "testtel_representant_legal",
    tel2_representant_legal: "testtel2_representant_legal",
    id_formation: "testid_formation",
    libelle_court_formation: "testlibelle_court_formation",
    libelle_long_formation: "testlibelle_long_formation",
    uai_etablissement: "testuai_etablissement",
    siret_etablissement: "11111111111111",
    nom_etablissement: "testnom_etablissement",
    statut_apprenant: 1,
    date_metier_mise_a_jour_statut: "1970-01-10T17:42:36.000Z",
    periode_formation: [2020, 2021],
    annee_formation: 2020,
  },
  {
    ine_apprenant: "6789",
    nom_apprenant: "test2Nom",
    prenom_apprenant: "test2Prenom",
    ne_pas_solliciter: true,
    email_contact: "test2email_contact@test.fr",
    id_formation: "test2id_formation",
    uai_etablissement: "testuai_etablissement",
    siret_etablissement: "11111111111111",
    nom_etablissement: "testnom_etablissement",
    statut_apprenant: 1,
    annee_formation: 0,
  },
  {
    nom_apprenant: "test3Nom",
    prenom_apprenant: "test3Prenom",
    ne_pas_solliciter: true,
    email_contact: "test3email_contact@test.fr",
    id_formation: "test3id_formation",
    uai_etablissement: "testuai_etablissement",
    siret_etablissement: "11111111111111",
    nom_etablissement: "testnom_etablissement",
    statut_apprenant: 1,
    annee_formation: 2019,
  },
];

const statutsTestUpdate = [
  {
    ine_apprenant: "12345",
    nom_apprenant: "testNom",
    prenom_apprenant: "testPrenom",
    ne_pas_solliciter: false,
    email_contact: "testemail_contact@test.fr",
    nom_representant_legal: "testnom_representant_legal",
    tel_representant_legal: "testtel_representant_legal",
    tel2_representant_legal: "testtel2_representant_legal",
    id_formation: "testid_formation",
    libelle_court_formation: "testlibelle_court_formation",
    libelle_long_formation: "testlibelle_long_formation",
    uai_etablissement: "testuai_etablissement",
    siret_etablissement: "11111111111111",
    nom_etablissement: "testnom_etablissement",
    statut_apprenant: 2,
    date_metier_mise_a_jour_statut: "1970-01-10T17:42:36.000Z",
    periode_formation: [2020, 2021],
    annee_formation: 2020,
  },
  {
    ine_apprenant: "6789",
    nom_apprenant: "test2Nom",
    prenom_apprenant: "test2Prenom",
    ne_pas_solliciter: true,
    email_contact: "test2email_contact@test.fr",
    id_formation: "test2id_formation",
    uai_etablissement: "testuai_etablissement",
    siret_etablissement: "11111111111111",
    nom_etablissement: "testnom_etablissement",
    statut_apprenant: 2,
    annee_formation: 0,
  },
  {
    nom_apprenant: "test3Nom",
    prenom_apprenant: "test3Prenom",
    ne_pas_solliciter: true,
    email_contact: "test3email_contact@test.fr",
    id_formation: "test3id_formation",
    uai_etablissement: "testuai_etablissement",
    siret_etablissement: "11111111111111",
    nom_etablissement: "testnom_etablissement",
    statut_apprenant: 1,
    annee_formation: 2019,
  },
  {
    ine_apprenant: "99999",
    nom_apprenant: "nouveauNom",
    prenom_apprenant: "nouveauPrenom",
    ne_pas_solliciter: false,
    email_contact: "nouvelEmail@email.fr",
    id_formation: "nouvelleFormation",
    uai_etablissement: "testuai_etablissement",
    siret_etablissement: "11111111111111",
    nom_etablissement: "testnom_etablissement",
    statut_apprenant: 1,
    annee_formation: 2021,
  },
];

const simpleStatutBadUpdate = {
  ine_apprenant: "12345",
  nom_apprenant: "testNom",
  prenom_apprenant: "testPrenom",
  ne_pas_solliciter: false,
  email_contact: "testemail_contact@test.fr",
  nom_representant_legal: "testnom_representant_legal",
  tel_representant_legal: "testtel_representant_legal",
  tel2_representant_legal: "testtel2_representant_legal",
  id_formation: "testid_formation",
  libelle_court_formation: "testlibelle_court_formation",
  libelle_long_formation: "testlibelle_long_formation",
  uai_etablissement: "testuai_etablissement",
  siret_etablissement: "11111111111111",
  nom_etablissement: "testnom_etablissement",
  statut_apprenant: 1,
  periode_formation: [2020, 2021],
  annee_formation: 2020,
};

const fullSampleWithUpdates = [
  {
    ine_apprenant: "111111111AA",
    nom_apprenant: "SMITH",
    prenom_apprenant: "John",
    ne_pas_solliciter: false,
    email_contact: "john.smith@test.fr",
    nom_representant_legal: "SMITH",
    tel_representant_legal: "0611111111",
    tel2_representant_legal: "0622222222",
    id_formation: "11111111",
    libelle_court_formation: "Formation test",
    libelle_long_formation: "Ceci est la formation de test",
    uai_etablissement: "0000001S",
    siret_etablissement: "00000000000001",
    nom_etablissement: "Etablissement de test",
    statut_apprenant: 1,
    periode_formation: [2020, 2021],
    annee_formation: 2020,
  },
  {
    ine_apprenant: "111111111AB",
    nom_apprenant: "MBAPPE",
    prenom_apprenant: "Kilyan",
    ne_pas_solliciter: false,
    email_contact: "k.mbp@test.fr",
    nom_representant_legal: "MBAPPE",
    tel_representant_legal: "0611111110",
    tel2_representant_legal: "0622222220",
    id_formation: "11111111",
    libelle_court_formation: "Formation test",
    libelle_long_formation: "Ceci est la formation de test",
    uai_etablissement: "0000001S",
    siret_etablissement: "00000000000001",
    nom_etablissement: "Etablissement de test",
    statut_apprenant: 1,
    periode_formation: [2020, 2021],
    annee_formation: 2020,
  },
  {
    nom_apprenant: "RONALDO",
    prenom_apprenant: "Cristiano",
    ne_pas_solliciter: true,
    email_contact: "cr7@test.fr",
    id_formation: "11111112",
    uai_etablissement: "0000001X",
    siret_etablissement: "00000000000002",
    nom_etablissement: "Autre Etablissement",
    statut_apprenant: 2,
  },
  {
    nom_apprenant: "GIROUD",
    prenom_apprenant: "Olivier",
    ne_pas_solliciter: false,
    email_contact: "ogiroud@test.fr",
    nom_representant_legal: "GIROUD",
    tel_representant_legal: "0611111177",
    tel2_representant_legal: "0622228888",
    id_formation: "11111118",
    libelle_court_formation: "Formation autre test",
    libelle_long_formation: "Ceci est la formation d'un autre test",
    uai_etablissement: "0000001S",
    siret_etablissement: "00000000000001",
    nom_etablissement: "Etablissement de test",
    statut_apprenant: 3,
    periode_formation: [2020, 2021],
    annee_formation: 2020,
  },
  {
    nom_apprenant: "GIROUD",
    prenom_apprenant: "Olivier",
    ne_pas_solliciter: false,
    email_contact: "ogiroud@test.fr",
    nom_representant_legal: "GIROUD",
    tel_representant_legal: "0611111177",
    tel2_representant_legal: "0622228888",
    id_formation: "11111118",
    libelle_court_formation: "Formation autre test",
    libelle_long_formation: "Ceci est la formation d'un autre test",
    uai_etablissement: "0000008S",
    siret_etablissement: "00000000000008",
    nom_etablissement: "Etablissement 3",
    statut_apprenant: 1,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "111111111BB",
    nom_apprenant: "SANTOS",
    prenom_apprenant: "Neymar",
    ne_pas_solliciter: false,
    email_contact: "ney@test.fr",
    nom_representant_legal: "SANTOS",
    tel_representant_legal: "0611111119",
    tel2_representant_legal: "0622222228",
    id_formation: "11111118",
    libelle_court_formation: "Formation autre test",
    libelle_long_formation: "Ceci est la formation d'un autre test",
    uai_etablissement: "0000001S",
    siret_etablissement: "00000000000001",
    nom_etablissement: "Etablissement de test",
    statut_apprenant: 3,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "111111111XX",
    nom_apprenant: "COMAN",
    prenom_apprenant: "Kingsley",
    ne_pas_solliciter: false,
    email_contact: "king@test.fr",
    nom_representant_legal: "COMAN",
    tel_representant_legal: "0611111199",
    tel2_representant_legal: "0622222288",
    id_formation: "11111111",
    libelle_court_formation: "Formation test",
    libelle_long_formation: "Ceci est la formation de test",
    uai_etablissement: "0000001S",
    siret_etablissement: "00000000000001",
    nom_etablissement: "Etablissement de test",
    statut_apprenant: 0,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "111111112PP",
    nom_apprenant: "DI MARIA",
    prenom_apprenant: "Angel",
    ne_pas_solliciter: false,
    email_contact: "adimaria@test.fr",
    nom_representant_legal: "DOS MARIA",
    tel_representant_legal: "0711111199",
    tel2_representant_legal: "0722222288",
    id_formation: "11111111",
    libelle_court_formation: "Formation test",
    libelle_long_formation: "Ceci est la formation de test",
    uai_etablissement: "0000001S",
    siret_etablissement: "00000000000001",
    nom_etablissement: "Etablissement de test",
    statut_apprenant: 0,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "111111111XX",
    nom_apprenant: "COMAN",
    prenom_apprenant: "Kingsley",
    ne_pas_solliciter: false,
    email_contact: "king@test.fr",
    nom_representant_legal: "COMAN",
    tel_representant_legal: "0611111199",
    tel2_representant_legal: "0622222288",
    id_formation: "11111999",
    libelle_court_formation: "Formation Sport",
    libelle_long_formation: "Ceci est la formation de sport",
    uai_etablissement: "0000002D",
    siret_etablissement: "00000000000022",
    nom_etablissement: "Etablissement de sport",
    statut_apprenant: 1,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "001111111XX",
    nom_apprenant: "GRIEZMANN",
    prenom_apprenant: "Antoine",
    ne_pas_solliciter: false,
    email_contact: "antoinegrizou@test.fr",
    nom_representant_legal: "GRIEZMANN",
    tel_representant_legal: "0611111253",
    tel2_representant_legal: "0622222254",
    id_formation: "11111666",
    libelle_court_formation: "Formation Developpement",
    libelle_long_formation: "Ceci est la formation de Developpement",
    uai_etablissement: "0000002D",
    siret_etablissement: "00000000000022",
    nom_etablissement: "Etablissement de sport",
    statut_apprenant: 0,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "001111111MM",
    nom_apprenant: "MANDANDA",
    prenom_apprenant: "Steve",
    ne_pas_solliciter: false,
    email_contact: "steve@marseille.fr",
    nom_representant_legal: "MANDANDA",
    tel_representant_legal: "0722111253",
    tel2_representant_legal: "0722111254",
    id_formation: "11111666",
    libelle_court_formation: "Formation Developpement",
    libelle_long_formation: "Ceci est la formation de Developpement",
    uai_etablissement: "0000002D",
    siret_etablissement: "00000000000022",
    nom_etablissement: "Etablissement de sport",
    statut_apprenant: 1,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "001111111MM",
    nom_apprenant: "MANDANDA",
    prenom_apprenant: "Steve",
    ne_pas_solliciter: false,
    email_contact: "steve@marseille.fr",
    nom_representant_legal: "MANDANDA",
    tel_representant_legal: "0722111253",
    tel2_representant_legal: "0722111254",
    id_formation: "11111666",
    libelle_court_formation: "Formation Developpement",
    libelle_long_formation: "Ceci est la formation de Developpement",
    uai_etablissement: "0000002D",
    siret_etablissement: "00000000000022",
    nom_etablissement: "Etablissement de sport",
    statut_apprenant: 2,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "001111111QQ",
    nom_apprenant: "RABIOT",
    prenom_apprenant: "Adrien",
    ne_pas_solliciter: false,
    email_contact: "adrien@rabiot.fr",
    nom_representant_legal: "RABIOT",
    tel_representant_legal: "0722114567",
    tel2_representant_legal: "0722114567",
    id_formation: "11111666",
    libelle_court_formation: "Formation Developpement",
    libelle_long_formation: "Ceci est la formation de Developpement",
    uai_etablissement: "0000002D",
    siret_etablissement: "00000000000022",
    nom_etablissement: "Etablissement de sport",
    statut_apprenant: 1,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "001111111QQ",
    nom_apprenant: "RABIOT",
    prenom_apprenant: "Adrien",
    ne_pas_solliciter: false,
    email_contact: "adrien@rabiot.fr",
    nom_representant_legal: "RABIOT",
    tel_representant_legal: "0722114567",
    tel2_representant_legal: "0722114567",
    id_formation: "11111666",
    libelle_court_formation: "Formation Developpement",
    libelle_long_formation: "Ceci est la formation de Developpement",
    uai_etablissement: "0000002D",
    siret_etablissement: "00000000000022",
    nom_etablissement: "Etablissement de sport",
    statut_apprenant: 2,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "991111111CC",
    nom_apprenant: "PAVARD",
    prenom_apprenant: "Benjamin",
    ne_pas_solliciter: false,
    email_contact: "benjamin@bayern.fr",
    nom_representant_legal: "PAVARD",
    tel_representant_legal: "0791551253",
    tel2_representant_legal: "0791551254",
    id_formation: "11111666",
    libelle_court_formation: "Formation Developpement",
    libelle_long_formation: "Ceci est la formation de Developpement",
    uai_etablissement: "0000002D",
    siret_etablissement: "00000000000022",
    nom_etablissement: "Etablissement de sport",
    statut_apprenant: 1,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "991111111CC",
    nom_apprenant: "PAVARD",
    prenom_apprenant: "Benjamin",
    ne_pas_solliciter: false,
    email_contact: "benjamin@bayern.fr",
    nom_representant_legal: "PAVARD",
    tel_representant_legal: "0791551253",
    tel2_representant_legal: "0791551254",
    id_formation: "11111666",
    libelle_court_formation: "Formation Developpement",
    libelle_long_formation: "Ceci est la formation de Developpement",
    uai_etablissement: "0000002D",
    siret_etablissement: "00000000000022",
    nom_etablissement: "Etablissement de sport",
    statut_apprenant: 2,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "991111111CC",
    nom_apprenant: "PAVARD",
    prenom_apprenant: "Benjamin",
    ne_pas_solliciter: false,
    email_contact: "benjamin@bayern.fr",
    nom_representant_legal: "PAVARD",
    tel_representant_legal: "0791551253",
    tel2_representant_legal: "0791551254",
    id_formation: "11111666",
    libelle_court_formation: "Formation Developpement",
    libelle_long_formation: "Ceci est la formation de Developpement",
    uai_etablissement: "0000002D",
    siret_etablissement: "00000000000022",
    nom_etablissement: "Etablissement de sport",
    statut_apprenant: 3,
    annee_formation: 2021,
  },
];

const fullSample = [
  {
    ine_apprenant: "111111111AA",
    nom_apprenant: "SMITH",
    prenom_apprenant: "John",
    ne_pas_solliciter: false,
    email_contact: "john.smith@test.fr",
    nom_representant_legal: "SMITH",
    tel_representant_legal: "0611111111",
    tel2_representant_legal: "0622222222",
    id_formation: "11111111",
    libelle_court_formation: "Formation test",
    libelle_long_formation: "Ceci est la formation de test",
    uai_etablissement: "0000001S",
    siret_etablissement: "00000000000001",
    nom_etablissement: "Etablissement de test",
    statut_apprenant: 1,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "111111111AB",
    nom_apprenant: "MBAPPE",
    prenom_apprenant: "Kilyan",
    ne_pas_solliciter: false,
    email_contact: "k.mbp@test.fr",
    nom_representant_legal: "MBAPPE",
    tel_representant_legal: "0611111110",
    tel2_representant_legal: "0622222220",
    id_formation: "11111111",
    libelle_court_formation: "Formation test",
    libelle_long_formation: "Ceci est la formation de test",
    uai_etablissement: "0000001S",
    siret_etablissement: "00000000000001",
    nom_etablissement: "Etablissement de test",
    statut_apprenant: 1,
    annee_formation: 2021,
  },
  {
    nom_apprenant: "RONALDO",
    prenom_apprenant: "Cristiano",
    ne_pas_solliciter: true,
    email_contact: "cr7@test.fr",
    id_formation: "11111112",
    uai_etablissement: "0000001X",
    siret_etablissement: "00000000000002",
    nom_etablissement: "Autre Etablissement",
    statut_apprenant: 2,
    annee_formation: 2021,
  },
  {
    nom_apprenant: "GIROUD",
    prenom_apprenant: "Olivier",
    ne_pas_solliciter: false,
    email_contact: "ogiroud@test.fr",
    nom_representant_legal: "GIROUD",
    tel_representant_legal: "0611111177",
    tel2_representant_legal: "0622228888",
    id_formation: "11111118",
    libelle_court_formation: "Formation autre test",
    libelle_long_formation: "Ceci est la formation d'un autre test",
    uai_etablissement: "0000001S",
    siret_etablissement: "00000000000001",
    nom_etablissement: "Etablissement de test",
    statut_apprenant: 3,
    annee_formation: 2021,
  },
  {
    nom_apprenant: "GIROUD",
    prenom_apprenant: "Olivier",
    ne_pas_solliciter: false,
    email_contact: "ogiroud@test.fr",
    nom_representant_legal: "GIROUD",
    tel_representant_legal: "0611111177",
    tel2_representant_legal: "0622228888",
    id_formation: "11111118",
    libelle_court_formation: "Formation autre test",
    libelle_long_formation: "Ceci est la formation d'un autre test",
    uai_etablissement: "0000008S",
    siret_etablissement: "00000000000008",
    nom_etablissement: "Etablissement 3",
    statut_apprenant: 1,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "111111111BB",
    nom_apprenant: "SANTOS",
    prenom_apprenant: "Neymar",
    ne_pas_solliciter: false,
    email_contact: "ney@test.fr",
    nom_representant_legal: "SANTOS",
    tel_representant_legal: "0611111119",
    tel2_representant_legal: "0622222228",
    id_formation: "11111118",
    libelle_court_formation: "Formation autre test",
    libelle_long_formation: "Ceci est la formation d'un autre test",
    uai_etablissement: "0000001S",
    siret_etablissement: "00000000000001",
    nom_etablissement: "Etablissement de test",
    statut_apprenant: 3,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "111111111XX",
    nom_apprenant: "COMAN",
    prenom_apprenant: "Kingsley",
    ne_pas_solliciter: false,
    email_contact: "king@test.fr",
    nom_representant_legal: "COMAN",
    tel_representant_legal: "0611111199",
    tel2_representant_legal: "0622222288",
    id_formation: "11111111",
    libelle_court_formation: "Formation test",
    libelle_long_formation: "Ceci est la formation de test",
    uai_etablissement: "0000001S",
    siret_etablissement: "00000000000001",
    nom_etablissement: "Etablissement de test",
    statut_apprenant: 0,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "111111112PP",
    nom_apprenant: "DI MARIA",
    prenom_apprenant: "Angel",
    ne_pas_solliciter: false,
    email_contact: "adimaria@test.fr",
    nom_representant_legal: "DOS MARIA",
    tel_representant_legal: "0711111199",
    tel2_representant_legal: "0722222288",
    id_formation: "11111111",
    libelle_court_formation: "Formation test",
    libelle_long_formation: "Ceci est la formation de test",
    uai_etablissement: "0000001S",
    siret_etablissement: "00000000000001",
    nom_etablissement: "Etablissement de test",
    statut_apprenant: 0,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "111111111XX",
    nom_apprenant: "COMAN",
    prenom_apprenant: "Kingsley",
    ne_pas_solliciter: false,
    email_contact: "king@test.fr",
    nom_representant_legal: "COMAN",
    tel_representant_legal: "0611111199",
    tel2_representant_legal: "0622222288",
    id_formation: "11111999",
    libelle_court_formation: "Formation Sport",
    libelle_long_formation: "Ceci est la formation de sport",
    uai_etablissement: "0000002D",
    siret_etablissement: "00000000000022",
    nom_etablissement: "Etablissement de sport",
    statut_apprenant: 1,
    annee_formation: 2021,
  },
  {
    ine_apprenant: "001111111XX",
    nom_apprenant: "GRIEZMANN",
    prenom_apprenant: "Antoine",
    ne_pas_solliciter: false,
    email_contact: "antoinegrizou@test.fr",
    nom_representant_legal: "GRIEZMANN",
    tel_representant_legal: "0611111253",
    tel2_representant_legal: "0622222254",
    id_formation: "11111666",
    libelle_court_formation: "Formation Developpement",
    libelle_long_formation: "Ceci est la formation de Developpement",
    uai_etablissement: "0000002D",
    siret_etablissement: "00000000000022",
    nom_etablissement: "Etablissement de sport",
    statut_apprenant: 0,
    annee_formation: 2021,
  },
];

const sampleEtablissementDataFromSiret = {
  adresse: "ADRESSE DE TEST - TOULOUSE FRANCE",
  code_postal: "31500",
  code_commune_insee: "31555",
  localite: "TOULOUSE",
  geo_coordonnees: "40.000000,1.000000",
  region_implantation_nom: "Occitanie",
  region_implantation_code: "76",
  num_departement: "31",
  nom_departement: "Haute-Garonne",
  nom_academie: "Toulouse",
  num_academie: "16",
};

module.exports = {
  statutsTest,
  statutsTestUpdate,
  simpleStatut,
  simpleStatutBadUpdate,
  simpleProspectStatut,
  fullSample,
  fullSampleWithUpdates,
  sampleEtablissementDataFromSiret,
};
