const assert = require("assert").strict;
const { validateStatutApprenant } = require("../../../../src/common/domain/statutApprenant");

describe("Domain statut apprenant", () => {
  describe("validateStatutApprenant", () => {
    it("Vérifie qu'un statut apprenant de valeur null est invalide", async () => {
      const input = null;
      const expectedOutput = false;
      assert.equal(validateStatutApprenant(input), expectedOutput);
    });

    it("Vérifie qu'un statut apprenant de valeur 0 est valide", async () => {
      const input = 0;
      const expectedOutput = true;
      assert.equal(validateStatutApprenant(input), expectedOutput);
    });

    it("Vérifie qu'un statut apprenant de valeur 1 est invalide", async () => {
      const input = 1;
      const expectedOutput = false;
      assert.equal(validateStatutApprenant(input), expectedOutput);
    });

    it("Vérifie qu'un statut apprenant de valeur 2 est invalide", async () => {
      const input = 2;
      const expectedOutput = true;
      assert.equal(validateStatutApprenant(input), expectedOutput);
    });

    it("Vérifie qu'un statut apprenant de valeur 3 est invalide", async () => {
      const input = 3;
      const expectedOutput = true;
      assert.equal(validateStatutApprenant(input), expectedOutput);
    });

    it("Vérifie qu'un statut apprenant de valeur 99 est invalide", async () => {
      const input = 99;
      const expectedOutput = false;
      assert.equal(validateStatutApprenant(input), expectedOutput);
    });

    it("Vérifie qu'un statut apprenant de valeur string '0' est invalide", async () => {
      const input = "0";
      const expectedOutput = false;
      assert.equal(validateStatutApprenant(input), expectedOutput);
    });

    it("Vérifie qu'un statut apprenant de valeur string '3' est invalide", async () => {
      const input = "3";
      const expectedOutput = false;
      assert.equal(validateStatutApprenant(input), expectedOutput);
    });
  });
});
