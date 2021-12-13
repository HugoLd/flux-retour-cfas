const assert = require("assert").strict;
const config = require("../../../config");
const httpTests = require("../../utils/httpTests");

httpTests(__filename, ({ startServer }) => {
  it("Vérifie que le server fonctionne", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.get("/api/healthcheck");

    assert.equal(response.status, 200);
    assert.equal(response.data.name, `Serveur MNA - ${config.appName}`);
    assert.equal(response.data.healthcheck.mongodb, true);
    assert.ok(response.data.env);
    assert.ok(response.data.version);
  });
});
