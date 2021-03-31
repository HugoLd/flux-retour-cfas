const assert = require("assert").strict;
const omit = require("lodash.omit");
const { nockGetCfdInfo } = require("../../../utils/nockApis/nock-tablesCorrespondances");
const integrationTests = require("../../../utils/integrationTests");
const { asyncForEach } = require("../../../../src/common/utils/asyncUtils");
const { dataForGetCfdInfo } = require("../../../data/apiTablesDeCorrespondances");
const formationsComponent = require("../../../../src/common/components/formations");
const { Formation: FormationModel } = require("../../../../src/common/model");
const { StatutCandidat: StatutCandidatModel } = require("../../../../src/common/model");
const { Formation } = require("../../../../src/common/domain/formation");
const { createRandomStatutCandidat } = require("../../../data/randomizedSample");

integrationTests(__filename, () => {
  describe("existsFormation", () => {
    const { existsFormation } = formationsComponent();

    it("returns false when formation with formations collection is empty", async () => {
      const shouldBeFalse = await existsFormation("blabla");
      assert.equal(shouldBeFalse, false);
    });

    it("returns false when formation with given cfd does not exist", async () => {
      // create a formation
      const newFormation = new FormationModel({ cfd: "0123456G" });
      await newFormation.save();

      const shouldBeFalse = await existsFormation("blabla");
      assert.equal(shouldBeFalse, false);
    });

    it("returns true when formation with given cfd exists", async () => {
      // create a formation
      const newFormation = new FormationModel({ cfd: "0123456G" });
      await newFormation.save();

      const shouldBeTrue = await existsFormation(newFormation.cfd);
      assert.equal(shouldBeTrue, true);
    });
  });

  describe("getFormationWithCfd", () => {
    const { getFormationWithCfd } = formationsComponent();

    it("returns null when formation does not exist", async () => {
      const found = await getFormationWithCfd("blabla");
      assert.equal(found, null);
    });

    it("returns formation with given cfd when it exists", async () => {
      // create a formation
      const cfd = "2502000D";
      const newFormation = new FormationModel({ cfd });
      const createdFormation = await newFormation.save();

      const found = await getFormationWithCfd(cfd);
      assert.deepEqual(createdFormation.toObject(), found);
    });
  });

  describe("createFormation", () => {
    const { createFormation } = formationsComponent();

    it("throws when given cfd is invalid", async () => {
      try {
        await createFormation("invalid");
      } catch (err) {
        assert.notEqual(err, undefined);
      }
    });

    it("throws when formation with given cfd already exists", async () => {
      const cfd = "2502000D";
      // create formation in db
      const formation = new FormationModel({ cfd });
      await formation.save();

      try {
        await createFormation(cfd);
      } catch (err) {
        assert.notEqual(err, undefined);
      }
    });

    it("returns created formation when cfd was found in Tables de Correspondaces with intitule_long", async () => {
      nockGetCfdInfo(dataForGetCfdInfo.withIntituleLong);

      const cfd = "13534005";
      const created = await createFormation(cfd);
      assert.deepEqual(omit(created, ["created_at", "_id", "tokenized_libelle"]), {
        cfd,
        libelle: "HYGIENISTE DU TRAVAIL ET DE L'ENVIRONNEMENT (CNAM)",
        niveau: "7 (Master, titre ingénieur...)",
        updated_at: null,
      });
    });

    it("returns created formation when cfd was found in Tables de Correspondaces without intitule_long", async () => {
      nockGetCfdInfo(dataForGetCfdInfo.withoutIntituleLong);

      const cfd = "13534005";
      const created = await createFormation(cfd);
      assert.deepEqual(omit(created, ["created_at", "_id", "tokenized_libelle"]), {
        cfd,
        libelle: "",
        niveau: "7 (Master, titre ingénieur...)",
        updated_at: null,
      });
    });
  });

  describe("searchFormationByIntituleOrCfd", () => {
    const { searchFormationByIntituleOrCfd } = formationsComponent();

    const formationsSeed = [
      { cfd: "01022103", libelle: "EMPLOYE TRAITEUR (CAP)" },
      { cfd: "01023288", libelle: "ZINGUERIE (MC NIVEAU V)" },
      { cfd: "01022999", libelle: "Peinture décoration extérieure (MC NIVEAU V)" },
      { cfd: "01022111", libelle: "PEINTURE DECORATION (MC NIVEAU IV)" },
      { cfd: "01022551", libelle: "PEINTURE dEcOrAtIoN (MC NIVEAU IV)" },
      { cfd: "01026651", libelle: "PEINTURE DECORÀTION (MC NIVEAU IV)" },
    ];

    beforeEach(async () => {
      await asyncForEach(formationsSeed, async (formationSeed) => {
        const formation = Formation.create(formationSeed);
        await new FormationModel(formation).save();
      });
    });

    const validCases = [
      {
        caseDescription: "when searchTerm matches cfd perfectly",
        searchTerm: formationsSeed[0].cfd,
        expectedResult: [formationsSeed[0]],
      },
      {
        caseDescription: "when searchTerm matches cfd partially",
        searchTerm: formationsSeed[0].cfd.slice(0, 6),
        expectedResult: [formationsSeed[0], formationsSeed[3]],
      },
      {
        caseDescription: "when searchTerm matches libelle perfectly",
        searchTerm: formationsSeed[0].libelle,
        expectedResult: [formationsSeed[0]],
      },
      {
        caseDescription: "when searchTerm matches libelle partially",
        searchTerm: formationsSeed[0].libelle.slice(0, 5),
        expectedResult: [formationsSeed[0]],
      },
      {
        caseDescription: "when searchTerm matches a word in libelle",
        searchTerm: "ZINGUERIE",
        expectedResult: [formationsSeed[1]],
      },
      {
        caseDescription: "when searchTerm matches a word partially in libelle",
        searchTerm: "ZINGU",
        expectedResult: [formationsSeed[1]],
      },
      {
        caseDescription: "when searchTerm matches a word with different case in libelle",
        searchTerm: "zingu",
        expectedResult: [formationsSeed[1]],
      },
      {
        caseDescription: "when searchTerm matches a word with different diacritics in libelle",
        searchTerm: "zingùéri",
        expectedResult: [formationsSeed[1]],
      },
    ];

    validCases.forEach(({ searchTerm, caseDescription, expectedResult }) => {
      it(`returns results ${caseDescription}`, async () => {
        const results = await searchFormationByIntituleOrCfd(searchTerm);

        const mapCfd = (result) => result.cfd;
        assert.deepEqual(results.map(mapCfd), expectedResult.map(mapCfd));
      });
    });

    it("sends a 200 HTTP response with results matching different cases and diacritics in libelle", async () => {
      const searchTerm = "decoratio";

      const results = await searchFormationByIntituleOrCfd(searchTerm);

      assert.equal(results.length, 4);
      assert.ok(results.find((formation) => formation.cfd === formationsSeed[2].cfd));
      assert.ok(results.find((formation) => formation.cfd === formationsSeed[3].cfd));
      assert.ok(results.find((formation) => formation.cfd === formationsSeed[4].cfd));
      assert.ok(results.find((formation) => formation.cfd === formationsSeed[5].cfd));
    });

    it("returns results matching libelle and etablissement_num_region", async () => {
      const searchTerm = "decoration";
      const etablissement_num_region = "28";

      await new StatutCandidatModel({
        ...createRandomStatutCandidat(),
        etablissement_num_region,
        id_formation: formationsSeed[2].cfd,
        id_formation_valid: true,
      }).save();

      const results = await searchFormationByIntituleOrCfd(searchTerm, { etablissement_num_region });

      assert.equal(results.length, 1);
      assert.ok(results[0].cfd, formationsSeed[2].cfd);
    });

    it("returns results matching libelle and etablissement_num_departement", async () => {
      const searchTerm = "decoration";
      const etablissement_num_departement = "77";

      await new StatutCandidatModel({
        ...createRandomStatutCandidat(),
        etablissement_num_departement,
        id_formation: formationsSeed[2].cfd,
        id_formation_valid: true,
      }).save();

      const results = await searchFormationByIntituleOrCfd(searchTerm, { etablissement_num_departement });

      assert.equal(results.length, 1);
      assert.ok(results[0].cfd, formationsSeed[2].cfd);
    });

    it("returns results matching libelle and siret_etablissement", async () => {
      const searchTerm = "decoration";
      const siret_etablissement = "80480480400022";

      await new StatutCandidatModel({
        ...createRandomStatutCandidat(),
        siret_etablissement,
        id_formation: formationsSeed[2].cfd,
        id_formation_valid: true,
      }).save();

      const results = await searchFormationByIntituleOrCfd(searchTerm, { siret_etablissement });

      assert.equal(results.length, 1);
      assert.ok(results[0].cfd, formationsSeed[2].cfd);
    });
  });
});
