import PropTypes from "prop-types";

export const effectifsPropType = PropTypes.shape({
  apprentis: PropTypes.shape({
    count: PropTypes.number.isRequired,
    evolution: PropTypes.number,
  }).isRequired,
  inscrits: PropTypes.shape({
    count: PropTypes.number.isRequired,
    evolution: PropTypes.number,
  }).isRequired,
  abandons: PropTypes.shape({
    count: PropTypes.number.isRequired,
    evolution: PropTypes.number,
  }).isRequired,
});

export const filtersPropType = PropTypes.shape({
  periode: {
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
  },
  cfa: PropTypes.shape({
    siret_etablissement: PropTypes.string.isRequired,
    nom_etablissement: PropTypes.string.isRequired,
  }),
  territoire: PropTypes.shape({
    type: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
  }),
  formation: PropTypes.shape({
    cfd: PropTypes.string.isRequired,
    libelle: PropTypes.string.isRequired,
  }),
});
