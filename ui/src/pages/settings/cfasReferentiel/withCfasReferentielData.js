import React, { useCallback, useEffect, useState } from "react";
const DEFAULT_SELECTED_REGION = { nom: "Normandie", code: "28" };
import { _get, _post } from "../../../common/httpClient";

const withCfasReferentielData = (Component) => {
  const WithCfasReferentielData = (props) => {
    let [data, setData] = useState(null);
    let [regionsData, setRegionsData] = useState([]);
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState(null);
    let [regionCode, setRegionCode] = useState(DEFAULT_SELECTED_REGION.code);
    let [withDataConnection, setWithDataConnection] = useState(-1);
    let [withValidationTdb, setWithValidationTdb] = useState(-1);

    /** Callback for get paginated filtered cfas list */
    const _fetch = useCallback(
      async (
        pageNumber = 1,
        codeRegion = regionCode,
        withConnection = withDataConnection,
        withValidation = withValidationTdb
      ) => {
        setLoading(true);
        setError(null);

        // Handle filters queries
        let filterQuery = { region_num: codeRegion };

        if (withConnection != -1) {
          filterQuery = { ...filterQuery, ...{ branchement_flux_cfa_erp: withConnection } };
        }

        if (withValidation != -1) {
          filterQuery = { ...filterQuery, ...{ feedback_donnee_valide: withValidation == 2 ? null : withValidation } };
        }

        try {
          const response = await _post("/api/cfas", {
            query: filterQuery,
            page: pageNumber,
            limit: 10,
          });
          setData(response);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      },
      ["/api/cfas"]
    );

    /** UseEffect hook for cfas api call */
    useEffect(() => {
      async function fetchData() {
        return _fetch();
      }
      fetchData();
    }, ["/api/cfas", _fetch]);

    /** UseEffect hook for region cfas api call */
    useEffect(() => {
      const fetchRegionsCfas = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await _get("/api/referentiel/regions-cfas");
          setRegionsData(response);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };
      fetchRegionsCfas();
    }, ["/api/referentiel/regions-cfas", _fetch]);

    /** Update region filter */
    const onRegionChange = async (region) => {
      await setRegionCode(region);
      await _fetch(data.pagination.page, region, withDataConnection, withValidationTdb);
    };

    /** Update connection filter */
    const onConnectionChange = async (withDataConnection) => {
      await setWithDataConnection(withDataConnection);
      await _fetch(data.pagination.page, regionCode, withDataConnection, withValidationTdb);
    };

    /** Update validation Tdb filter */
    const onValidationTdbChange = async (withValidationTdb) => {
      await setWithValidationTdb(withValidationTdb);
      await _fetch(data.pagination.page, regionCode, withDataConnection, withValidationTdb);
    };

    return (
      <Component
        {...props}
        data={data}
        regionsData={regionsData}
        loading={loading}
        error={error}
        _fetch={_fetch}
        onConnectionChange={onConnectionChange}
        onRegionChange={onRegionChange}
        onValidationTdbChange={onValidationTdbChange}
        defaultSelectedRegionCode={DEFAULT_SELECTED_REGION.code}
      />
    );
  };
  return WithCfasReferentielData;
};

export default withCfasReferentielData;
