import { Box, Heading, Link, Stack } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";

import { Page, Section } from "../../common/components";
import { navigationPages } from "../../common/constants/navigationPages";
import Question from "./Question";

const questions = [
  {
    question: "Est-ce que les données de votre organisme s'affichent sur le Tableau de bord ?",
    answer:
      "Les données de votre organisme s'affichent si vous avez autorisé votre ERP (ou logiciel de gestion) à transmettre vos données au Tableau de bord de l'apprentissage. Ceci concerne les clients de SC Form, Ymag, Gestibase ou FCA Manager.",
  },
  {
    question: "Qui peut consulter les données de votre organisme ?",
    answer: [
      "Les personnes autorisées à consulter les données de votre organisme sont les institutions (Conseil régional, Rectorat et DREETS), les organisations professionnelles et le Carif Oref de votre région. Si vous êtes membre d'un réseau, la tête de votre réseau peut également consulter votre page.",
      // eslint-disable-next-line react/jsx-key
      <Link to={navigationPages.ComprendreLesDonnees.path} as={NavLink} color="bluefrance">
        Comprendre les données
      </Link>,
    ],
  },
  {
    question: "Pourquoi transmettre les données de votre organisme au Tableau de bord ?",
    answer:
      "Différentes institutions (Conseil régional, DREETS, Opco, Carif Oref, Rectorat, DGEFP) consultent le Tableau de Bord de l'Apprentissage quotidiennement pour suivre l'évolution des effectifs. Ces données les éclairent notamment pour évaluer les montants des aides aux organismes de formation et pour mettre en place des plans d'actions ou pour définir les politiques publiques d'aide à l'apprentissage.",
  },
];

const SupportPage = () => {
  return (
    <Page>
      <Box color="grey.800">
        <Section backgroundColor="galt" paddingY="8w" withShadow>
          <Heading as="h1" variant="h1" marginBottom="1w">
            {navigationPages.Support.title}
          </Heading>
        </Section>
        <Section paddingY="4w">
          <Stack spacing="3w">
            {questions.map(({ question, answer }, index) => {
              return <Question key={index} question={question} answer={answer} />;
            })}
          </Stack>
        </Section>
      </Box>
    </Page>
  );
};

export default SupportPage;
