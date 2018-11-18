import { Button, Form } from "semantic-ui-react";
import { Formik, Field } from "formik";
import { Mutation } from "react-apollo";

import { InputField } from "../components/formik-fields/InputField";
import { ErrorMessage } from "../components/ErrorMessage";
import { normalizeErrors } from "../utils/normalizeErrors";
import {
  CreateCodeReviewRequestMutation,
  CreateCodeReviewRequestMutationVariables
} from "../lib/schema-types";
import Layout from "../components/Layout";
import { TextAreaField } from "../components/formik-fields/TextAreaField";
import { createCodeReviewRequestMutation } from "../graphql/code-review-request/mutation/createCodeReviewRequest";

interface FormValues {
  numDays: number;
  codeUrl: string;
  techTags: string[];
  notes: string;
}

export default () => (
  <Layout title="create code review request">
    <Mutation<
      CreateCodeReviewRequestMutation,
      CreateCodeReviewRequestMutationVariables
    >
      mutation={createCodeReviewRequestMutation}
    >
      {mutate => (
        <Formik<FormValues>
          initialValues={{ numDays: 3, codeUrl: "", techTags: [], notes: "" }}
          onSubmit={async (input, { setErrors, setSubmitting }) => {
            const response = await mutate({
              variables: { input }
            });

            if (
              response &&
              response.data &&
              response.data.createCodeReviewRequest.errors &&
              response.data.createCodeReviewRequest.errors.length
            ) {
              setSubmitting(false);
              return setErrors(
                normalizeErrors(response.data.createCodeReviewRequest.errors)
              );
            } else {
              setSubmitting(false);
              console.log(response);
              console.log("create code review success");
            }
          }}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ errors, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Field
                name="numDays"
                label="Number of days"
                placeholder="Number of days"
                component={InputField}
              />
              <Field
                name="codeUrl"
                label="Github Url"
                placeholder="Github Url"
                component={InputField}
              />
              <Field
                name="notes"
                label="Notes"
                placeholder="Notes"
                component={TextAreaField}
              />
              <ErrorMessage errors={errors as any} />
              <Button disabled={isSubmitting} type="submit">
                Create Code Review Request
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Mutation>
  </Layout>
);
