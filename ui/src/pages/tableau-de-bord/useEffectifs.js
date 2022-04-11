import { useQuery } from "react-query";

import { fetchEffectifs } from "../../common/api/tableauDeBord";
import { useFiltersContext } from "./FiltersContext";

const mapEffectifsData = (effectifsData) => {
  return {
    apprentis: {
      count: effectifsData.apprentis,
    },
    inscritsSansContrat: {
      count: effectifsData.inscritsSansContrat,
    },
    rupturants: {
      count: effectifsData.rupturants,
    },
    abandons: {
      count: effectifsData.abandons,
    },
    rupturantsNets: {
      count: effectifsData.rupturantsNets,
    },
  };
};

const useEffectifs = () => {
  const filtersContext = useFiltersContext();

  const { status, data, error } = useQuery(["effectifs", filtersContext.state], () =>
    fetchEffectifs(filtersContext.state)
  );

  const loading = status === "loading";
  const effectifs = data && mapEffectifsData(data);

  return [effectifs, loading, error];
};

export default useEffectifs;
