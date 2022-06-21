import qs from "query-string";

import { _delete, _get, _post } from "../httpClient";
import { mapFiltersToApiFormat } from "../utils/mapFiltersToApiFormat";

/* Effectifs */

export const fetchEffectifs = (filters) => {
  const queryParameters = qs.stringify(mapFiltersToApiFormat(filters));
  const url = `/api/effectifs?${queryParameters}`;
  return _get(url);
};

export const fetchEffectifsParCfa = (filters) => {
  const queryParameters = qs.stringify(filters);
  const url = `/api/effectifs/cfa?${queryParameters}`;
  return _get(url);
};

export const fetchEffectifsParSiret = (filters) => {
  const queryParameters = qs.stringify(filters);
  const url = `/api/effectifs/siret?${queryParameters}`;
  return _get(url);
};

export const fetchEffectifsParFormation = (filters) => {
  const queryParameters = qs.stringify(filters);
  const url = `/api/effectifs/formation?${queryParameters}`;
  return _get(url);
};

export const fetchEffectifsParNiveauFormation = (filters) => {
  const queryParameters = qs.stringify(filters);
  const url = `/api/effectifs/niveau-formation?${queryParameters}`;
  return _get(url);
};

export const fetchEffectifsParAnneeFormation = (filters) => {
  const queryParameters = qs.stringify(filters);
  const url = `/api/effectifs/annee-formation?${queryParameters}`;
  return _get(url);
};

export const fetchEffectifsParDepartement = (filters) => {
  const queryParameters = qs.stringify(filters);
  const url = `/api/effectifs/departement?${queryParameters}`;
  return _get(url);
};

/* Total organismes */

export const fetchTotalOrganismes = (filters) => {
  const queryParameters = qs.stringify(filters);
  const url = `/api/effectifs/total-organismes?${queryParameters}`;
  return _get(url);
};

/* Formations */
export const fetchFormation = (formationCfd) => {
  const url = `/api/formations/${formationCfd}`;
  return _get(url);
};

/* CFAs */
export const fetchCfa = (cfaUaiSiret) => {
  const url = `/api/cfas/${cfaUaiSiret}`;
  return _get(url);
};

/* Reseaux CFAS */
export const fetchReseauxCfas = () => {
  return _get("/api/reseaux-cfas");
};

export const postCreateReseauCfa = (body) => {
  return _post("/api/reseaux-cfas", body);
};

export const deleteReseauCfa = (body) => {
  return _delete(`/api/reseaux-cfas/delete/${body}`);
};

/* Reseaux */
export const fetchReseaux = () => {
  return _get("/api/referentiel/networks");
};

/* Regions */
export const fetchRegions = () => {
  return _get("/api/referentiel/regions");
};
/* Departements */
export const fetchDepartements = () => {
  return _get("/api/referentiel/departements");
};

/* CSV export of effectifs repartition by organisme */
export const fetchRepartitionByOrganismeCsvExport = (filters) => {
  const queryParameters = qs.stringify(filters);
  const url = `/api/effectifs/export-csv-repartition-effectifs-par-organisme?${queryParameters}`;
  return _get(url, { jsonResponse: false });
};

/* CSV export of effectifs repartition by formation */
export const fetchRepartitionByFormationCsvExport = (filters) => {
  const queryParameters = qs.stringify(filters);
  const url = `/api/effectifs/export-csv-repartition-effectifs-par-formation?${queryParameters}`;
  return _get(url, { jsonResponse: false });
};

/* Reseaux CFAS Search */
export const fetchSearchReseauxCfas = async (filters) => {
  return await _post("/api/reseaux-cfas/search", filters);
};

/* CFA Search */
export const fetchSearchCfas = async (filters) => {
  return await _post("/api/cfas/search", filters);
};

/* Formations Search */
export const fetchSearchFormations = async (filters) => {
  return await _post("/api/formations/search", filters);
};

/* CSV export of effectifs data list for indicateur */
export const fetchEffectifsDataListXlsxExport = (filters, effectifIndicateur) => {
  const queryParameters = qs.stringify({ ...filters, effectif_indicateur: effectifIndicateur });
  const url = `/api/effectifs/export-xlsx-data-lists?${queryParameters}`;
  return _get(url, { jsonResponse: false });
};

/* Utilisateurs */
export const fetchUsers = async () => {
  return await _get("/api/users");
};

/* Create user */
export const postCreateUser = async (body) => {
  return await _post("/api/users", body);
};

export const postGetUserUpdatePasswordUrl = async (username) => {
  return await _post(`/api/users/generate-update-password-url`, { username });
};
