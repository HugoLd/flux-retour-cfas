import React from "react";
import { useQuery } from "react-query";

import { fetchDepartements } from "../../../../../common/api/geoData";
import { fetchRegions } from "../../../../../common/api/tableauDeBord";
import { sortAlphabeticallyBy } from "../../../../../common/utils/sortAlphabetically";

const withTerritoiresData = (Component) => {
  const WithTerritoiresData = (props) => {
    // departements and regions are very unlikely to change, thus the infinite stale time
    const { data: departements, isLoading: departementsLoading } = useQuery("departement", () => fetchDepartements(), {
      staleTime: Infinity,
    });
    const { data: regions, isLoading: regionsLoading } = useQuery("regions", () => fetchRegions(), {
      staleTime: Infinity,
    });

    const sortedRegions = sortAlphabeticallyBy("nom", regions || []);
    const sortedDepartements = sortAlphabeticallyBy("nom", departements || []);
    const isLoading = departementsLoading || regionsLoading;

    return <Component {...props} departements={sortedDepartements} regions={sortedRegions} loading={isLoading} />;
  };

  return WithTerritoiresData;
};

export default withTerritoiresData;
