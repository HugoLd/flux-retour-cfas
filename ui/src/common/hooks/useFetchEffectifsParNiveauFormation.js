import { useQuery } from "react-query";

import { fetchEffectifsParNiveauFormation } from "../../common/api/tableauDeBord";
import { mapFiltersToApiFormat } from "../utils/mapFiltersToApiFormat";

const useFetchEffectifsParNiveauFormation = (filters = {}) => {
  const requestFilters = mapFiltersToApiFormat(filters);
  const { data, isLoading, error } = useQuery(["effectifs-par-niveau-formation", requestFilters], () =>
    fetchEffectifsParNiveauFormation(requestFilters)
  );

  const repartitionEffectifs = data?.map((repartition) => {
    return {
      niveauFormation: repartition.niveau_formation,
      niveauFormationLibelle: repartition.niveau_formation_libelle,
      effectifs: repartition.effectifs,
    };
  });

  return { data: repartitionEffectifs, loading: isLoading, error };
};

export default useFetchEffectifsParNiveauFormation;
