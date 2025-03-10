const assert = require("assert").strict;
const validators = require("../../../../src/http/utils/validators");

describe("Validators", () => {
  describe("password", () => {
    const validPasswords = [
      "Abc12e,'",
      "ABCabc123$^éçéàô>!ç",
      "KZ$OR4t$[<PFbhO.",
      "rEIFG~XRMkHj^g2t",
      'u")5wUo.5LFhVi^e',
      "/d)w-jzul5DAbSK'",
      "mr78>Axl,E)f=P$.",
      "}UMN2G[xheh|H}0p",
      "I1;!VjRxJ[QV3s4",
    ];
    validPasswords.forEach((validPassword) => {
      it(`Vérifie que ${validPassword} est un mot de passe valide`, () => {
        const { error, value } = validators.password().validate(validPassword);
        assert.equal(error, undefined);
        assert.equal(value, validPassword);
      });
    });

    const invalidPasswords = [
      "AAAABBBcccc123",
      "AAAABBBcccc????",
      "AAAABBB5555?.?.?.?.?.",
      "acacacacac5555?.?.?.?.?.",
      "aA3?;$",
      "",
      null,
      123,
    ];
    invalidPasswords.forEach((invalidPassword) => {
      it(`Vérifie que ${invalidPassword} est un mot de passe invalide`, () => {
        const { error, value } = validators.password().validate(invalidPassword);
        assert.notEqual(error, undefined);
        assert.notEqual(value, undefined);
      });
    });
  });
});
