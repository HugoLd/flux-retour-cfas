import React from "react";
import { Page, Grid, Alert, Header } from "tabler-react";
import LayoutUser from "./layout/LayoutUser";

export default () => {
  return (
    <LayoutUser>
      <Page>
        <Page.Main>
          <Page.Content>
            <Grid.Row>
              <Grid.Col width={12}>
                <Alert type="warning">
                  <Header.H1>Accueil</Header.H1>
                  <p>Page d'accueil utilisateur.</p>
                </Alert>
              </Grid.Col>
            </Grid.Row>
          </Page.Content>
        </Page.Main>
      </Page>
    </LayoutUser>
  );
};
