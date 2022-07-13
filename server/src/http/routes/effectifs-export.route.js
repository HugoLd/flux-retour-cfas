const express = require("express");
const { parseAsync } = require("json2csv");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const Joi = require("joi");
const { getAnneesScolaireListFromDate } = require("../../common/utils/anneeScolaireUtils");
const { tdbRoles, apiRoles } = require("../../common/roles");

const permissionsMiddleware = require("../middlewares/permissionsMiddleware");
const { EFFECTIF_INDICATOR_NAMES } = require("../../common/constants/dossierApprenantConstants");
const omit = require("lodash.omit");
const validateRequestQuery = require("../middlewares/validateRequestQuery");
const { toXlsxBuffer } = require("../../common/utils/exporterUtils");
const {
  USER_EVENTS_ACTIONS,
  getExportAnonymizedEventNameFromFilters,
} = require("../../common/constants/userEventsConstants");

const filterQueryForNetworkRole = (req) => {
  if (req.user?.permissions.includes(tdbRoles.network)) {
    req.query.etablissement_reseaux = req.user.network;
  }
};

const filterQueryForCfaRole = (req) => {
  if (req.user?.permissions.includes(tdbRoles.cfa)) {
    req.query.uai_etablissement = req.user?.username;
  }
};

const applyUserRoleFilter = (req, _res, next) => {
  // users with network role should not be able to see data for other reseau
  filterQueryForNetworkRole(req);

  // users with cfa role should not be able to see data for other cfas
  filterQueryForCfaRole(req);

  next();
};

const commonEffectifsFilters = {
  etablissement_num_region: Joi.string().allow(null, ""),
  etablissement_num_departement: Joi.string().allow(null, ""),
  formation_cfd: Joi.string().allow(null, ""),
  uai_etablissement: Joi.string().allow(null, ""),
  siret_etablissement: Joi.string().allow(null, ""),
  etablissement_reseaux: Joi.string().allow(null, ""),
};

