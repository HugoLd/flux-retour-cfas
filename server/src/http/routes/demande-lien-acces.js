const express = require("express");
const Joi = require("joi");
const { uaiRegex } = require("../../common/domain/uai");
const tryCatch = require("../middlewares/tryCatchMiddleware");

module.exports = ({ demandeLienAcces }) => {
  const router = express.Router();

  const demandeLienAccesValidationSchema = Joi.object({
    nom_organisme: Joi.string().required(),
    uai_organisme: Joi.string().regex(uaiRegex).required(),
    code_postal_organisme: Joi.string()
      .regex(/^[0-9]{5}$/)
      .required(),
    email_demandeur: Joi.string().email().required(),
  });

  router.post(
    "/",
    tryCatch(async (req, res) => {
      const { error } = demandeLienAccesValidationSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          status: "INPUT_VALIDATION_ERROR",
          message: error.message,
        });
      }

      const created = await demandeLienAcces.create(req.body);
      return res.json(created);
    })
  );

  return router;
};
