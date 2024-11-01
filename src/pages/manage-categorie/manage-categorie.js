import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  UncontrolledTooltip,
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
import SuspenseImage from "../../components/SuspenseImage/ImageComponent"

const ManageCategorie = () => {
  // Set meta title
  document.title = "Manage Categorie"

  const [selectedImage, setSelectedImage] = useState(null)
  const [img, setImg] = useState(null)
  const [imgUser, setImgUser] = useState(null)
  const [loader, setLoader] = useState(false)

  const handleImageChange = e => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      setImg(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
        validation.setFieldValue("projectImage", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Form validation using Formik and Yup
  const validation = useFormik({
    initialValues: {
      taglineCategorie: "",
      titleCategorie: "",
      categorieDescription: "",
      projectImage: "",
    },
    validationSchema: Yup.object({
      taglineCategorie: Yup.string().required("Please Enter Tagline"),
      titleCategorie: Yup.string().required("Please Enter Title"),
      categorieDescription: Yup.string().required("Please Enter Description"),
      projectImage: Yup.string().required("Please Select Image"),
    }),
    onSubmit: async values => {
      try {
        setLoader(true)

        const payload = {
          tagline: values.taglineCategorie,
          title: values.titleCategorie,
          description: values.categorieDescription,
        }

        if (img) payload.bg = img
        if (imgUser) payload.categoriesUser = imgUser

        const response = await axios.post(
          `${process.env.REACT_APP_DATABASEURL}/categories-section/create`,
          payload,
          { headers: { "Content-Type": "multipart/form-data" } }
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

  // Fetch default categories data
  const fetchDefaultOnes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/categories-section/find-all`
      )

      if (response.data.length > 0) {
        const data = response.data[0]
        validation.setFieldValue("taglineCategorie", data.tagline)
        validation.setFieldValue("titleCategorie", data.title)
        validation.setFieldValue("categorieDescription", data.description)
        validation.setFieldValue("projectImage", data.bg)

        if (data.bg) {
          setSelectedImage(data.bg)
          setImg(data.bg)
        }
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
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Section" breadcrumbItem="Categorie" />
          <Form
            id="createproject-form"
            onSubmit={e => {
              e.preventDefault()
              validation.handleSubmit()
              return false
            }}
          >
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <div className="mb-3">
                      <Label className="form-label">Categorie Background</Label>
                      <div className="text-center">
                        <div className="position-relative d-inline-block">
                          <div className="position-absolute bottom-0 end-0">
                            <Label
                              htmlFor="project-image-input"
                              className="mb-0"
                              id="projectImageInput"
                            >
                              <div className="avatar-xs">
                                <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">
                                  <i className="bx bxs-image-alt"></i>
                                </div>
                              </div>
                            </Label>
                            <UncontrolledTooltip
                              placement="right"
                              target="projectImageInput"
                            >
                              Select Image
                            </UncontrolledTooltip>
                            <input
                              className="form-control d-none"
                              id="project-image-input"
                              type="file"
                              accept="image/png, image/gif, image/jpeg"
                              onChange={handleImageChange}
                            />
                          </div>
                          <div
                            className="avatar-lg"
                            style={{
                              height: "250px",
                              width: "450px",
                            }}
                          >
                            <div className="avatar-title bg-light">
                              {selectedImage && (
                                <SuspenseImage
                                  src={selectedImage || ""}
                                  id="projectlogo-img"
                                  alt=""
                                  className="avatar-md"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "cover",
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        {validation.touched.projectImage &&
                        validation.errors.projectImage ? (
                          <FormFeedback type="invalid" className="d-block">
                            {validation.errors.projectImage}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </div>

                    {/* Tagline and Title */}
                    <div className="d-flex">
                      <div className="mb-3 me-2 flex-grow-1">
                        <Label htmlFor="taglineCategorie-input">Tagline</Label>
                        <Input
                          id="taglineCategorie"
                          name="taglineCategorie"
                          type="text"
                          placeholder="Enter Tagline Categorie..."
                          onChange={validation.handleChange}
                          value={validation.values.taglineCategorie || ""}
                          onBlur={validation.handleBlur}
                        />
                        {validation.touched.taglineCategorie &&
                        validation.errors.taglineCategorie ? (
                          <FormFeedback type="invalid" className="d-block">
                            {validation.errors.taglineCategorie}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3 ms-2 flex-grow-1">
                        <Label htmlFor="titleCategorie-input">Title</Label>
                        <Input
                          id="titleCategorie"
                          name="titleCategorie"
                          type="text"
                          placeholder="Enter Title Categorie..."
                          onChange={validation.handleChange}
                          value={validation.values.titleCategorie || ""}
                          onBlur={validation.handleBlur}
                        />
                        {validation.touched.titleCategorie &&
                        validation.errors.titleCategorie ? (
                          <FormFeedback type="invalid" className="d-block">
                            {validation.errors.titleCategorie}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="categorieDescription-input">
                        Description
                      </Label>
                      <Input
                        as="textarea"
                        id="categorieDescription"
                        type="textarea"
                        rows={4}
                        name="categorieDescription"
                        placeholder="Enter Description Categorie..."
                        onChange={validation.handleChange}
                        value={validation.values.categorieDescription || ""}
                        onBlur={validation.handleBlur}
                      />
                      {validation.touched.categorieDescription &&
                      validation.errors.categorieDescription ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.categorieDescription}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* Submit Button */}
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

export default ManageCategorie
