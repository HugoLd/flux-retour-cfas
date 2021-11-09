const express = require("express");
const bodyParser = require("body-parser");

const { apiRoles } = require("../common/roles");

const logMiddleware = require("./middlewares/logMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const corsMiddleware = require("./middlewares/corsMiddleware");
const requireJwtAuthenticationMiddleware = require("./middlewares/requireJwtAuthentication");
const permissionsMiddleware = require("./middlewares/permissionsMiddleware");

const statutCandidatsRoute = require("./routes/statut-candidats");
const loginRoute = require("./routes/login");
const statsRoute = require("./routes/stats");
const userEventsRoute = require("./routes/userEvents");
const configRoute = require("./routes/config");
const referentielRoute = require("./routes/referentiel");
const dashboardRoute = require("./routes/dashboard");
const cfasRoute = require("./routes/cfas");
const formationRoutes = require("./routes/formations");
const healthcheckRoute = require("./routes/healthcheck");
const demandeAcces = require("./routes/demande-acces");

module.exports = async (components) => {
  const app = express();

  const requireJwtAuthentication = requireJwtAuthenticationMiddleware(components);
  const adminOnly = permissionsMiddleware([apiRoles.administrator]);

  app.use(bodyParser.json());
  app.use(corsMiddleware());
  app.use(logMiddleware());

  app.use(
    "/api/statut-candidats",
    requireJwtAuthentication,
    permissionsMiddleware([apiRoles.apiStatutsSeeder]),
    statutCandidatsRoute(components)
  );

  // open routes
  app.use("/api/login", loginRoute(components));
  app.use("/api/demande-acces", demandeAcces(components));
  app.use("/api/formations", formationRoutes(components));
  app.use("/api/cfas", cfasRoute(components));
  app.use("/api/referentiel", referentielRoute());
  app.use("/api/healthcheck", healthcheckRoute(components));

  // requires JWT auth
  app.use("/api/dashboard", requireJwtAuthentication, dashboardRoute(components));
  app.use("/api/stats", requireJwtAuthentication, adminOnly, statsRoute(components));
  app.use("/api/userEvents", requireJwtAuthentication, adminOnly, userEventsRoute(components));
  app.use("/api/config", requireJwtAuthentication, adminOnly, configRoute());

  app.use(errorMiddleware());

  return app;
};
