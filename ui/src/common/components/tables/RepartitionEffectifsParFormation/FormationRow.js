import { Box, Flex, Td, Tr } from "@chakra-ui/react";
import PropTypes from "prop-types";
import React, { useState } from "react";

import { getPercentage } from "../../../utils/calculUtils";
import ProgressCell from "../ProgressCell";
import AnneeFormationRows from "./AnneeFormationRows";

const FormationRow = ({ formationCfd, intitule, effectifs }) => {
  const [isOpen, setIsOpen] = useState();

  const total = effectifs.apprentis + effectifs.inscrits + effectifs.abandons;
  return (
    <>
      <Tr>
        <Td paddingLeft="6w" color="grey.800">
          <Flex onClick={() => setIsOpen(!isOpen)} cursor="pointer">
            <Box
              as="i"
              className={isOpen ? "ri-subtract-line" : "ri-add-line"}
              verticalAlign="middle"
              color="bluefrance"
              fontSize="beta"
            />
            <Box verticalAlign="middle" marginLeft="1w">
              <Box fontWeight="700">{intitule}</Box>
              <Box fontSize="omega">CFD : {formationCfd}</Box>
            </Box>
          </Flex>
        </Td>
        <ProgressCell label={effectifs.apprentis} value={getPercentage(effectifs.apprentis, total)} />
        <ProgressCell label={effectifs.inscrits} value={getPercentage(effectifs.inscrits, total)} />
        <ProgressCell label={effectifs.abandons} value={getPercentage(effectifs.abandons, total)} />
      </Tr>
      {isOpen && <AnneeFormationRows formationCfd={formationCfd} />}
    </>
  );
};

FormationRow.propTypes = {
  formationCfd: PropTypes.string.isRequired,
  intitule: PropTypes.string.isRequired,
  effectifs: PropTypes.shape({
    apprentis: PropTypes.number.isRequired,
    inscrits: PropTypes.number.isRequired,
    abandons: PropTypes.number.isRequired,
  }).isRequired,
};

export default FormationRow;
