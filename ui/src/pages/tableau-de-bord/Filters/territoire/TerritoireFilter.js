import { Box, Button, Divider, HStack } from "@chakra-ui/react";
import PropTypes from "prop-types";
import React, { useState } from "react";

import { useFetch } from "../../../../common/hooks/useFetch";
import DepartementOptions from "./DepartementOptions";
import RegionOptions from "./RegionOptions";

export const ALL_FRANCE_OPTION = { code: "france", nom: "Toute la France" };

const TERRITOIRE_TYPES = {
  region: "region",
  departement: "departement",
};

const TerritoireTypeOption = ({ isSelected = false, onClick, children }) => {
  return (
    <Box
      cursor="pointer"
      _hover={{ borderBottom: "4px solid" }}
      onClick={onClick}
      color={isSelected ? "bluefrance" : "grey.600"}
      borderBottom={isSelected ? "4px solid" : "none"}
      paddingBottom="1w"
      role="button"
    >
      {children}
    </Box>
  );
};

TerritoireTypeOption.propTypes = {
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const TerritoireFilter = ({ onChange }) => {
  const [isFilterOptionsOpen, setIsFilterOptionsOpen] = useState(false);
  const [chosenFilter, setChosenFilter] = useState(ALL_FRANCE_OPTION);
  const [selectedTerritoireType, setSelectedTerritoireType] = useState(TERRITOIRE_TYPES.region);

  const [departements] = useFetch("https://geo.api.gouv.fr/departements");
  const [regions] = useFetch("https://geo.api.gouv.fr/regions");

  const TERRITOIRE_TYPE_OPTIONS = [
    { value: TERRITOIRE_TYPES.region, label: `Régions (${regions?.length})` },
    { value: TERRITOIRE_TYPES.departement, label: `Départements (${departements?.length})` },
  ];

  const onFilterClick = (territoireType) => (filter) => {
    // set filter and close overlay
    setChosenFilter({ ...filter, type: territoireType });
    setIsFilterOptionsOpen(false);
    onChange({ type: territoireType, value: filter.code });
  };

  return (
    <div>
      <Button onClick={() => setIsFilterOptionsOpen(!isFilterOptionsOpen)} background="bluesoft.200">
        {isFilterOptionsOpen || !chosenFilter ? (
          "Sélectionner un territoire"
        ) : (
          <span>
            <Box fontSize="epsilon" as="i" className="ri-map-pin-fill" marginRight="1v" />
            {chosenFilter.nom}
          </span>
        )}
      </Button>
      {isFilterOptionsOpen && (
        <Box
          background="white"
          position="absolute"
          marginTop="2w"
          left="20%"
          right="20%"
          paddingX="6w"
          paddingY="3w"
          boxShadow="0px 0px 16px rgba(30, 30, 30, 0.12)"
          borderRadius="0.25rem"
        >
          <HStack spacing="4w">
            {TERRITOIRE_TYPE_OPTIONS.map(({ value, label }) => (
              <TerritoireTypeOption
                key={value}
                onClick={() => {
                  setSelectedTerritoireType(value);
                }}
                isSelected={selectedTerritoireType === value}
              >
                {label}
              </TerritoireTypeOption>
            ))}
          </HStack>
          {selectedTerritoireType && (
            <>
              <Divider marginBottom="3w" />
              {selectedTerritoireType === TERRITOIRE_TYPES.departement && (
                <DepartementOptions
                  departements={departements}
                  onDepartementClick={onFilterClick(TERRITOIRE_TYPES.departement)}
                  currentFilter={chosenFilter}
                />
              )}
              {selectedTerritoireType === TERRITOIRE_TYPES.region && (
                <RegionOptions
                  regions={regions}
                  onRegionClick={onFilterClick(TERRITOIRE_TYPES.region)}
                  currentFilter={chosenFilter}
                />
              )}
            </>
          )}
        </Box>
      )}
    </div>
  );
};

TerritoireFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default TerritoireFilter;
