const express = require("express");
const permissionsMiddleware = require("../middlewares/permissionsMiddleware");
const { administrator } = require("../../common/roles");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { reseauxCfas } = require("../../common/model/constants");

module.exports = () => {
  const router = express.Router();

  router.get(
    "/networks",
    permissionsMiddleware([administrator]),
    tryCatch(async (req, res) => {
      return res.json({ networks: reseauxCfas });
    })
  );

  return router;
};
