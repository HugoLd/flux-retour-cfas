const assert = require("assert").strict;
const httpTests = require("../../utils/httpTests");
const { DemandeBranchementErpModel } = require("../../../src/common/model");

httpTests(__filename, ({ startServer }) => {
  let httpClient;

  beforeEach(async () => {
    const { httpClient: _httpClient } = await startServer();
    httpClient = _httpClient;
  });

  describe("POST /demande-lien-acces", () => {
    it("sends a 400 HTTP response when no body provided", async () => {
      const response = await httpClient.post("/api/demande-branchement-erp", {});

      assert.equal(response.status, 400);
      const found = await DemandeBranchementErpModel.countDocuments();
      assert.equal(found, 0);
    });

    it("sends a 400 HTTP response when erp missing", async () => {
      const testDemande = {
        nom_organisme: "TEST-ORGA",
        uai_organisme: "0762232N",
        code_postal_organisme: "75010",
        email_demandeur: "test@email.fr",
      };

      const response = await httpClient.post("/api/demande-branchement-erp", testDemande);

      assert.equal(response.status, 400);
      const found = await DemandeBranchementErpModel.countDocuments();
      assert.equal(found, 0);
    });

    it("sends a 400 HTTP response when bad format for uai sent", async () => {
      const testDemande = {
        erp: "TEST-ERP",
        nom_organisme: "TEST-ORGA",
        uai_organisme: "ABC",
        code_postal_organisme: "75010",
        email_demandeur: "test@email.fr",
      };

      const response = await httpClient.post("/api/demande-branchement-erp", testDemande);

      assert.equal(response.status, 400);
      const found = await DemandeBranchementErpModel.countDocuments();
      assert.equal(found, 0);
    });

    it("sends a 200 HTTP response and good data for ongoing erp connexion demand was created", async () => {
      const testDemande = {
        erp: "TEST-ERP",
        nom_organisme: "TEST-ORGA",
        uai_organisme: "0762232N",
        email_demandeur: "test@email.fr",
      };

      const response = await httpClient.post("/api/demande-branchement-erp", testDemande);

      assert.equal(response.status, 200);
      const found = await DemandeBranchementErpModel.find().lean();
      assert.equal(found.length, 1);
      assert.equal(found[0].nom_organisme, testDemande.nom_organisme);
      assert.equal(found[0].uai_organisme, testDemande.uai_organisme);
      assert.equal(found[0].email_demandeur, testDemande.email_demandeur);
    });

    it("sends a 200 HTTP response and good data for new erp connexion demand was created", async () => {
      const testDemande = {
        erp: "TEST-ERP",
        nom_organisme: "TEST-ORGA",
        uai_organisme: "0762232N",
        email_demandeur: "test@email.fr",
        nb_apprentis: "100",
      };

      const response = await httpClient.post("/api/demande-branchement-erp", testDemande);

      assert.equal(response.status, 200);
      const found = await DemandeBranchementErpModel.find().lean();
      assert.equal(found.length, 1);
      assert.equal(found[0].nom_organisme, testDemande.nom_organisme);
      assert.equal(found[0].uai_organisme, testDemande.uai_organisme);
      assert.equal(found[0].email_demandeur, testDemande.email_demandeur);
      assert.equal(found[0].nb_apprentis, testDemande.nb_apprentis);
    });
  });
});
