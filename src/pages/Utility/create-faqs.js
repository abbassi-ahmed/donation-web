import React, { useState } from "react"
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap"
import { toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import * as Yup from "yup"
import { useFormik } from "formik"
import axios from "axios"

const CreateFaq = () => {
  document.title = "Create New Faq"

  const [loader, setLoader] = useState(false)

  const validation = useFormik({
    initialValues: {
      faqQuestion: "",
      faqAnswer: "",
      faqType: "",
    },
    validationSchema: Yup.object({
      faqQuestion: Yup.string().required("Question is required"),
      faqAnswer: Yup.string().required("Answer is required"),
      faqType: Yup.string().required("Type is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoader(true)
        const response = await axios.post(
          process.env.REACT_APP_DATABASEURL + "/faq/create",
          {
            question: values.faqQuestion,
            answer: values.faqAnswer,
            type: values.faqType,
          }
        )
        if (response.data) {
          resetForm()
          toast.success("🎉 Faq Created Successfully")
        }
      } catch (error) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message)
        }
      } finally {
        setLoader(false)
      }
    },
  })

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Faq" breadcrumbItem="Create New" />
          <Form
            id="createFaq-form"
            onSubmit={validation.handleSubmit} // Pass handleSubmit directly
          >
            <Row className="justify-content-center">
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <div className="mb-3">
                      <Label htmlFor="faqQuestion">Question</Label>
                      <Input
                        type="text"
                        id="faqQuestion"
                        name="faqQuestion"
                        className="form-control"
                        placeholder="Enter Question"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.faqQuestion || ""}
                      />
                      {validation.touched.faqQuestion &&
                        validation.errors.faqQuestion && (
                          <FormFeedback type="invalid" className="d-block">
                            {validation.errors.faqQuestion}
                          </FormFeedback>
                        )}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="faqAnswer">Answer</Label>
                      <Input
                        type="textarea"
                        id="faqAnswer"
                        name="faqAnswer"
                        className="form-control"
                        placeholder="Enter Answer"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.faqAnswer || ""}
                      />
                      {validation.touched.faqAnswer &&
                        validation.errors.faqAnswer && (
                          <FormFeedback type="invalid" className="d-block">
                            {validation.errors.faqAnswer}
                          </FormFeedback>
                        )}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="faqType">Type</Label>
                      <Input
                        type="select"
                        id="faqType"
                        name="faqType"
                        className="form-control"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.faqType || ""}
                      >
                        <option value="">Select Type</option>
                        <option value="General">General</option>
                        <option value="Support">Support</option>
                      </Input>
                      {validation.touched.faqType &&
                        validation.errors.faqType && (
                          <FormFeedback type="invalid" className="d-block">
                            {validation.errors.faqType}
                          </FormFeedback>
                        )}
                    </div>
                  </CardBody>
                </Card>
                <div className="text-end mb-4">
                  <Button type="submit" color="primary" disabled={loader}>
                    {loader ? "Loading..." : "Create Faq"}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default CreateFaq
