const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { reseauxCfas, regions } = require("../../common/model/constants");

module.exports = () => {
  const router = express.Router();

  router.get(
    "/networks",
    tryCatch(async (req, res) => {
      const networks = Object.keys(reseauxCfas).map((id) => ({ id, nom: reseauxCfas[id].nomReseau }));
      return res.json(networks);
    })
  );

  router.get(
    "/regions",
    tryCatch(async (req, res) => {
      return res.json(regions);
    })
  );

  return router;
};
