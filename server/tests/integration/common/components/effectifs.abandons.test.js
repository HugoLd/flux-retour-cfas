const assert = require("assert").strict;
const { createRandomDossierApprenant } = require("../../../data/randomizedSample");
const {
  historySequenceInscritToApprentiToAbandon,
  historySequenceApprenti,
  historySequenceInscritToApprenti,
} = require("../../../data/historySequenceSamples");
const { DossierApprenantModel } = require("../../../../src/common/model");
const { EffectifsAbandons } = require("../../../../src/common/components/effectifs/abandons");

describe(__filename, () => {
  const seedDossiersApprenants = async (statutsProps) => {
    const abandonsStatuts = [];

    // Add 10 statuts with history sequence - full
    for (let index = 0; index < 10; index++) {
      const randomStatut = createRandomDossierApprenant({
        historique_statut_apprenant: historySequenceInscritToApprentiToAbandon,
        ...statutsProps,
      });
      const toAdd = new DossierApprenantModel(randomStatut);
      abandonsStatuts.push(toAdd);
      await toAdd.save();
    }

    // Add 5 statuts with history sequence - simple apprenti
    for (let index = 0; index < 5; index++) {
      const randomStatut = createRandomDossierApprenant({
        historique_statut_apprenant: historySequenceApprenti,
        ...statutsProps,
      });
      const toAdd = new DossierApprenantModel(randomStatut);
      await toAdd.save();
    }

    // Add 15 statuts with history sequence - inscritToApprenti
    for (let index = 0; index < 15; index++) {
      const randomStatut = createRandomDossierApprenant({
        historique_statut_apprenant: historySequenceInscritToApprenti,
        ...statutsProps,
      });
      const toAdd = new DossierApprenantModel(randomStatut);
      await toAdd.save();
    }

    return abandonsStatuts;
  };

  const abandons = new EffectifsAbandons();

  describe("Abandons - getCountAtDate", () => {
    it("gets count of abandons at one date", async () => {
      await seedDossiersApprenants();

      const date = new Date("2020-09-15T00:00:00.000+0000");
      const abandonsCount = await abandons.getCountAtDate(date);

      assert.equal(abandonsCount, 0);
    });

    it("gets count of abandons at yet another date", async () => {
      await seedDossiersApprenants();

      const date = new Date("2020-10-10T00:00:00.000+0000");
      const abandonsCount = await abandons.getCountAtDate(date);

      assert.equal(abandonsCount, 10);
    });

    it("gets count of abandons at a date when there was no data", async () => {
      await seedDossiersApprenants();

      const date = new Date("2010-10-10T00:00:00.000+0000");
      const abandonsCount = await abandons.getCountAtDate(date);

      assert.equal(abandonsCount, 0);
    });

    it("gets count of abandons at a date and for a region", async () => {
      const filters = { etablissement_num_region: "28" };
      await seedDossiersApprenants(filters);

      const date = new Date("2020-10-10T00:00:00.000+0000");
      const abandonsCountForRegion = await abandons.getCountAtDate(date, filters);

      assert.equal(abandonsCountForRegion, 10);

      const abandonsCountForAnotherRegion = await abandons.getCountAtDate(date, { etablissement_num_region: "100" });
      assert.equal(abandonsCountForAnotherRegion, 0);
    });

    it("gets count of abandons at a date and for annee scolaire on same year and annee scolaire on two years", async () => {
      const filters = { uai_etablissement: "0670141P" };

      // Add 5 statuts abandon for annee_scolaire on same year
      for (let index = 0; index < 5; index++) {
        await new DossierApprenantModel(
          createRandomDossierApprenant({
            historique_statut_apprenant: historySequenceInscritToApprentiToAbandon,
            annee_scolaire: "2020-2020",
            ...filters,
          })
        ).save();
      }

      // Add 12 statuts to abandon  for annee_scolaire on two years
      for (let index = 0; index < 12; index++) {
        await new DossierApprenantModel(
          createRandomDossierApprenant({
            historique_statut_apprenant: historySequenceInscritToApprentiToAbandon,
            annee_scolaire: "2021-2021",
            ...filters,
          })
        ).save();
      }

      const date = new Date("2020-10-10T00:00:00.000+0000");
      const abandonsCountForAnneesScolaireList = await abandons.getCountAtDate(date, filters);

      assert.equal(abandonsCountForAnneesScolaireList, 17);
    });
  });

  describe("Abandons - getListAtDate", () => {
    it("gets list of abandons at date with data", async () => {
      const abandonsStatuts = await seedDossiersApprenants();

      const date = new Date("2020-10-10T00:00:00.000+0000");
      const abandonsList = await abandons.getListAtDate(date);

      assert.equal(abandonsList.length, abandonsStatuts.length);
    });

    it("gets list of abandons at date with data - checks projection fields", async () => {
      const abandonsStatuts = await seedDossiersApprenants();

      const date = new Date("2020-10-10T00:00:00.000+0000");
      const projection = {
        uai_etablissement: 1,
        nom_etablissement: 1,
        formation_cfd: 1,
        annee_scolaire: 1,
      };
      const abandonsList = await abandons.getListAtDate(date, {}, { projection });

      assert.equal(abandonsList.length, abandonsStatuts.length);

      for (let index = 0; index < abandonsStatuts.length; index++) {
        assert.equal(abandonsList[index].uai_etablissement !== undefined, true);
        assert.equal(abandonsList[index].nom_etablissement !== undefined, true);
        assert.equal(abandonsList[index].formation_cfd !== undefined, true);
        assert.equal(abandonsList[index].annee_scolaire !== undefined, true);
      }
    });

    it("gets list of abandons at a date when there was no data", async () => {
      await seedDossiersApprenants();

      const date = new Date("2010-10-10T00:00:00.000+0000");
      const abandonsList = await abandons.getListAtDate(date);

      assert.equal(abandonsList.length, 0);
    });

    it("gets list of abandons at a date and for a region", async () => {
      const filters = { etablissement_num_region: "28" };
      const abandonsStatuts = await seedDossiersApprenants(filters);

      const date = new Date("2020-10-10T00:00:00.000+0000");
      const abandonsList = await abandons.getListAtDate(date, filters);

      assert.equal(abandonsList.length, abandonsStatuts.length);

      const abandonsListForOtherRegion = await abandons.getListAtDate(date, { etablissement_num_region: "100" });
      assert.equal(abandonsListForOtherRegion.length, 0);
    });
  });
});
