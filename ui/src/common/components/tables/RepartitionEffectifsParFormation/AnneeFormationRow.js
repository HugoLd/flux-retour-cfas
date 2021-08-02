import { Td, Tr } from "@chakra-ui/react";
import PropTypes from "prop-types";
import React from "react";

import { getPercentage } from "../../../utils/calculUtils";
import { toPrettyYearLabel } from "../../../utils/stringUtils";
import ProgressCell from "../ProgressCell";

const AnneeFormationRow = ({ anneeFormation, effectifs }) => {
  const total = effectifs.apprentis + effectifs.inscritsSansContrat + effectifs.rupturants + effectifs.abandons;
  return (
    <Tr>
      <Td paddingLeft="10w" color="grey.800">
        {anneeFormation ? toPrettyYearLabel(anneeFormation) : "Année non renseignée"}
      </Td>
      <ProgressCell label={effectifs.apprentis} value={getPercentage(effectifs.apprentis, total)} />
      <ProgressCell label={effectifs.inscritsSansContrat} value={getPercentage(effectifs.inscritsSansContrat, total)} />
      <ProgressCell label={effectifs.rupturants} value={getPercentage(effectifs.rupturants, total)} />
      <ProgressCell label={effectifs.abandons} value={getPercentage(effectifs.abandons, total)} />
    </Tr>
  );
};

AnneeFormationRow.propTypes = {
  anneeFormation: PropTypes.number.isRequired,
  effectifs: PropTypes.shape({
    apprentis: PropTypes.number.isRequired,
    inscritsSansContrat: PropTypes.number.isRequired,
    rupturants: PropTypes.number.isRequired,
    abandons: PropTypes.number.isRequired,
  }).isRequired,
};

export default AnneeFormationRow;
