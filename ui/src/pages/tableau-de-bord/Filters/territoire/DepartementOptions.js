import { Input, InputGroup, InputLeftElement, List, ListItem } from "@chakra-ui/react";
import PropTypes from "prop-types";
import React, { useState } from "react";

import { ALL_FRANCE_OPTION } from "./TerritoireFilter";
import TerritoireOption from "./TerritoireOption";

const MAX_DEPARTEMENTS_OPTIONS_DISPLAYED_LENGTH = 9;

const DepartementOptions = ({ departements = [], onDepartementClick, currentFilter }) => {
  const [departementSearchTerm, setDepartementSearchTerm] = useState("");

  const filteredDepartements = departementSearchTerm
    ? departements.filter((departement) => {
        return departement.nom.toLowerCase().indexOf(departementSearchTerm.toLowerCase()) > -1;
      })
    : departements;

  return (
    <>
      <InputGroup>
        <InputLeftElement pointerEvents="none" className="ri-search-line" as="i" paddingBottom="1w" />
        <Input
          placeholder="Saisissez une région"
          value={departementSearchTerm}
          onChange={(event) => setDepartementSearchTerm(event.target.value)}
          size="sm"
          marginBottom="2w"
          autoFocus
        />
      </InputGroup>
      <List spacing="1w" textAlign="left">
        <TerritoireOption
          onClick={() => {
            onDepartementClick(ALL_FRANCE_OPTION);
          }}
          isSelected={currentFilter?.nom === ALL_FRANCE_OPTION.nom}
        >
          {ALL_FRANCE_OPTION.nom}
        </TerritoireOption>
        {filteredDepartements.slice(0, MAX_DEPARTEMENTS_OPTIONS_DISPLAYED_LENGTH).map((filter) => (
          <TerritoireOption
            key={filter.code}
            onClick={() => onDepartementClick(filter)}
            isSelected={currentFilter?.nom === filter.nom}
          >
            {filter.nom}
          </TerritoireOption>
        ))}
        {filteredDepartements.length > MAX_DEPARTEMENTS_OPTIONS_DISPLAYED_LENGTH && <ListItem>...</ListItem>}
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
  ),
  onDepartementClick: PropTypes.func.isRequired,
  currentFilter: PropTypes.shape({
    nom: PropTypes.string.isRequired,
  }),
};

export default DepartementOptions;
