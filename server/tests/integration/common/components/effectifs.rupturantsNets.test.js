const assert = require("assert").strict;
const {
  createRandomDossierApprenant,
  createRandomDossierApprenantAbandon,
  createRandomDossierApprenantApprenti,
  createRandomDossierApprenantInscritSansContrat,
  createRandomDossierApprenantRupturant,
} = require("../../../data/randomizedSample");

const { DossierApprenantModel } = require("../../../../src/common/model");
const { EffectifsRupturantsNets } = require("../../../../src/common/components/effectifs/rupturants-nets");

describe(__filename, () => {
  beforeEach(async () => {
    const statuts = [
      // following statuts are potential rupturants nets (depends on date)
      createRandomDossierApprenant({
        etablissement_num_region: "199",
        historique_statut_apprenant: [
          { valeur_statut: 3, date_statut: new Date("2020-09-13T00:00:00") },
          { valeur_statut: 2, date_statut: new Date("2020-10-01T00:00:00") },
          { valeur_statut: 0, date_statut: new Date("2020-11-01T00:00:00") },
        ],
      }),
      createRandomDossierApprenant({
        historique_statut_apprenant: [
          { valeur_statut: 3, date_statut: new Date("2020-07-29T00:00:00") },
          { valeur_statut: 2, date_statut: new Date("2020-09-20T00:00:00") },
          { valeur_statut: 0, date_statut: new Date("2020-12-07T00:00:00") },
        ],
      }),
      // following statuts cannot be rupturants nets
      createRandomDossierApprenantAbandon(),
      createRandomDossierApprenantApprenti(),
      createRandomDossierApprenantInscritSansContrat(),
      createRandomDossierApprenantRupturant(),
      createRandomDossierApprenant({
        historique_statut_apprenant: [
          { valeur_statut: 2, date_statut: new Date("2020-04-24T00:00:00") },
          { valeur_statut: 3, date_statut: new Date("2020-04-30T00:00:00") },
        ],
      }),
      createRandomDossierApprenant({
        historique_statut_apprenant: [],
      }),
    ];
    for (let index = 0; index < statuts.length; index++) {
      const toAdd = new DossierApprenantModel(statuts[index]);
      await toAdd.save();
    }
  });

  const rupturantsNets = new EffectifsRupturantsNets();

  describe("Rupturants nets - getCountAtDate", () => {
    it("gets count of rupturants at date", async () => {
      const date = new Date("2020-11-12T00:00:00");
      const count = await rupturantsNets.getCountAtDate(date);
      assert.equal(count, 1);
    });

    it("gets count of rupturants nets now", async () => {
      const date = new Date();
      const count = await rupturantsNets.getCountAtDate(date);
      assert.equal(count, 2);
    });

    it("gets count of rupturants nets now with additional filter", async () => {
      const date = new Date();
      const count = await rupturantsNets.getCountAtDate(date, { etablissement_num_region: "199" });
      assert.equal(count, 1);
    });
  });

  describe("Rupturants nets - getListAtDate", () => {
    it("gets list of rupturants nets at date", async () => {
      const date = new Date("2020-11-12T00:00:00");
      const list = await rupturantsNets.getListAtDate(date);
      assert.equal(list.length, 1);
    });

    it("gets list of rupturants nets now - check projection fields", async () => {
      const date = new Date();
      const projection = {
        uai_etablissement: 1,
        nom_etablissement: 1,
        formation_cfd: 1,
        annee_scolaire: 1,
      };
      const list = await rupturantsNets.getListAtDate(date, {}, { projection });
      assert.equal(list.length, 2);
      for (let index = 0; index < list.length; index++) {
        assert.equal(list[index].uai_etablissement !== undefined, true);
        assert.equal(list[index].nom_etablissement !== undefined, true);
        assert.equal(list[index].formation_cfd !== undefined, true);
        assert.equal(list[index].annee_scolaire !== undefined, true);
      }
    });

    it("gets list of rupturants nets now with additional filter", async () => {
      const date = new Date();
      const list = await rupturantsNets.getListAtDate(date, { etablissement_num_region: "199" });
      assert.equal(list.length, 1);
    });
  });
});
