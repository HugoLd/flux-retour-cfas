import { List, Text } from "@chakra-ui/react";
import { debounce } from "debounce";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import { SearchInput } from "../../../../common/components";
import { _post } from "../../../../common/httpClient";
import TerritoireOption from "../territoire/TerritoireOption";
import CfasList from "./CfasList";

const SEARCH_DEBOUNCE_TIME = 300;

const searchCfaBySiretOrUai = debounce(async (searchTerm, callback) => {
  const result = await _post(`/api/cfas/search?searchTerm=${searchTerm}`);
  callback(result);
}, SEARCH_DEBOUNCE_TIME);

const CfaPanel = ({ value, onCfaClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState();

  useEffect(() => {
    setSearchResults(null);
    if (searchTerm.length > 3) {
      searchCfaBySiretOrUai(searchTerm, (result) => {
        setSearchResults(result);
      });
    }
  }, [searchTerm]);

  return (
    <div>
      <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Saisissez le nom d'un établissment" />
      <List spacing="1v" marginTop="1w" textAlign="left">
        <TerritoireOption
          onClick={() => {
            onCfaClick(null);
          }}
          isSelected={value === null}
        >
          Tous les centres de formation
        </TerritoireOption>
        {searchResults && (
          <CfasList
            cfas={searchResults}
            onCfaClick={onCfaClick}
            isSelected={({ siret_etablissement }) => value?.siret_etablissement === siret_etablissement}
          />
        )}
        {searchResults?.length === 0 && (
          <Text fontSize="zeta" color="gray.500">
            Aucun résultat trouvé
          </Text>
        )}
      </List>
    </div>
  );
};

CfaPanel.propTypes = {
  onCfaClick: PropTypes.func.isRequired,
  value: PropTypes.shape({
    siret_etablissement: PropTypes.string.isRequired,
    uai_etablissement: PropTypes.string.isRequired,
    nom_etablissement: PropTypes.string.isRequired,
  }),
};

export default CfaPanel;
