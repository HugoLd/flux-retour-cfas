import PropTypes from "prop-types";
import React from "react";

import { useFiltersContext } from "../FiltersContext";
import { effectifsPropType } from "../propTypes";
import CfaView from "./cfa/CfaView";
import FormationView from "./formation/FormationView";
import GenericView from "./generic/GenericView";
import ReseauView from "./reseau/ReseauView";

const TableauDeBordViewSwitch = ({ effectifs, loading, error }) => {
  const { state: filters } = useFiltersContext();

  if (filters.cfa) {
    return (
      <CfaView
        cfaUai={filters.cfa.uai_etablissement}
        filters={filters}
        effectifs={effectifs}
        loading={loading}
        error={error}
      />
    );
  }

  if (filters.reseau) {
    return <ReseauView effectifs={effectifs} filters={filters} reseau={filters.reseau.nom} />;
  }

  if (filters.formation) {
    return <FormationView formationCfd={filters.formation.cfd} filters={filters} effectifs={effectifs} />;
  }

  return <GenericView filters={filters} effectifs={effectifs} loading={loading} error={error} />;
};

TableauDeBordViewSwitch.propTypes = {
  effectifs: effectifsPropType,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
};

export default TableauDeBordViewSwitch;
