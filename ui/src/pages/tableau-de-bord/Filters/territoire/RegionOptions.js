import { List } from "@chakra-ui/react";
import PropTypes from "prop-types";
import React, { useState } from "react";

import { SearchInput } from "../../../../common/components";
import { stringContains } from "../../../../common/utils/stringUtils";
import FilterOption from "../FilterOption";

const RegionOptions = ({ regions, onRegionClick, currentFilter }) => {
  const [regionSearchTerm, setRegionSearchTerm] = useState("");

  const filteredRegions = regionSearchTerm
    ? regions.filter((region) => stringContains(region.nom, regionSearchTerm))
    : regions;

  return (
    <>
      <SearchInput placeholder="Saisissez une région" value={regionSearchTerm} onChange={setRegionSearchTerm} />
      <List spacing="1v" marginTop="1w" textAlign="left" maxHeight="18rem" overflowY="scroll">
        {filteredRegions.map((region) => (
          <FilterOption
            key={region.code}
            onClick={() => onRegionClick(region)}
            isSelected={currentFilter?.nom === region.nom}
          >
            {region.nom}
          </FilterOption>
        ))}
      </List>
    </>
  );
};

RegionOptions.propTypes = {
  regions: PropTypes.arrayOf(
    PropTypes.shape({
      nom: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  onRegionClick: PropTypes.func.isRequired,
  currentFilter: PropTypes.shape({
    nom: PropTypes.string.isRequired,
  }),
};

export default RegionOptions;
