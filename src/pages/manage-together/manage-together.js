import React, { useState, useEffect } from "react"
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
import "flatpickr/dist/themes/material_blue.css"
import * as Yup from "yup"
import { useFormik } from "formik"
import axios from "axios"

const ManageTogether = () => {
  // Set meta title
  document.title = "Manage Information"

  const [loader, setLoader] = useState(false)

  const validation = useFormik({
    initialValues: {
      taglineTogether: "",
      titleTogether: "",
    },
    validationSchema: Yup.object({
      taglineTogether: Yup.string().required("Please Enter Tagline"),
      titleTogether: Yup.string().required("Please Enter Title"),
    }),
    onSubmit: async values => {
      try {
        setLoader(true)

        const response = await axios.post(
          `${process.env.REACT_APP_DATABASEURL}/together-area/create`,
          {
            title: values.titleTogether,
            tagline: values.taglineTogether,
          }
        )

        if (response.data) {
          fetchDefaultOnes()
          toast.success("🎉 Project Created Successfully")
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoader(false)
      }
    },
  })

  // Fetch default Togethers data
  const fetchDefaultOnes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/together-area/find-all`
      )

      if (response.data.length > 0) {
        const data = response.data[0]
        validation.setFieldValue("taglineTogether", data.tagline)
        validation.setFieldValue("titleTogether", data.title)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  useEffect(() => {
    fetchDefaultOnes()
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Page Header */}
          <Breadcrumbs title="Section" breadcrumbItem="Informations" />

          {/* Form Section */}
          <Form
            id="createproject-form"
            onSubmit={e => {
              e.preventDefault()
              validation.handleSubmit()
              return false
            }}
          >
            <Row>
              <Col lg={12} className="mx-auto">
                <Card>
                  <CardBody>
                    <div className="mb-3">
                      <Label
                        htmlFor="taglineTogether-input"
                        className="form-label"
                      >
                        <i className="bi bi-pencil-square me-2"></i> Tagline
                      </Label>
                      <Input
                        id="taglineTogether"
                        name="taglineTogether"
                        type="text"
                        placeholder="Enter Tagline Together..."
                        onChange={validation.handleChange}
                        value={validation.values.taglineTogether || ""}
                        onBlur={validation.handleBlur}
                      />
                      {validation.touched.taglineTogether &&
                      validation.errors.taglineTogether ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.taglineTogether}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label
                        htmlFor="titleTogether-input"
                        className="form-label"
                      >
                        <i className="bi bi-fonts me-2"></i> Title
                      </Label>
                      <Input
                        id="titleTogether"
                        name="titleTogether"
                        type="text"
                        placeholder="Enter Title Together..."
                        onChange={validation.handleChange}
                        value={validation.values.titleTogether || ""}
                        onBlur={validation.handleBlur}
                      />
                      {validation.touched.titleTogether &&
                      validation.errors.titleTogether ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.titleTogether}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col lg={12}>
                <div className="hstack gap-2 justify-content-end">
                  <Button
                    type="submit"
                    color="primary"
                    className="btn btn-primary"
                    disabled={loader}
                  >
                    {loader ? "Saving..." : "Save Changes"}
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

export default ManageTogether
