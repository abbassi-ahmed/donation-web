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
import ListPoints from "./listPoints"
import SuspenseImage from "../../components/SuspenseImage/ImageComponent"

const ManageWhyChoose = () => {
  //meta title
  document.title = "Manage why choose section"

  const [loader, setLoader] = useState(false)
  const [selectedImage1, setSelectedImage1] = useState(null)
  const [img1, setImg1] = useState(null)
  const [selectedImage2, setSelectedImage2] = useState(null)
  const [img2, setImg2] = useState(null)
  const [listPoints, setListPoints] = useState(
    Array(3).fill({ title: "", text: "" })
  )

  const handleAddPoint = () => {
    setListPoints([...listPoints, { title: "", text: "" }])
  }

  const handleRemovePoint = indexToRemove => {
    if (listPoints.length > 3) {
      setListPoints(listPoints.filter((_, index) => index !== indexToRemove))
    }
  }
  const handleImageChange1 = e => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      setImg1(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage1(reader.result)
        validation.setFieldValue("img1", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageChange2 = e => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      setImg2(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage2(reader.result)
        validation.setFieldValue("img2", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validation = useFormik({
    initialValues: {
      title: "",
      img1: "",
      img2: "",
      tagline: "",
      title2: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Title"),
      img1: Yup.string().required("Please Select Image 1"),
      img2: Yup.string().required("Please Select Image 2"),
      tagline: Yup.string().required("Please Enter Tagline"),
      title2: Yup.string().required("Please Enter Title Right"),
    }),
    onSubmit: async values => {
      try {
        const filledPoints = listPoints.filter(
          listPoint => listPoint.title && listPoint.text
        )

        if (filledPoints.length < 3) {
          toast.error(
            "Please ensure at least 3 points are filled out with a title and text."
          )
          return
        }

        setLoader(true)
        const payload = {
          title: values.title,
          thumb: img1,
          thumb2: img2,
          tagline: values.tagline,
          title2: values.title2,
          items: listPoints,
        }

        const response = await axios.post(
          process.env.REACT_APP_DATABASEURL + "/why-choose-section/create",
          payload,
          { headers: { "Content-Type": "multipart/form-data" } }
        )

        if (response.data) {
          fetchDefaultOnes()
          toast.success("🎉 Why Choose Section Updated Successfully")
        }
      } catch (error) {
        console.error("error", error)
      } finally {
        setLoader(false)
      }
    },
  })

  const fetchDefaultOnes = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DATABASEURL + "/why-choose-section/find-all"
      )
      if (response.data) {
        const data = response.data
        const defaultOne = data[0]
        validation.setFieldValue("title", defaultOne.title)
        validation.setFieldValue("tagline", defaultOne.tagline)
        validation.setFieldValue("title2", defaultOne.title2)
        setSelectedImage1(defaultOne.thumb)
        setSelectedImage2(defaultOne.thumb2)
        setListPoints(defaultOne.items)
      }
    } catch (error) {
      console.error("error", error)
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
          <Breadcrumbs title="Section" breadcrumbItem="Why Choose" />
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
                      <Label htmlFor="title-input">Title</Label>
                      <Input
                        type="text"
                        id="titleWhyChoose"
                        name="title"
                        placeholder="Enter Title Why Choose..."
                        onChange={validation.handleChange}
                        value={validation.values.title}
                        onBlur={validation.handleBlur}
                      />
                      {validation.touched.title && validation.errors.title ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.title}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <Container>
                      <Row>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label className="form-label">Picture Left</Label>
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
                                    Select Image Left
                                  </UncontrolledTooltip>
                                  <input
                                    className="form-control d-none"
                                    id="project-image-input"
                                    type="file"
                                    accept="image/png, image/gif, image/jpeg"
                                    onChange={handleImageChange1}
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
                                    {selectedImage1 ? (
                                      <SuspenseImage
                                        src={selectedImage1 || ""}
                                        id="projectlogo-img"
                                        alt=""
                                        loading="lazy"
                                        className="avatar-md"
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          backgroundRepeat: "no-repeat",
                                          backgroundPosition: "center",
                                          backgroundSize: "cover",
                                        }}
                                      />
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                              {validation.touched.img1 &&
                              validation.errors.img1 ? (
                                <FormFeedback
                                  type="invalid"
                                  className="d-block"
                                >
                                  {validation.errors.img1}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </div>
                        </Col>

                        <Col lg={6}>
                          <div className="mb-3">
                            <Label className="form-label">Picture Right</Label>
                            <div className="text-center">
                              <div className="position-relative d-inline-block">
                                <div className="position-absolute bottom-0 end-0">
                                  <Label
                                    htmlFor="picture-right-input"
                                    className="mb-0"
                                    id="pictureRightInput"
                                  >
                                    <div className="avatar-xs">
                                      <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">
                                        <i className="bx bxs-image-alt"></i>
                                      </div>
                                    </div>
                                  </Label>
                                  <UncontrolledTooltip
                                    placement="right"
                                    target="pictureRightInput"
                                  >
                                    Select Image Right
                                  </UncontrolledTooltip>
                                  <input
                                    className="form-control d-none"
                                    id="picture-right-input"
                                    type="file"
                                    accept="image/png, image/gif, image/jpeg"
                                    onChange={handleImageChange2}
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
                                    {selectedImage2 ? (
                                      <SuspenseImage
                                        src={selectedImage2 || ""}
                                        id="user-pic-img"
                                        alt=""
                                        loading="lazy"
                                        className="avatar-md"
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          backgroundRepeat: "no-repeat",
                                          backgroundPosition: "center",
                                          backgroundSize: "cover",
                                        }}
                                      />
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                              {validation.touched.img2 &&
                              validation.errors.img2 ? (
                                <FormFeedback
                                  type="invalid"
                                  className="d-block"
                                >
                                  {validation.errors.img2}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label htmlFor="tagline-input">Tagline</Label>
                            <Input
                              type="text"
                              id="taglineWhyChoose"
                              name="tagline"
                              placeholder="Enter Tagline Why Choose..."
                              onChange={validation.handleChange}
                              value={validation.values.tagline}
                              onBlur={validation.handleBlur}
                            />
                            {validation.touched.tagline &&
                            validation.errors.tagline ? (
                              <FormFeedback type="invalid" className="d-block">
                                {validation.errors.tagline}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label htmlFor="title2-input">Title Right</Label>
                            <Input
                              type="text"
                              id="title2WhyChoose"
                              name="title2"
                              placeholder="Enter Title Right..."
                              onChange={validation.handleChange}
                              value={validation.values.title2}
                              onBlur={validation.handleBlur}
                            />
                            {validation.touched.title2 &&
                            validation.errors.title2 ? (
                              <FormFeedback type="invalid" className="d-block">
                                {validation.errors.title2}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                      </Row>
                      <div className="mb-3 text-center font-size-16 ">
                        <h1>List Points </h1>
                      </div>
                      <>
                        <Row>
                          {listPoints.map((_, index) => (
                            <Col md={12} key={index} className="mb-4">
                              <div
                                style={{
                                  width: "100%",
                                  height: "1px",
                                  backgroundColor: "#e9e9e9",
                                }}
                                className="mb-5"
                              ></div>
                              <ListPoints
                                index={index}
                                listPoints={listPoints}
                                setListPoints={setListPoints}
                              />
                              {listPoints.length > 3 && (
                                <Button
                                  color="danger"
                                  onClick={() => handleRemovePoint(index)}
                                  className="mt-3"
                                >
                                  Remove
                                </Button>
                              )}
                            </Col>
                          ))}
                        </Row>
                        <div className="mb-3 text-center font-size-16 ">
                          <Button color="primary" onClick={handleAddPoint}>
                            Add Point
                          </Button>
                        </div>
                      </>
                    </Container>
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
                    id="add-btn"
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

export default ManageWhyChoose
