import PropTypes from "prop-types";
import { createContext, useContext, useReducer } from "react";

import { DEFAULT_REGION } from "../../common/constants/defaultRegion";

const FiltersContext = createContext();

const ACTION_TYPES = {
  SET_DATE: "SET_DATE",
  SET_REGION: "SET_REGION",
  SET_DEPARTEMENT: "SET_DEPARTEMENT",
  SET_CFA: "SET_CFA",
  SET_RESEAU: "SET_RESEAU",
  SET_FORMATION: "SET_FORMATION",
  SET_SIRET: "SET_SIRET",
};

const filtersReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_DATE:
      return { ...state, date: action.value };

    case ACTION_TYPES.SET_REGION:
      return { ...state, cfa: null, departement: null, siret: null, region: action.value };

    case ACTION_TYPES.SET_DEPARTEMENT:
      return { ...state, cfa: null, region: null, siret: null, departement: action.value };

    case ACTION_TYPES.SET_FORMATION:
      return { ...state, cfa: null, reseau: null, siret: null, formation: action.value };

    case ACTION_TYPES.SET_CFA:
      return { ...state, reseau: null, formation: null, siret: null, cfa: action.value };

    case ACTION_TYPES.SET_RESEAU:
      return { ...state, cfa: null, formation: null, siret: null, reseau: action.value };

    case ACTION_TYPES.SET_SIRET:
      return { ...state, siret: action.value };

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

export const FiltersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filtersReducer, {
    date: new Date(),
    departement: null,
    region: DEFAULT_REGION,
    formation: null,
    cfa: null,
    reseau: null,
    siret: null,
  });

  const setters = {
    setDate: (date) => dispatch({ type: ACTION_TYPES.SET_DATE, value: date }),
    setRegion: (region) => dispatch({ type: ACTION_TYPES.SET_REGION, value: region }),
    setDepartement: (departement) => dispatch({ type: ACTION_TYPES.SET_DEPARTEMENT, value: departement }),
    setCfa: (cfa) => dispatch({ type: ACTION_TYPES.SET_CFA, value: cfa }),
    setReseau: (reseau) => dispatch({ type: ACTION_TYPES.SET_RESEAU, value: reseau }),
    setFormation: (formation) => dispatch({ type: ACTION_TYPES.SET_FORMATION, value: formation }),
    setSiret: (siret) => dispatch({ type: ACTION_TYPES.SET_SIRET, value: siret }),
  };

  const contextValue = {
    state,
    setters,
  };

  return <FiltersContext.Provider value={contextValue}>{children}</FiltersContext.Provider>;
};

FiltersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useFiltersContext = () => {
  return useContext(FiltersContext);
};

export const filtersPropTypes = {
  state: PropTypes.shape({
    date: PropTypes.instanceOf(Date),
    cfa: PropTypes.shape({
      uai_etablissement: PropTypes.string.isRequired,
      nom_etablissement: PropTypes.string.isRequired,
    }),
    region: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    }),
    departement: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    }),
    reseau: PropTypes.shape({
      nom: PropTypes.string.isRequired,
    }),
    formation: PropTypes.shape({
      cfd: PropTypes.string.isRequired,
      libelle: PropTypes.string.isRequired,
    }),
    siret: PropTypes.string,
  }).isRequired,
};
