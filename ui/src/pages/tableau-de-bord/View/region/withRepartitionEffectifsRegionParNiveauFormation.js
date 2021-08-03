import queryString from "query-string";
import React from "react";

import { useFetch } from "../../../../common/hooks/useFetch";
import { omitNullishValues } from "../../../../common/utils/omitNullishValues";
import { filtersPropTypes } from "../../FiltersContext";

const buildSearchParams = (filters) => {
  const date = filters.date.toISOString();

  return queryString.stringify(
    omitNullishValues({
      date,
      etablissement_num_region: filters.region.code,
    })
  );
};

const withRepartitionEffectifsRegionParNiveauFormation = (Component) => {
  const WithRepartitionEffectifsRegionParNiveauFormation = ({ filters, ...props }) => {
    const searchParamsString = buildSearchParams(filters);
    const [data, loading, error] = useFetch(`/api/dashboard/effectifs-par-niveau-formation?${searchParamsString}`);

    const repartitionEffectifs = data?.map((repartition) => {
      return { niveauFormation: repartition.niveau_formation, effectifs: repartition.effectifs };
    });

    return <Component {...props} repartitionEffectifs={repartitionEffectifs} loading={loading} error={error} />;
  };

  WithRepartitionEffectifsRegionParNiveauFormation.propTypes = {
    filters: filtersPropTypes.state,
  };

  return WithRepartitionEffectifsRegionParNiveauFormation;
};

export default withRepartitionEffectifsRegionParNiveauFormation;
