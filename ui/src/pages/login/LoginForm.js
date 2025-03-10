import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Text } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import PropTypes from "prop-types";
import React from "react";
import * as Yup from "yup";

const formValidationSchema = Yup.object().shape({
  username: Yup.string().required("Requis"),
  password: Yup.string().required("Requis"),
});

const LoginForm = ({ onSubmit }) => {
  return (
    <Formik initialValues={{ username: "", password: "" }} validationSchema={formValidationSchema} onSubmit={onSubmit}>
      {({ status = {} }) => {
        return (
          <Form>
            <Box marginBottom="2w">
              <Field name="username">
                {({ field, meta }) => (
                  <FormControl isRequired isInvalid={meta.error && meta.touched} marginBottom="2w">
                    <FormLabel color="grey.800">identifiant</FormLabel>
                    <Input {...field} id={field.name} placeholder="Votre identifiant..." />
                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password">
                {({ field, meta }) => {
                  return (
                    <FormControl isRequired isInvalid={meta.error && meta.touched} marginBottom="2w">
                      <FormLabel color="grey.800">mot de passe</FormLabel>
                      <Input {...field} id={field.name} type="password" placeholder="Votre mot de passe..." />
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  );
                }}
              </Field>
            </Box>
            <Button variant="primary" type="submit" width="full">
              Se connecter au Tableau de Bord
            </Button>
            {status.error && <Text color="error">{status.error}</Text>}
          </Form>
        );
      }}
    </Formik>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default LoginForm;