module.exports = ({ effectifs, cfas, userEvents }) => {
  const router = express.Router();

  /**
   * Export the anonymized effectifs lists for input period & query
   */
  router.get(
    "/export-csv-anonymized-list",
    applyUserRoleFilter,
    validateRequestQuery(
      Joi.object({
        date: Joi.date().required(),
        ...commonEffectifsFilters,
      })
    ),
    tryCatch(async (req, res) => {
      // Gets & format params
      const { date: dateFromParams, ...filtersFromBody } = req.query;
      const date = new Date(dateFromParams);
      const filters = { ...filtersFromBody, annee_scolaire: { $in: getAnneesScolaireListFromDate(date) } };

      // create user event
      await userEvents.create({
        action: getExportAnonymizedEventNameFromFilters(filters),
        username: req.user.username,
        data: req.query,
      });

      const anonymizedList = await effectifs.getAnonymousEffectifsAtDate(date, filters);

      // Parse to french localized CSV (; as delimiter and UTF8 using withBOM)
      const csv = await parseAsync(anonymizedList, { delimiter: ";", withBOM: true });
      return res.attachment("export-csv-effectifs-anonymized-list.csv").send(csv);
    })
  );

  /**
   * Export xlsx of the effectifs data lists for input period & query
   */
  router.get(
    "/export-xlsx-lists",
    permissionsMiddleware([apiRoles.administrator, tdbRoles.cfa]),
    applyUserRoleFilter,
    validateRequestQuery(
      Joi.object({
        date: Joi.date().required(),
        effectif_indicateur: Joi.string().required(),
        ...commonEffectifsFilters,
      })
    ),
    tryCatch(async (req, res) => {
      // Gets & format params:
      // eslint-disable-next-line no-unused-vars
      const { date: dateFromParams, effectif_indicateur: effectifIndicateurFromParams, ...filtersFromBody } = req.query;
      const date = new Date(dateFromParams);
      const filters = { ...filtersFromBody, annee_scolaire: { $in: getAnneesScolaireListFromDate(date) } };

      // create event
      await userEvents.create({
        action: USER_EVENTS_ACTIONS.EXPORT.XLSX_DATA_LISTS,
        username: req.user.username,
        data: req.query,
      });

      // Build effectifs data formatted for date
      const effectifsFormattedAtDate = await buildEffectifsFormattedAtDate(effectifIndicateurFromParams, date, filters);

      // Get cfas infos for headers
      const cfaInfos = await cfas.getFromUai(req.query.uai_etablissement);

      // Build headers
      const headers = getXlsxHeadersFromEffectifIndicateur(effectifIndicateurFromParams, cfaInfos);

      // Build & return xlsx stream
      const xlsxStream = await toXlsxBuffer(headers, effectifsFormattedAtDate, "Données Tdb");
      return res.attachment("export-xlsx-data-lists.xlsx").send(xlsxStream);
    })
  );

  /**
   * Build xslx headers for current effectifIndicateur
   * @param {*} effectifIndicateurFromParams
   * @param {*} cfaInfos
   * @returns
   */
  const getXlsxHeadersFromEffectifIndicateur = (effectifIndicateurFromParams, cfaInfos) => {
    switch (effectifIndicateurFromParams) {
      case EFFECTIF_INDICATOR_NAMES.apprentis:
        return [
          ["Liste nominative des effectifs : apprentis"],
          [`${cfaInfos.nom} - UAI : ${cfaInfos.uai} - SIRET : ${cfaInfos.sirets.join(",")}`],
          [
            "Vous avez identifié des apprenants qui ne devraient pas figurer dans la liste des apprentis ? Vérifiez que vous avez bien enregistré la rupture de contrat ou l'abandon dans votre logiciel de gestion.",
          ],
          [
            "Vous avez une autre question ou vous avez besoin de contacter l'équipe du Tableau de bord de l'apprentissage ? Prendre un rendez-vous : https://calendly.com/melanie-raphael-mission-apprentissage/support-tableau-de-bord-de-l-apprentissage",
          ],
        ];

      case EFFECTIF_INDICATOR_NAMES.inscritsSansContrats:
        return [
          ["Liste nominative des effectifs : inscrits sans contrats"],
          [`${cfaInfos.nom} - UAI : ${cfaInfos.uai} - SIRET : ${cfaInfos.sirets.join(",")}`],
          [
            "Vous avez identifié des apprenants qui ne devraient pas figurer dans la liste des inscrits sans contrats ? Vérifiez que vous avez bien paramétré votre logiciel de gestion : voir le tutoriel : https://cfas.apprentissage.beta.gouv.fr/transmettre-vos-donnees",
          ],
          [
            "Vous avez une autre question ou vous avez besoin de contacter l'équipe du Tableau de bord de l'apprentissage ? Prendre un rendez-vous : https://calendly.com/melanie-raphael-mission-apprentissage/support-tableau-de-bord-de-l-apprentissage",
          ],
        ];

      case EFFECTIF_INDICATOR_NAMES.rupturants:
        return [
          ["Liste nominative des effectifs : rupturants"],
          [`${cfaInfos.nom} - UAI : ${cfaInfos.uai} - SIRET : ${cfaInfos.sirets.join(",")}`],
          [
            "Vous avez identifié des apprenants qui ne devraient pas figurer dans la liste des rupturants ? Vérifiez que vous avez bien enregistré le nouveau contrat ou l'abandon dans votre logiciel de gestion.",
          ],
          [
            "Vous avez une autre question ou vous avez besoin de contacter l'équipe du Tableau de bord de l'apprentissage ? Prendre un rendez-vous : https://calendly.com/melanie-raphael-mission-apprentissage/support-tableau-de-bord-de-l-apprentissage",
          ],
        ];

      case EFFECTIF_INDICATOR_NAMES.abandons:
        return [
          ["Liste nominative des effectifs : abandons"],
          [`${cfaInfos.nom} - UAI : ${cfaInfos.uai} - SIRET : ${cfaInfos.sirets.join(",")}`],
          [
            "Vous avez identifié des apprenants qui ne devraient pas figurer dans la liste des abandons ou vous avez besoin de contacter l'équipe du Tableau de bord de l'apprentissage ? Prendre un rendez-vous : https://calendly.com/melanie-raphael-mission-apprentissage/support-tableau-de-bord-de-l-apprentissage",
          ],
        ];
    }
  };

  /**
   * Build a list of effectif data well-formatted for specific indicator, date & filters
   * @param {*} effectifIndicateurFromParams
   * @param {*} date
   * @param {*} filters
   * @returns
   */
  const buildEffectifsFormattedAtDate = async (effectifIndicateurFromParams, date, filters) => {
    let effectifsFormattedAtDate;

    // Build data list for indicator
    switch (effectifIndicateurFromParams) {
      case EFFECTIF_INDICATOR_NAMES.apprentis:
        effectifsFormattedAtDate = await effectifs.apprentis.getExportFormattedListAtDate(date, filters);
        break;

      case EFFECTIF_INDICATOR_NAMES.abandons:
        effectifsFormattedAtDate = await effectifs.abandons.getExportFormattedListAtDate(date, filters);
        break;

      case EFFECTIF_INDICATOR_NAMES.inscritsSansContrats:
        effectifsFormattedAtDate = await effectifs.inscritsSansContrats.getExportFormattedListAtDate(date, filters);
        break;

      case EFFECTIF_INDICATOR_NAMES.rupturants:
        effectifsFormattedAtDate = await effectifs.rupturants.getExportFormattedListAtDate(date, filters);
        break;

      default:
        break;
    }

    // Omit useless data
    return effectifsFormattedAtDate.map((item) => {
      return omit(item, ["_id", "statut_apprenant_at_date", "previousStatutAtDate"]);
    });
  };

  return router;
};
