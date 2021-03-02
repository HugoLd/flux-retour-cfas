import { HStack } from "@chakra-ui/react";
import { subYears } from "date-fns";
import React, { useState } from "react";

import FormationFilter from "./formation/FormationFilter";
import PeriodeFilter from "./periode/PeriodeFilter";
import TerritoireFilter from "./territoire/TerritoireFilter";

const TableauDeBordFilters = () => {
  const [filters, setFilters] = useState({
    periode: {
      date1: subYears(new Date(), 1),
      date2: new Date(),
    },
    territoire: null,
    formation: null,
  });

  const handlePeriodeFilterChange = ({ date1, date2 }) => {
    setFilters({ ...filters, periode: { date1, date2 } });
  };

  const handleTerritoireFilterChange = (territoire) => {
    setFilters({ ...filters, territoire });
  };

  const handleFormationFilterChange = (formation) => {
    setFilters({ ...filters, formation });
  };

  return (
    <HStack spacing="2w" mt="2w" justifyContent="center">
      <PeriodeFilter date1={filters.periode.date1} date2={filters.periode.date2} onChange={handlePeriodeFilterChange} />
      <TerritoireFilter value={filters.territoire} onChange={handleTerritoireFilterChange} />
      <FormationFilter value={filters.formation} onChange={handleFormationFilterChange} />
    </HStack>
  );
};

export default TableauDeBordFilters;
