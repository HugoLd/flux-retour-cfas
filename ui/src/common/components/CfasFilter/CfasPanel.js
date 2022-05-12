import { Box, Divider, Heading, Skeleton, Stack, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import React, { useState } from "react";

import { filtersPropTypes } from "../../../pages/app/visualiser-les-indicateurs/FiltersContext";
import InputLegend from "../InputLegend/InputLegend";
import SearchInput from "../SearchInput/SearchInput";
import CfasList from "./CfasList";
import useCfaSearch, { MINIMUM_CHARS_TO_PERFORM_SEARCH } from "./useCfaSearch";

const NoResults = () => {
  return (
    <Text color="grey.800" fontWeight="700" paddingTop="2w" paddingLeft="1w">
      Il n&apos;y a aucun résultat pour votre recherche sur le territoire sélectionné
    </Text>
  );
};

const Loading = () => {
  return (
    <Stack spacing="2w" paddingLeft="1w" marginTop="2w">
      <Skeleton startColor="grey.300" endColor="grey.500" width="100%" height="1.5rem" />;
      <Skeleton startColor="grey.300" endColor="grey.500" width="100%" height="1.5rem" />;
      <Skeleton startColor="grey.300" endColor="grey.500" width="100%" height="1.5rem" />;
      <Skeleton startColor="grey.300" endColor="grey.500" width="100%" height="1.5rem" />;
      <Skeleton startColor="grey.300" endColor="grey.500" width="100%" height="1.5rem" />;
    </Stack>
  );
};

const CfaPanel = ({ value, onCfaClick, filters }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: searchResults, loading } = useCfaSearch(searchTerm, filters);

  return (
    <div>
      <Heading as="h3" variant="h3" marginBottom="3w">
        Sélectionner un organisme de formation
      </Heading>
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Rechercher le nom d'un organisme de formation, son UAI ou son SIRET"
      />
      {searchTerm.length < MINIMUM_CHARS_TO_PERFORM_SEARCH && (
        <Box paddingLeft="1w" paddingTop="3v">
          <InputLegend>
            Merci de renseigner au minimum {MINIMUM_CHARS_TO_PERFORM_SEARCH} caractères pour lancer la recherche
          </InputLegend>
          <Divider marginTop="3v" borderBottomColor="grey.300" orientation="horizontal" />
        </Box>
      )}
      {searchTerm.length > 0 && searchResults?.length === 0 && <NoResults />}
      {loading && <Loading />}
      {searchResults?.length > 0 && <CfasList cfas={searchResults} onCfaClick={onCfaClick} selectedValue={value} />}
    </div>
  );
};

CfaPanel.propTypes = {
  onCfaClick: PropTypes.func.isRequired,
  value: PropTypes.shape({
    uai_etablissement: PropTypes.string.isRequired,
    nom_etablissement: PropTypes.string.isRequired,
  }),
  filters: filtersPropTypes.state,
};

export default CfaPanel;
