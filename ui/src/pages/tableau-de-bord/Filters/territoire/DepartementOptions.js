import { List } from "@chakra-ui/react";
import PropTypes from "prop-types";
import React, { useState } from "react";

import { SearchInput } from "../../../../common/components";
import { stringContains } from "../../../../common/utils/stringUtils";
import FilterOption from "../FilterOption";
import { TERRITOIRE_TYPES } from "./withTerritoireData";

const DepartementOptions = ({ departements, onDepartementClick, currentFilter }) => {
  const [departementSearchTerm, setDepartementSearchTerm] = useState("");

  const filteredDepartements = departementSearchTerm
    ? departements.filter((departement) => stringContains(departement.nom + departement.code, departementSearchTerm))
    : departements;

  return (
    <>
      <SearchInput
        placeholder="Saisissez un département"
        value={departementSearchTerm}
        onChange={setDepartementSearchTerm}
      />
      <List spacing="1v" marginTop="1w" textAlign="left" maxHeight="18rem" overflowY="scroll">
        <FilterOption
          onClick={() => {
            onDepartementClick(null);
          }}
          isSelected={currentFilter === null}
        >
          Toute la France
        </FilterOption>
        {filteredDepartements.map((filter) => (
          <FilterOption
            key={filter.code}
            onClick={() => onDepartementClick(filter)}
            isSelected={currentFilter?.nom === filter.nom}
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
      type: PropTypes.oneOf([TERRITOIRE_TYPES.departement]),
    }).isRequired
  ).isRequired,
  onDepartementClick: PropTypes.func.isRequired,
  currentFilter: PropTypes.shape({
    nom: PropTypes.string.isRequired,
  }),
};

export default DepartementOptions;
