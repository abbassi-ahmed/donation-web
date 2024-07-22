import React, { useEffect, useState } from "react"
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
  UncontrolledTooltip,
} from "reactstrap"
import { toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import * as Yup from "yup"
import { useFormik } from "formik"
import axios from "axios"
import Switch from "@mui/material/Switch"

const CreateFaq = () => {
  document.title = "Create New Faq"

  const [loader, setLoader] = useState(false)
  const [blogPrivacy, setBlogPrivacy] = useState(false)

  const validation = useFormik({
    initialValues: {
      faqQuestion: "",
      faqAnswer: "",
    },
    validationSchema: Yup.object({
      faqQuestion: Yup.string().required("Question is required"),
      faqAnswer: Yup.string().required("Answer is required"),
    }),
    onSubmit: async values => {
      try {
        setLoader(true)
        const response = await axios.post(
          process.env.REACT_APP_DATABASEURL + "/faq/create",
          {
            question: values.faqQuestion,
            answer: values.faqAnswer,
          }
        )
        if (response.data) {
          validation.resetForm()
          toast.success("🎉 Faq Created Successfully")
          setLoader(false)
        }
      } catch (error) {
        if (error.response.data.message) {
          toast.error(error.response.data.message)
        }
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
            onSubmit={e => {
              e.preventDefault()
              validation.handleSubmit()
            }}
          >
            <Row className="justify-content-center">
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <input
                      type="hidden"
                      className="form-control"
                      id="formAction"
                      name="formAction"
                      defaultValue="add"
                    />
                    <input
                      type="hidden"
                      className="form-control"
                      id="coach-id-input"
                    />
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
                  </CardBody>
                </Card>
                <div className="text-end mb-4">
                  <Button type="submit" color="primary" disabled={loader}>
                    Create Faq
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
