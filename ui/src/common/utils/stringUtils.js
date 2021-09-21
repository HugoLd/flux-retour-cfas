import { roundToOne } from "./calculUtils";

/**
 * Returns true if substring is found in given string. Case insensitive.
 * @param {string} str
 * @param {string} substr
 */
export const stringContains = (str, substr) => str.toLowerCase().indexOf(substr.toLowerCase()) > -1;

export const displayEvolutionPercentage = (evolutionData) =>
  evolutionData === null
    ? "N/A%"
    : evolutionData >= 0
    ? `+${roundToOne(evolutionData)}%`
    : `${roundToOne(evolutionData)}%`;

export const toPrettyYearLabel = (year) => (year === 1 ? `${year}ère année` : `${year}ème année`);

export const truncate = (string, size = 32) => (string.length > size ? string.substr(0, size - 1) + "..." : string);

export const pluralize = (text, value, pluralCharacter = "s") => (value > 1 ? `${text}${pluralCharacter}` : `${text}`);

export const pluralizeWord = (text, value, pluralCharacter = "s") =>
  value > 1 ? `${text}${pluralCharacter}` : `${text}`;

export const formatNumber = (number) => {
  if (!number) return number;
  return Number(number).toLocaleString();
};
