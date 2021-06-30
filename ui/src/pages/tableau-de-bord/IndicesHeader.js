import { Box, Heading, HStack } from "@chakra-ui/react";
import React from "react";

import { Section } from "../../common/components";
import CfasFilter from "./Filters/cfas/CfasFilter";
import FormationFilter from "./Filters/formation/FormationFilter";
import TerritoireFilter from "./Filters/territoire/TerritoireFilter";
import { useFiltersContext } from "./FiltersContext";

const IndicesHeader = () => {
  const filtersContext = useFiltersContext();

  return (
    <Section backgroundColor="galt" paddingY="4w">
      <Heading as="h1" textStyle="h1" marginBottom="1w">
        Visualiser les indices en temps réel
      </Heading>
      <TerritoireFilter
        onDepartementChange={filtersContext.setters.setDepartement}
        onRegionChange={filtersContext.setters.setRegion}
        filters={filtersContext.state}
      />
      <HStack marginTop="3w">
        <CfasFilter
          filters={filtersContext.state}
          onCfaChange={filtersContext.setters.setCfa}
          onReseauChange={filtersContext.setters.setReseau}
        />
        <Box as="span" color="grey.800">
          ou
        </Box>
        <FormationFilter filters={filtersContext.state} onFormationChange={filtersContext.setters.setFormation} />
      </HStack>
    </Section>
  );
};

export default IndicesHeader;
