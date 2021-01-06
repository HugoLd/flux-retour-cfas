const assert = require("assert");
const { flattenHistoriqueStatutApprenant } = require("../../../../src/common/utils/flattenHistoriqueStatutApprenant");

describe("flattenHistoriqueStatutApprenant", () => {
  it("Vérifie qu'un historique est renvoyé vide", async () => {
    const input = [];
    const expectedOutput = [];
    assert.deepStrictEqual(flattenHistoriqueStatutApprenant(input), expectedOutput);
  });
  it("Vérifie qu'un historique de valeur undefined renvoie []", async () => {
    const input = undefined;
    const expectedOutput = [];
    assert.deepStrictEqual(flattenHistoriqueStatutApprenant(input), expectedOutput);
  });
  it("Vérifie qu'un historique avec un seul élément n'est pas modifié", async () => {
    const input = [
      {
        valeur_statut: 3,
        position_statut: 1,
        date_statut: "2020-11-01T06:37:01.881Z",
      },
    ];
    assert.deepStrictEqual(flattenHistoriqueStatutApprenant(input), input);
  });
  it("Vérifie qu'un historique avec une séquence de statuts identiques conserve uniquement le premier élément", async () => {
    const input = [
      {
        valeur_statut: 3,
        position_statut: 1,
        date_statut: "2020-11-01T06:37:01.881Z",
      },
      {
        valeur_statut: 3,
        position_statut: 2,
        date_statut: "2020-11-02T06:42:26.907Z",
      },
      {
        valeur_statut: 3,
        position_statut: 3,
        date_statut: "2020-11-03T06:42:00.547Z",
      },
    ];
    const expectedOutput = [input[0]];
    assert.deepStrictEqual(flattenHistoriqueStatutApprenant(input), expectedOutput);
  });
  it("Vérifie qu'un historique avec plusieurs séquences de statuts identiques conserve uniquement le premier élément de chaque séquence", async () => {
    const input = [
      {
        valeur_statut: 1,
        position_statut: 1,
        date_statut: "2020-10-01T06:37:01.881Z",
      },
      {
        valeur_statut: 1,
        position_statut: 2,
        date_statut: "2020-10-02T06:37:01.881Z",
      },
      {
        valeur_statut: 1,
        position_statut: 3,
        date_statut: "2020-10-03T06:37:01.881Z",
      },
      {
        valeur_statut: 3,
        position_statut: 4,
        date_statut: "2020-11-01T06:37:01.881Z",
      },
      {
        valeur_statut: 3,
        position_statut: 5,
        date_statut: "2020-11-02T06:42:26.907Z",
      },
      {
        valeur_statut: 1,
        position_statut: 6,
        date_statut: "2020-12-09T08:30:22.199Z",
      },
      {
        valeur_statut: 3,
        position_statut: 7,
        date_statut: "2020-12-10T07:57:21.574Z",
      },
      {
        valeur_statut: 3,
        position_statut: 8,
        date_statut: "2020-12-11T08:21:08.315Z",
      },
      {
        valeur_statut: 0,
        position_statut: 9,
        date_statut: "2020-12-12T07:48:32.326Z",
      },
      {
        valeur_statut: 0,
        position_statut: 10,
        date_statut: "2020-12-13T07:48:32.326Z",
      },
      {
        valeur_statut: 0,
        position_statut: 11,
        date_statut: "2020-12-14T07:48:32.326Z",
      },
    ];
    const expectedOutput = [input[0], input[3], input[5], input[6], input[8]];
    assert.deepStrictEqual(flattenHistoriqueStatutApprenant(input), expectedOutput);
  });
});
