const { buildTokenizedString } = require("../utils/buildTokenizedString");
const Joi = require("joi");
const { schema: uaiSchema } = require("../domain/uai");
const { schema: natureSchema } = require("../domain/organisme-de-formation/nature");
const config = require("../../../config");
const { generateRandomAlphanumericPhrase } = require("../utils/miscUtils");
const { BaseFactory } = require("./baseFactory");

const TOKENIZED_STRING_SIZE = 4;

class Cfa extends BaseFactory {
  /**
   * Create a Cfa Entry from props
   * Generate a random accessToken and privateUrl
   * @param {*} props
   * @returns
   */
  static create(props) {
    const schema = Joi.object({
      uai: uaiSchema.required(),
      sirets: Joi.array().items(Joi.string()).allow(null),
      nom: Joi.string().allow("").required(),
      nature: natureSchema,
      natureValidityWarning: Joi.boolean(),
      adresse: Joi.string().allow("", null),
      erps: Joi.array().items(Joi.string()).allow(null),
      region_nom: Joi.string().allow("", null),
      region_num: Joi.string().allow("", null),
      metiers: Joi.array().items(Joi.string()).allow(null),
      first_transmission_date: Joi.date(),
    });

    const { error } = schema.validate(props);
    if (error) return null;

    const accessToken = generateRandomAlphanumericPhrase();

    return new Cfa({
      ...props,
      access_token: accessToken,
      nom_tokenized: this.createTokenizedNom(props.nom),
      private_url: `${config.publicUrl}/cfa/${accessToken}`,
      created_at: new Date(),
      updated_at: null,
    });
  }

  static createTokenizedNom(nom) {
    return buildTokenizedString(nom.trim(), TOKENIZED_STRING_SIZE);
  }
}

module.exports = { Cfa };
