import { List } from "@chakra-ui/react";
import PropTypes from "prop-types";
import React, { useState } from "react";

import { FilterOption, SearchInput } from "../../../../../common/components";
import { stringContains } from "../../../../../common/utils/stringUtils";
import TouteLaFranceOption from "./TouteLaFranceOption";

const DepartementOptions = ({ departements, onDepartementClick, onTouteLaFranceClick, currentFilter }) => {
  const [departementSearchTerm, setDepartementSearchTerm] = useState("");

  const filteredDepartements = departementSearchTerm
    ? departements.filter((departement) => stringContains(departement.nom + departement.code, departementSearchTerm))
    : departements;

  return (
    <>
      <SearchInput
        placeholder="Rechercher un département"
        value={departementSearchTerm}
        onChange={setDepartementSearchTerm}
      />
      <List spacing="1v" marginTop="1w" textAlign="left" maxHeight="18rem" overflowY="scroll">
        <TouteLaFranceOption onClick={onTouteLaFranceClick} />
        {filteredDepartements.map((filter) => (
          <FilterOption
            key={filter.code}
            onClick={() => onDepartementClick(filter)}
            isSelected={currentFilter?.code === filter.code}
          >
            {filter.nom} ({filter.code})
          </FilterOption>
        ))}
      </List>
    </>
  );
};

DepartementOptions.propTypes = {
  departements: PropTypes.arrayOf(
    PropTypes.shape({
      nom: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  onDepartementClick: PropTypes.func.isRequired,
  onTouteLaFranceClick: PropTypes.func.isRequired,
  currentFilter: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
  }),
};

export default DepartementOptions;
