import { getFilteredQueryForUser } from "../auth/roles";
import { omitNullishValues } from "./omitNullishValues";

export const mapFiltersToApiFormat = (filters) => {
  return getFilteredQueryForUser(
    omitNullishValues({
      date: filters.date.toISOString(),
      etablissement_num_region: filters.region?.code ?? null,
      etablissement_num_departement: filters.departement?.code ?? null,
      formation_cfd: filters.formation?.cfd ?? null,
      uai_etablissement: filters.cfa?.uai_etablissement ?? null,
      siret_etablissement: filters.sousEtablissement?.siret_etablissement ?? null,
      etablissement_reseaux: filters.reseau?.nom ?? null,
    })
  );
};
