const assert = require("assert");
const httpTests = require("../../utils/httpTests");
const faker = require("faker/locale/fr");
const { createRandomStatutCandidat, getRandomSiretEtablissement } = require("../../data/randomizedSample");
const {
  historySequenceProspectToInscritToApprentiToAbandon,
  historySequenceApprenti,
  historySequenceInscritToApprenti,
} = require("../../data/historySequenceSamples");
const { StatutCandidat, Cfa } = require("../../../src/common/model");
const {
  getStatutsSamplesInscrits,
  getStatutsSamplesApprentis,
  getStatutsSamplesAbandons,
  expectedDetailResultList,
} = require("../../data/effectifDetailSamples");
const { asyncForEach } = require("../../../src/common/utils/asyncUtils");

httpTests(__filename, ({ startServer }) => {
  describe("/api/dashboard/etablissements-stats route", () => {
    it("Vérifie qu'on peut récupérer des statistiques d'établissements via API", async () => {
      const { httpClient } = await startServer();

      const response = await httpClient.get("/api/dashboard/etablissements-stats");

      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(response.data.nbEtablissements, 0);
    });
  });

  describe("/api/dashboard/effectifs route", () => {
    it("Vérifie qu'on peut récupérer des effectifs via API pour une séquence de statuts sans filtres", async () => {
      const { httpClient } = await startServer();

      // Add 10 statuts for filter with history sequence - full
      for (let index = 0; index < 10; index++) {
        const randomStatut = createRandomStatutCandidat({
          historique_statut_apprenant: historySequenceProspectToInscritToApprentiToAbandon,
          siret_etablissement_valid: true,
        });
        const toAdd = new StatutCandidat(randomStatut);
        await toAdd.save();
      }

      // Add 5 statuts for filter with history sequence - simple apprenti
      for (let index = 0; index < 5; index++) {
        const randomStatut = createRandomStatutCandidat({
          historique_statut_apprenant: historySequenceApprenti,
          siret_etablissement_valid: true,
        });
        const toAdd = new StatutCandidat(randomStatut);
        await toAdd.save();
      }

      // Add 15 statuts for filter  with history sequence - inscritToApprenti
      for (let index = 0; index < 15; index++) {
        const randomStatut = createRandomStatutCandidat({
          historique_statut_apprenant: historySequenceInscritToApprenti,
          siret_etablissement_valid: true,
        });
        const toAdd = new StatutCandidat(randomStatut);
        await toAdd.save();
      }

      // Expected results
      const expectedResults = {
        startDate: {
          nbInscrits: 10,
          nbApprentis: 5,
          nbAbandons: 0,
          nbAbandonsProspects: 0,
        },
        endDate: {
          nbInscrits: 15,
          nbApprentis: 5,
          nbAbandons: 10,
          nbAbandonsProspects: 0,
        },
      };

      // Check good api call
      const response = await httpClient.post("/api/dashboard/effectifs", {
        startDate: "2020-09-15T00:00:00.000Z",
        endDate: "2020-10-10T00:00:00.000Z",
      });

      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(response.data.length, 2);
      assert.deepStrictEqual(response.data[0].inscrits, expectedResults.startDate.nbInscrits);
      assert.deepStrictEqual(response.data[0].apprentis, expectedResults.startDate.nbApprentis);
      assert.deepStrictEqual(response.data[0].abandons, expectedResults.startDate.nbAbandons);
      assert.deepStrictEqual(response.data[0].abandons, expectedResults.startDate.nbAbandons);
      assert.deepStrictEqual(response.data[0].abandonsProspects, expectedResults.startDate.nbAbandonsProspects);
      assert.deepStrictEqual(response.data[1].inscrits, expectedResults.endDate.nbInscrits);
      assert.deepStrictEqual(response.data[1].apprentis, expectedResults.endDate.nbApprentis);
      assert.deepStrictEqual(response.data[1].abandons, expectedResults.endDate.nbAbandons);
      assert.deepStrictEqual(response.data[1].abandonsProspects, expectedResults.endDate.nbAbandonsProspects);
    });

    it("Vérifie qu'on peut récupérer des effectifs via API pour une séquence de statuts avec filtres", async () => {
      const { httpClient } = await startServer();
      const filterQuery = { etablissement_num_region: "84" };

      // Add 10 statuts for filter with history sequence - full
      for (let index = 0; index < 10; index++) {
        const randomStatut = createRandomStatutCandidat({
          ...{
            historique_statut_apprenant: historySequenceProspectToInscritToApprentiToAbandon,
            siret_etablissement_valid: true,
          },
          ...filterQuery,
        });
        const toAdd = new StatutCandidat(randomStatut);
        await toAdd.save();
      }

      // Add 5 statuts for filter with history sequence - simple apprenti
      for (let index = 0; index < 5; index++) {
        const randomStatut = createRandomStatutCandidat({
          ...{
            historique_statut_apprenant: historySequenceApprenti,
            siret_etablissement_valid: true,
          },
          ...filterQuery,
        });
        const toAdd = new StatutCandidat(randomStatut);
        await toAdd.save();
      }

      // Add 15 statuts for filter  with history sequence - inscritToApprenti
      for (let index = 0; index < 15; index++) {
        const randomStatut = createRandomStatutCandidat({
          ...{
            historique_statut_apprenant: historySequenceInscritToApprenti,
            siret_etablissement_valid: true,
          },
          ...filterQuery,
        });
        const toAdd = new StatutCandidat(randomStatut);
        await toAdd.save();
      }

      // Expected results
      const expectedResults = {
        startDate: {
          nbInscrits: 10,
          nbApprentis: 5,
          nbAbandons: 0,
          nbAbandonsProspects: 0,
        },
        endDate: {
          nbInscrits: 15,
          nbApprentis: 5,
          nbAbandons: 10,
          nbAbandonsProspects: 0,
        },
      };

      // Check good api call
      const response = await httpClient.post("/api/dashboard/effectifs", {
        startDate: "2020-09-15T00:00:00.000Z",
        endDate: "2020-10-10T00:00:00.000Z",
        ...filterQuery,
      });

      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(response.data.length, 2);
      assert.deepStrictEqual(response.data[0].inscrits, expectedResults.startDate.nbInscrits);
      assert.deepStrictEqual(response.data[0].apprentis, expectedResults.startDate.nbApprentis);
      assert.deepStrictEqual(response.data[0].abandons, expectedResults.startDate.nbAbandons);
      assert.deepStrictEqual(response.data[0].abandonsProspects, expectedResults.startDate.nbAbandonsProspects);
      assert.deepStrictEqual(response.data[1].inscrits, expectedResults.endDate.nbInscrits);
      assert.deepStrictEqual(response.data[1].apprentis, expectedResults.endDate.nbApprentis);
      assert.deepStrictEqual(response.data[1].abandons, expectedResults.endDate.nbAbandons);
      assert.deepStrictEqual(response.data[1].abandonsProspects, expectedResults.endDate.nbAbandonsProspects);

      // Check bad api call
      const badResponse = await httpClient.post("/api/dashboard/effectifs", {
        startDate: "2020-09-15T00:00:00.000Z",
        endDate: "2020-10-10T00:00:00.000Z",
        etablissement_num_region: "99",
      });

      assert.deepStrictEqual(badResponse.status, 200);
      assert.deepStrictEqual(badResponse.data.length, 2);
      assert.deepStrictEqual(badResponse.data[0].inscrits, 0);
      assert.deepStrictEqual(badResponse.data[0].apprentis, 0);
      assert.deepStrictEqual(badResponse.data[0].abandons, 0);
      assert.deepStrictEqual(badResponse.data[0].abandonsProspects, 0);
      assert.deepStrictEqual(badResponse.data[1].inscrits, 0);
      assert.deepStrictEqual(badResponse.data[1].apprentis, 0);
      assert.deepStrictEqual(badResponse.data[1].abandons, 0);
      assert.deepStrictEqual(badResponse.data[1].abandonsProspects, 0);
    });
  });

  describe("/api/dashboard/cfa-effectifs-detail route", () => {
    it("Vérifie qu'on peut récupérer le détail des effectifs d'un CFA via API", async () => {
      const { httpClient } = await startServer();
      const siretToTest = "77929544300013";

      // Build sample statuts
      const statutsSamplesInscrits = await getStatutsSamplesInscrits(siretToTest);
      const statutsSamplesApprentis = await getStatutsSamplesApprentis(siretToTest);
      const statutsSamplesAbandons = await getStatutsSamplesAbandons(siretToTest);

      // Save all statuts to database
      const sampleStatutsListToSave = [
        ...statutsSamplesInscrits,
        ...statutsSamplesApprentis,
        ...statutsSamplesAbandons,
      ];
      await asyncForEach(sampleStatutsListToSave, async (currentStatut) => {
        await currentStatut.save();
      });

      // Check good api call
      const response = await httpClient.post("/api/dashboard/cfa-effectifs-detail", {
        startDate: "2020-09-15T00:00:00.000Z",
        endDate: "2020-10-10T00:00:00.000Z",
        siret: siretToTest,
      });

      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(response.data.length, 2);
      assert.deepStrictEqual(response.data, expectedDetailResultList);

      // Check bad siret
      const badSiret = "99999999900999";
      const badResponse = await httpClient.post("/api/dashboard/cfa-effectifs-detail", {
        startDate: "2020-09-15T00:00:00.000Z",
        endDate: "2020-10-10T00:00:00.000Z",
        siret: badSiret,
      });
      assert.deepStrictEqual(badResponse.status, 400);
      assert.deepStrictEqual(badResponse.data.message, `No cfa found for siret ${badSiret}`);
    });
  });

  describe("/api/dashboard/region-conversion route", () => {
    it("Vérifie qu'on peut récupérer les informations de conversion d'une région via API", async () => {
      const { httpClient } = await startServer();

      const regionNumTest = "28";

      // Add 1 statut for region
      await new StatutCandidat(
        createRandomStatutCandidat({
          nom_etablissement: "TEST CFA",
          siret_etablissement: "77929544300013",
          siret_etablissement_valid: true,
          uai_etablissement: "0762232N",
          etablissement_num_region: regionNumTest,
        })
      ).save();

      // Add 5 cfa in referentiel region without validation
      for (let index = 0; index < 5; index++) {
        await new Cfa({
          nom: `ETABLISSEMENT ${faker.random.word()}`.toUpperCase(),
          region_num: regionNumTest,
          siret: getRandomSiretEtablissement(),
        }).save();
      }

      // Add 3 cfa with validation true in referentiel region
      for (let index = 0; index < 3; index++) {
        await new Cfa({
          nom: `ETABLISSEMENT ${faker.random.word()}`.toUpperCase(),
          region_num: regionNumTest,
          siret: getRandomSiretEtablissement(),
          feedback_donnee_valide: true,
        }).save();
      }

      // Check good api call
      const response = await httpClient.post("/api/dashboard/region-conversion", {
        num_region: regionNumTest,
      });

      assert.deepStrictEqual(response.status, 200);
      assert.ok(response.data.nbCfaIdentified);
      assert.ok(response.data.nbCfaConnected);
      assert.ok(response.data.nbCfaDataValidated);
      assert.deepStrictEqual(response.data.nbCfaIdentified, 8);
      assert.deepStrictEqual(response.data.nbCfaConnected, 1);
      assert.deepStrictEqual(response.data.nbCfaDataValidated, 3);

      // Check bad api call
      const badRegionResponse = await httpClient.post("/api/dashboard/region-conversion", {
        num_region: "999",
      });

      assert.deepStrictEqual(badRegionResponse.status, 200);
      assert.deepStrictEqual(badRegionResponse.data.nbCfaIdentified, 0);
      assert.deepStrictEqual(badRegionResponse.data.nbCfaConnected, 0);
      assert.deepStrictEqual(badRegionResponse.data.nbCfaDataValidated, 0);
    });
  });
});
