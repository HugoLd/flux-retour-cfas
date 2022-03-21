import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";

import { Footer, Header, Section } from "../../../common/components";
import BreadcrumbNav from "../../../common/components/BreadcrumbNav/BreadcrumbNav";
import { NAVIGATION_PAGES } from "../../../common/constants/navigationPages";
import TransmettreVosDonneesFormBlock from "./TransmettreVosDonneesFormBlock";

const TransmettreVosDonneesPage = () => {
  return (
    <>
      <Header />
      <Section backgroundColor="galt" paddingY="4w" boxShadow="inset 0px 12px 12px 0px rgba(30, 30, 30, 0.06)">
        <Box width="50%">
          <BreadcrumbNav
            links={[
              NAVIGATION_PAGES.Accueil,
              NAVIGATION_PAGES.TransmettreEtConsulterVosDonnees,
              NAVIGATION_PAGES.TransmettreVosDonnees,
            ]}
          />
          <Heading paddingTop="5w" as="h1" variant="h1" marginBottom="1w">
            {NAVIGATION_PAGES.TransmettreVosDonnees.title}
          </Heading>
          <Text marginBottom="2w" color="black">
            Afin de mieux vous guider, merci de renseigner le formulaire ci dessous :
          </Text>
          <Box padding="4w" background="white" borderColor="bluefrance" border="1px solid" minWidth="420px">
            <TransmettreVosDonneesFormBlock />
          </Box>
        </Box>
      </Section>
      <Footer />
    </>
  );
};

export default TransmettreVosDonneesPage;
