import React, { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Input,
  FormFeedback,
  Button,
  Form,
} from "reactstrap"
import { toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
const CreateSubscription = () => {
  document.title = "Create New Subscription"

  const [loader, setLoader] = useState(false)
  const [subscriptionPrivacy, setSubscriptionPrivacy] = useState(false)
  const [token, setToken] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("authUser")
    if (token) {
      setToken(token.replace(/"/g, ""))
    }
  }, [])

  const validation = useFormik({
    initialValues: {
      subscriptionTitle: "",
      subscriptionDescription: "",
      subscriptionPrice: "",
      subscriptionDuration: "",
    },
    validationSchema: Yup.object({
      subscriptionTitle: Yup.string().required("Title is required"),
      subscriptionDescription: Yup.string().required("Description is required"),
      subscriptionPrice: Yup.number()
        .typeError("Price must be a number")
        .required("Price is required"),
      subscriptionDuration: Yup.number()
        .typeError("Duration must be a number")
        .required("Duration is required"),
    }),
    onSubmit: async values => {
      try {
        setLoader(true)
        const response = await axios.post(
          `${process.env.REACT_APP_DATABASEURL}/subscription/create`,
          {
            title: values.subscriptionTitle,
            description: values.subscriptionDescription,
            price: Number(values.subscriptionPrice),
            duration: Number(values.subscriptionDuration),
          },
          {
            headers: {
              token: token,
            },
          }
        )
        if (response.data) {
          validation.resetForm()
          toast.success("🎉 Subscription Created Successfully")
          setLoader(false)
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
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
          <Breadcrumbs title="Subscriptions" breadcrumbItem="Create New" />
          <Form
            id="createcoach-form"
            onSubmit={e => {
              e.preventDefault()
              validation.handleSubmit()
            }}
          >
            <Row className="justify-content-center">
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <div className="mb-3">
                      <Label htmlFor="subscriptionTitle-input">
                        Subscription Title
                      </Label>
                      <Input
                        id="subscriptionTitle"
                        name="subscriptionTitle"
                        type="text"
                        placeholder="Enter Subscription Title..."
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.subscriptionTitle || ""}
                      />
                      {validation.touched.subscriptionTitle &&
                      validation.errors.subscriptionTitle ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.subscriptionTitle}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="subscriptionDescription-input">
                        Subscription Description
                      </Label>
                      <Input
                        id="subscriptionDescription"
                        name="subscriptionDescription"
                        type="textarea"
                        placeholder="Enter Subscription Description..."
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.subscriptionDescription || ""}
                      />
                      {validation.touched.subscriptionDescription &&
                      validation.errors.subscriptionDescription ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.subscriptionDescription}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="subscriptionPrice-input">
                        Subscription Price
                      </Label>
                      <Input
                        id="subscriptionPrice"
                        name="subscriptionPrice"
                        type="number"
                        placeholder="Enter Subscription Price..."
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.subscriptionPrice || ""}
                      />
                      {validation.touched.subscriptionPrice &&
                      validation.errors.subscriptionPrice ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.subscriptionPrice}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="subscriptionDuration-input">
                        Subscription Duration (in Months)
                      </Label>
                      <Input
                        id="subscriptionDuration"
                        name="subscriptionDuration"
                        type="number"
                        placeholder="Enter Duration in Months..."
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.subscriptionDuration || ""}
                      />
                      {validation.touched.subscriptionDuration &&
                      validation.errors.subscriptionDuration ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.subscriptionDuration}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
                <div className="text-end mb-4">
                  <Button type="submit" color="primary" disabled={loader}>
                    {loader ? "Creating..." : "Create Subscription"}
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

export default CreateSubscription
