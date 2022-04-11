const assert = require("assert").strict;
const {
  createRandomDossierApprenantAbandon,
  createRandomDossierApprenantApprenti,
  createRandomDossierApprenantInscritSansContrat,
} = require("../../../data/randomizedSample");
const { RESEAUX_CFAS } = require("../../../../src/common/constants/networksConstants");
const { DossierApprenantModel } = require("../../../../src/common/model");
const { EffectifsApprentis } = require("../../../../src/common/components/effectifs/apprentis");

describe(__filename, () => {
  const seedDossiersApprenants = async (statutsProps) => {
    for (let index = 0; index < 10; index++) {
      const randomStatut = createRandomDossierApprenantAbandon(statutsProps);
      const toAdd = new DossierApprenantModel(randomStatut);
      await toAdd.save();
    }

    for (let index = 0; index < 15; index++) {
      const randomStatut = createRandomDossierApprenantApprenti(statutsProps);
      const toAdd = new DossierApprenantModel(randomStatut);
      await toAdd.save();
    }

    for (let index = 0; index < 15; index++) {
      const randomStatut = createRandomDossierApprenantInscritSansContrat(statutsProps);
      const toAdd = new DossierApprenantModel(randomStatut);
      await toAdd.save();
    }
  };

  const apprentis = new EffectifsApprentis();

  describe("Apprentis - getCountAtDate", () => {
    it("gets count of apprentis at one date", async () => {
      await seedDossiersApprenants();

      const date = new Date();
      const apprentisCount = await apprentis.getCountAtDate(date);

      assert.equal(apprentisCount, 15);
    });

    it("gets count of apprentis at a date when there was no data", async () => {
      await seedDossiersApprenants();

      const date = new Date("2010-10-10T00:00:00.000+0000");
      const apprentisCount = await apprentis.getCountAtDate(date);

      assert.equal(apprentisCount, 0);
    });

    it("gets count of apprentis at a date and for a region", async () => {
      const filters = { etablissement_num_region: "28" };
      await seedDossiersApprenants(filters);

      const date = new Date();
      const apprentisCountForRegion = await apprentis.getCountAtDate(date, filters);

      assert.equal(apprentisCountForRegion, 15);

      const apprentisCountForAnotherRegion = await apprentis.getCountAtDate(date, {
        etablissement_num_region: "100",
      });
      assert.equal(apprentisCountForAnotherRegion, 0);
    });

    it("gets count of apprentis at a date and for a departement", async () => {
      const filters = { etablissement_num_departement: "75" };
      await seedDossiersApprenants(filters);

      const date = new Date();
      const apprentisCountForDepartement = await apprentis.getCountAtDate(date, filters);

      assert.equal(apprentisCountForDepartement, 15);

      const apprentisCountForAnotherDepartement = await apprentis.getCountAtDate(date, {
        etablissement_num_departement: "100",
      });
      assert.equal(apprentisCountForAnotherDepartement, 0);
    });

    it("gets count of apprentis at a date and for a siret_etablissement", async () => {
      const filters = { siret_etablissement: "77929544300013" };
      await seedDossiersApprenants(filters);

      const date = new Date();
      const apprentisCountForSiret = await apprentis.getCountAtDate(date, filters);

      assert.equal(apprentisCountForSiret, 15);

      const apprentisCountForAnotherSiret = await apprentis.getCountAtDate(date, {
        siret_etablissement: "77929544300099",
      });
      assert.equal(apprentisCountForAnotherSiret, 0);
    });

    it("gets count of apprentis at a date and for a formation_cfd", async () => {
      const filters = { formation_cfd: "2502000D" };
      await seedDossiersApprenants(filters);

      const date = new Date();
      const apprentisCountForCfd = await apprentis.getCountAtDate(date, filters);

      assert.equal(apprentisCountForCfd, 15);

      const apprentisCountForAnotherCfd = await apprentis.getCountAtDate(date, { formation_cfd: "2502000X" });
      assert.equal(apprentisCountForAnotherCfd, 0);
    });

    it("gets count of apprentis at a date and for a reseau", async () => {
      const filters = { etablissement_reseaux: RESEAUX_CFAS.BTP_CFA.nomReseau };
      await seedDossiersApprenants(filters);

      const date = new Date();
      const apprentisCountForReseau = await apprentis.getCountAtDate(date, filters);

      assert.equal(apprentisCountForReseau, 15);

      const apprentisCountForAnotherReseau = await apprentis.getCountAtDate(date, {
        etablissement_reseaux: "inconnu",
      });
      assert.equal(apprentisCountForAnotherReseau, 0);
    });
  });

  describe("Apprentis - getListAtDate", () => {
    it("gets list of apprentis at a date", async () => {
      await seedDossiersApprenants();

      const date = new Date();
      const apprentisList = await apprentis.getListAtDate(date);

      assert.equal(apprentisList.length, 15);
    });

    it("gets list of apprentis at a date - check projection fields", async () => {
      await seedDossiersApprenants();

      const date = new Date();
      const projection = {
        uai_etablissement: 1,
        nom_etablissement: 1,
        formation_cfd: 1,
        annee_scolaire: 1,
      };
      const apprentisList = await apprentis.getListAtDate(date, {}, { projection });

      assert.equal(apprentisList.length, 15);
      for (let index = 0; index < apprentisList.length; index++) {
        assert.equal(apprentisList[index].uai_etablissement !== undefined, true);
        assert.equal(apprentisList[index].nom_etablissement !== undefined, true);
        assert.equal(apprentisList[index].formation_cfd !== undefined, true);
        assert.equal(apprentisList[index].annee_scolaire !== undefined, true);
      }
    });

    it("gets list of apprentis at a date when there was no data", async () => {
      await seedDossiersApprenants();

      const date = new Date("2010-10-10T00:00:00.000+0000");
      const apprentisList = await apprentis.getListAtDate(date);

      assert.equal(apprentisList.length, 0);
    });

    it("gets list of apprentis at a date and for a region", async () => {
      const filters = { etablissement_num_region: "28" };
      await seedDossiersApprenants(filters);

      const date = new Date();
      const apprentisListForRegion = await apprentis.getListAtDate(date, filters);

      assert.equal(apprentisListForRegion.length, 15);

      const apprentisLengthForAnotherRegion = await apprentis.getListAtDate(date, {
        etablissement_num_region: "100",
      });
      assert.equal(apprentisLengthForAnotherRegion.length, 0);
    });

    it("gets list of apprentis at a date and for a departement", async () => {
      const filters = { etablissement_num_departement: "75" };
      await seedDossiersApprenants(filters);

      const date = new Date();
      const apprentisListForDepartement = await apprentis.getListAtDate(date, filters);

      assert.equal(apprentisListForDepartement.length, 15);

      const apprentisListForAnotherDepartement = await apprentis.getListAtDate(date, {
        etablissement_num_departement: "100",
      });
      assert.equal(apprentisListForAnotherDepartement.length, 0);
    });

    it("gets list of apprentis at a date and for a siret_etablissement", async () => {
      const filters = { siret_etablissement: "77929544300013" };
      await seedDossiersApprenants(filters);

      const date = new Date();
      const apprentisLengthForSiret = await apprentis.getListAtDate(date, filters);

      assert.equal(apprentisLengthForSiret.length, 15);

      const apprentisLengthForAnotherSiret = await apprentis.getListAtDate(date, {
        siret_etablissement: "77929544300099",
      });
      assert.equal(apprentisLengthForAnotherSiret.length, 0);
    });

    it("gets list of apprentis at a date and for a formation_cfd", async () => {
      const filters = { formation_cfd: "2502000D" };
      await seedDossiersApprenants(filters);

      const date = new Date();
      const apprentisListForCfd = await apprentis.getListAtDate(date, filters);

      assert.equal(apprentisListForCfd.length, 15);

      const apprentisListForAnotherCfd = await apprentis.getListAtDate(date, { formation_cfd: "2502000X" });
      assert.equal(apprentisListForAnotherCfd.length, 0);
    });

    it("gets list of apprentis at a date and for a reseau", async () => {
      const filters = { etablissement_reseaux: RESEAUX_CFAS.BTP_CFA.nomReseau };
      await seedDossiersApprenants(filters);

      const date = new Date();
      const apprentisListForReseau = await apprentis.getListAtDate(date, filters);

      assert.equal(apprentisListForReseau.length, 15);

      const apprentisListForAnotherReseau = await apprentis.getListAtDate(date, {
        etablissement_reseaux: "inconnu",
      });
      assert.equal(apprentisListForAnotherReseau.length, 0);
    });
  });
});
