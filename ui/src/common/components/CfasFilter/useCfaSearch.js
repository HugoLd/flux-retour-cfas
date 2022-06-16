import { useQuery } from "react-query";

import { fetchSearchCfas } from "../../api/tableauDeBord";
import { QUERY_KEY } from "../../constants/queryKey";
import useDebounce from "../../hooks/useDebounce";
import { omitNullishValues } from "../../utils/omitNullishValues";

export const MINIMUM_CHARS_TO_PERFORM_SEARCH = 4;
const SEARCH_DEBOUNCE_TIME = 300;

const useCfaSearch = (searchTerm, filters) => {
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_TIME);

  // perform search if user has entered at least 4 chars or none
  const searchEnabled =
    debouncedSearchTerm.length === 0 || debouncedSearchTerm.length >= MINIMUM_CHARS_TO_PERFORM_SEARCH;

  const requestFilters = omitNullishValues({
    // we'll send null if debouncedSearchTerm is ""
    searchTerm: debouncedSearchTerm || null,
    etablissement_num_region: filters.region?.code ?? null,
    etablissement_num_departement: filters.departement?.code ?? null,
    etablissement_reseaux: filters.reseau?.nom ?? null,
  });

  const { data, isLoading } = useQuery([QUERY_KEY.searchCfas, requestFilters], () => fetchSearchCfas(requestFilters), {
    enabled: searchEnabled,
  });

  return {
    data: data?.map(({ uai, nom, departement, sirets }) => {
      return { uai_etablissement: uai, nom_etablissement: nom, departement, sirets_etablissement: sirets };
    }),
    loading: isLoading,
  };
};

export default useCfaSearch;
