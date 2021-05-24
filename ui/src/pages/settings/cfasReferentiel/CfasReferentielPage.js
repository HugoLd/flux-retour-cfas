import {
  Box,
  HStack,
  Select,
  Skeleton,
  Stack,
  Table,
  TableCaption,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import React from "react";

import { Page, PageContent, PageHeader, Pagination } from "../../../common/components";
import withCfasReferentielData from "./withCfasReferentielData";

const CfasReferentielPage = ({
  data,
  regionsData,
  error,
  loading,
  _fetch,
  onConnectionChange,
  onRegionChange,
  onValidationTdbChange,
  defaultSelectedRegionCode,
}) => {
  return (
    <Page>
      <PageHeader title="Référentiel des organismes de formation" />

      <PageContent>
        <Stack spacing="4w">
          {regionsData && (
            <Box background="bluegrey.200" padding="4w" width="100%">
              <Stack spacing="2w">
                {/* Filtre Régions */}
                <HStack>
                  <Text>
                    <i className="ri-map-pin-2-fill"></i>
                  </Text>
                  <Text>Région :</Text>
                  <Select
                    defaultValue={defaultSelectedRegionCode}
                    onChange={(e) => onRegionChange(e.target.value)}
                    width="30%"
                  >
                    {regionsData.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.nom}
                      </option>
                    ))}
                  </Select>
                </HStack>

                {/* Filtre Branchement */}
                <HStack>
                  <Text>
                    <i className="ri-plug-line"></i>
                  </Text>
                  <Text>Branchement des données : </Text>
                  <Select defaultValue={-1} onChange={(e) => onConnectionChange(e.target.value)} width="30%">
                    <option value={-1}>-- Peu importe --</option>
                    <option value={1}>Avec branchement des données</option>
                    <option value={0}>Sans branchement des données</option>
                  </Select>
                </HStack>

                {/* Filtre Validation */}
                <HStack>
                  <Text>
                    <i className="ri-checkbox-multiple-fill"></i>
                  </Text>
                  <Text>Validation des données : </Text>
                  <Select defaultValue={-1} onChange={(e) => onValidationTdbChange(e.target.value)} width="30%">
                    <option value={-1}>-- Peu importe --</option>
                    <option value={1}>Données validées</option>
                    <option value={0}>Données non validées</option>
                    <option value={2}>En attente de validation</option>
                  </Select>
                </HStack>
              </Stack>
            </Box>
          )}

          {/* Error */}
          {error && (
            <Text>
              <p>Erreur lors du chargement des organismes de formation Référentiels</p>
            </Text>
          )}

          {/* Loading */}
          {loading && (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Nom de l&apos;organisme de formation</Th>
                  <Th>SIRET</Th>
                  <Th>UAI</Th>
                  <Th>Region</Th>
                  <Th>Branchement Tdb</Th>
                  <Th>Validation Tdb</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array.from(Array(10), (e, i) => {
                  return (
                    <Tr key={i}>
                      <Td>
                        <Skeleton height="20px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" />
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          )}

          {/* Data */}
          {data && !error && !loading && (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Nom de l&apos;organisme de formation</Th>
                  <Th>SIRET</Th>
                  <Th>UAI</Th>
                  <Th>Region</Th>
                  <Th>Branchement Tdb</Th>
                  <Th>Validation Tdb</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.cfas.map((cfa) => (
                  <Tr key={cfa._id}>
                    <Td>{cfa.nom}</Td>
                    <Td>{cfa.siret}</Td>
                    <Td>{cfa.uai}</Td>
                    <Td>{cfa.region_nom}</Td>
                    <Td>
                      {cfa.branchement_flux_cfa_erp ? (
                        <Tag colorScheme="green">
                          <i className="ri-thumb-up-line"></i>
                        </Tag>
                      ) : (
                        <Tag colorScheme="red">
                          <i className="ri-close-circle-line"></i>
                        </Tag>
                      )}
                    </Td>
                    <Td>
                      {cfa.feedback_donnee_valide === null ? (
                        <Tag>
                          <i className="ri-question-fill"></i>
                        </Tag>
                      ) : cfa.feedback_donnee_valide ? (
                        <Tag colorScheme="green">
                          <i className="ri-thumb-up-line"></i>
                        </Tag>
                      ) : (
                        <Tag colorScheme="red">
                          <i className="ri-close-circle-line"></i>
                        </Tag>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              <TableCaption>
                <Pagination
                  pagesQuantity={data.pagination.nombre_de_page}
                  currentPage={data.pagination.page}
                  changePageHandler={(data) => _fetch(data)}
                />
              </TableCaption>
            </Table>
          )}
        </Stack>
      </PageContent>
    </Page>
  );
};

CfasReferentielPage.propTypes = {
  data: PropTypes.object,
  regionsData: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      nom: PropTypes.string.isRequired,
    })
  ),
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  _fetch: PropTypes.func.isRequired,
  onConnectionChange: PropTypes.func.isRequired,
  onRegionChange: PropTypes.func.isRequired,
  onValidationTdbChange: PropTypes.func.isRequired,
  defaultSelectedRegionCode: PropTypes.string.isRequired,
};

export default withCfasReferentielData(CfasReferentielPage);
