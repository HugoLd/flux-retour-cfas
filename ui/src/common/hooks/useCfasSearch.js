import { useQuery } from "react-query";

import { fetchSearchCfas } from "../api/tableauDeBord";
import { QUERY_KEYS } from "../constants/queryKey";
import { omitNullishValues } from "../utils/omitNullishValues";
import useDebounce from "./useDebounce";

const SEARCH_DEBOUNCE_TIME = 300;

const useCfasSearch = (searchTerm) => {
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_TIME);

  const requestFilters = omitNullishValues({
    // we'll send null if debouncedSearchTerm is ""
    searchTerm: debouncedSearchTerm || null,
  });

  const { data, isLoading } = useQuery(
    [QUERY_KEYS.searchCfas, requestFilters],
    () => fetchSearchCfas(requestFilters),
    {}
  );

  return { data, loading: isLoading };
};

export default useCfasSearch;
