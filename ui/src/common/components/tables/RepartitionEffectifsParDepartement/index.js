import { Tbody } from "@chakra-ui/react";
import PropTypes from "prop-types";
import React from "react";

import { useFiltersContext } from "../../../../pages/app/visualiser-les-indicateurs/FiltersContext";
import { isDateFuture } from "../../../utils/dateUtils";
import Table from "../Table";
import DepartementRow from "./DepartementRow";

const RepartitionEffectifsParDepartement = ({ effectifs, loading, error }) => {
  let content = null;
  const filtersContext = useFiltersContext();
  const isPeriodInvalid = isDateFuture(filtersContext.state.date);
  const tableHeader = isPeriodInvalid
    ? ["Liste des organismes par département", "Nature", "apprentis", "inscrits sans contrat"]
    : [
        "Liste des organismes par département",
        "Nature",
        "apprentis",
        "inscrits sans contrat",
        "rupturants",
        "abandons",
      ];
  if (effectifs) {
    content = (
      <Tbody>
        {effectifs.map((item) => {
          const { etablissement_num_departement, etablissement_nom_departement, effectifs } = item;
          return (
            <DepartementRow
              key={"departement_" + etablissement_num_departement}
              departementCode={etablissement_num_departement}
              departementNom={etablissement_nom_departement}
              effectifs={effectifs}
              isPeriodInvalid={isPeriodInvalid}
            />
          );
        })}
      </Tbody>
    );
  }

  return (
    <Table headers={tableHeader} loading={loading} error={error}>
      {content}
    </Table>
  );
};

RepartitionEffectifsParDepartement.propTypes = {
  effectifs: PropTypes.arrayOf(
    PropTypes.shape({
      uai_etablissement: PropTypes.string,
      nom_etablissement: PropTypes.string.isRequired,
      effectifs: PropTypes.shape({
        apprentis: PropTypes.number.isRequired,
        inscritsSansContrat: PropTypes.number.isRequired,
        rupturants: PropTypes.number.isRequired,
        abandons: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired
  ),
  loading: PropTypes.bool,
  error: PropTypes.object,
};

export default RepartitionEffectifsParDepartement;
