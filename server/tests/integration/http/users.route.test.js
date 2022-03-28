const assert = require("assert").strict;
// eslint-disable-next-line node/no-unpublished-require
const MockDate = require("mockdate");
const { startServer } = require("../../utils/testUtils");
const { apiRoles, tdbRoles } = require("../../../src/common/roles");

describe(__filename, () => {
  afterEach(() => {
    MockDate.reset();
  });

  describe("GET /users", () => {
    it("sends a 401 HTTP response when user is not authenticated", async () => {
      const { httpClient } = await startServer();
      const response = await httpClient.get("/api/users", {});

      assert.equal(response.status, 401);
    });

    it("sends a 403 HTTP response when user is not admin", async () => {
      const { httpClient, createAndLogUser } = await startServer();
      const bearerToken = await createAndLogUser("user", "password", { permissions: [apiRoles.apiStatutsSeeder] });

      const response = await httpClient.get("/api/users", { headers: bearerToken });

      assert.equal(response.status, 403);
    });

    it("sends a 200 HTTP response with list of users", async () => {
      const { httpClient, components, createAndLogUser } = await startServer();
      const bearerToken = await createAndLogUser("user", "password", { permissions: [apiRoles.administrator] });

      await components.users.createUser({
        email: "test1@mail.com",
        username: "test1",
        permissions: [apiRoles.administrator],
      });
      await components.users.createUser({
        email: "test2@mail.com",
        username: "test2",
        permissions: [apiRoles.apiStatutsSeeder],
      });
      const response = await httpClient.get("/api/users", { headers: bearerToken });

      assert.equal(response.status, 200);
      assert.equal(response.data.length, 3);
      assert.equal(response.data[0].password, undefined);
      assert.equal(response.data[1].password, undefined);
      assert.equal(response.data[2].password, undefined);
    });
  });

  describe("POST /users", () => {
    it("sends a 401 HTTP response when user is not authenticated", async () => {
      const { httpClient } = await startServer();
      const response = await httpClient.post("/api/users", {});

      assert.equal(response.status, 401);
    });

    it("sends a 403 HTTP response when user is not admin", async () => {
      const { httpClient, createAndLogUser } = await startServer();
      const bearerToken = await createAndLogUser("user", "password", { permissions: [apiRoles.apiStatutsSeeder] });

      const response = await httpClient.post("/api/users", {}, { headers: bearerToken });

      assert.equal(response.status, 403);
    });

    it("sends a 200 HTTP response with created pilot user", async () => {
      const { httpClient, createAndLogUser } = await startServer();
      const bearerToken = await createAndLogUser("user", "password", { permissions: [apiRoles.administrator] });
      const fakeNowDate = new Date();
      MockDate.set(fakeNowDate);

      const response = await httpClient.post(
        "/api/users",
        { email: "test@mail.com", username: "test", role: tdbRoles.pilot },
        { headers: bearerToken }
      );

      assert.equal(response.status, 200);
      assert.deepEqual(response.data, {
        email: "test@mail.com",
        username: "test",
        permissions: [tdbRoles.pilot],
        network: null,
        created_at: fakeNowDate.toISOString(),
      });
    });

    it("sends a 200 HTTP response with created network user", async () => {
      const { httpClient, createAndLogUser } = await startServer();
      const bearerToken = await createAndLogUser("user", "password", { permissions: [apiRoles.administrator] });
      const fakeNowDate = new Date();
      MockDate.set(fakeNowDate);

      const response = await httpClient.post(
        "/api/users",
        { email: "test@mail.com", username: "test", role: tdbRoles.network, network: "CMA" },
        { headers: bearerToken }
      );

      assert.equal(response.status, 200);
      assert.deepEqual(response.data, {
        email: "test@mail.com",
        username: "test",
        permissions: [tdbRoles.network],
        network: "CMA",
        created_at: fakeNowDate.toISOString(),
      });
    });
  });
});
