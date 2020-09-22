const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");

module.exports = () => {
  const router = express.Router();

  router.get(
    "/",
    tryCatch(async (req, res) => {
      return res.json({
        message: "Role 2 Secured route",
      });
    })
  );

  return router;
};
