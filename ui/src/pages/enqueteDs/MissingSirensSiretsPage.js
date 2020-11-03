import React from "react";
import { Page, Site, Nav, Grid, Header, Alert, StampCard } from "tabler-react";
import { useFetch } from "../../common/hooks/useFetch";
import Layout from "../layout/Layout";

export default () => {
  const [data, loading] = useFetch("api/statsDs");

  return (
    <Layout>
      <Page>
        <Page.Main>
          <Page.Content title="Enquete Ds - Sirens & Sirets manquants">
            {loading && "Chargement des données..."}
            {data && (
              <>
                {/* Sirets manquants */}
                <Header.H5>Sirets & Sirens manquants</Header.H5>
                <Grid.Row cards={true}>
                  <Grid.Col sm={6} lg={6}>
                    {getDataTable("Sirets Manquants", data.missingSirets)}
                  </Grid.Col>
                  <Grid.Col sm={6} lg={6}>
                    {getDataTable("Sirens Manquants", data.missingSirens)}
                  </Grid.Col>
                </Grid.Row>
              </>
            )}
          </Page.Content>
        </Page.Main>
      </Page>
    </Layout>
  );
};

const getDataTable = (title, data) => (
  <div class="card">
    <div class="card-header">
      <h2 class="card-title">{title}</h2>
    </div>
    <table class="table card-table">
      <tbody>
        {data.map((item) => (
          <tr key={item}>
            <td>{item}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
