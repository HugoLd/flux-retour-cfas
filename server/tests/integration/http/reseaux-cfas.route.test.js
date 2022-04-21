const assert = require("assert").strict;
// eslint-disable-next-line node/no-unpublished-require
const { startServer } = require("../../utils/testUtils");
const { apiRoles } = require("../../../src/common/roles");
const users = require("../../../src/common/components/users");

const user = { name: "apiConsumerUser", password: "password" };

const createApiUser = async () => {
  const { createUser } = await users();

  return await createUser({
    username: user.name,
    password: user.password,
    permissions: [apiRoles.administrator],
  });
};

const getJwtForUser = async (httpClient) => {
  const { data } = await httpClient.post("/api/login", {
    username: user.name,
    password: user.password,
  });
  return data.access_token;
};

describe(__filename, () => {
  describe("GET /reseaux-cfas", () => {
    it("sends a 200 HTTP response with list of reseaux cfas", async () => {
      const { httpClient, components } = await startServer();
      await createApiUser();
      const accessToken = await getJwtForUser(httpClient);

      await components.reseauxCfas.create({
        nom_reseau: "test1",
        nom_etablissement: "test1",
        uai: "test1",
      });
      await components.reseauxCfas.create({
        nom_reseau: "test2",
        nom_etablissement: "test2",
        uai: "test2",
      });
      const response = await httpClient.get("/api/reseaux-cfas", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      assert.equal(response.status, 200);
      assert.equal(response.data[0].nom_reseau, "test1");
      assert.equal(response.data[0].nom_etablissement, "test1");
      assert.equal(response.data[0].uai, "test1");
      assert.equal(response.data[1].nom_reseau, "test2");
      assert.equal(response.data[1].nom_etablissement, "test2");
      assert.equal(response.data[1].uai, "test2");
    });
  });
});
