import React, { useState } from "react"
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
import FlatPickr from "react-flatpickr"
import * as Yup from "yup"
import { useFormik } from "formik"
import axios from "axios"

const ManageCategorie = () => {
  //meta title
  document.title = "Manage Categorie"

  const [selectedImage, setSelectedImage] = useState(null)
  const [img, setImg] = useState(null)
  const [selectedUserPic, setSelectedUserPic] = useState(null)
  const [imgUser, setImgUser] = useState(null)
  const [loader, setLoader] = useState(false)

  const [cardImage1, setCardImage1] = useState(null)
  const [cardImage2, setCardImage2] = useState(null)
  const [cardImage3, setCardImage3] = useState(null)
  const [cardImage4, setCardImage4] = useState(null)
  const [cardImage5, setCardImage5] = useState(null)
  const [cardImage6, setCardImage6] = useState(null)

  const [cardTitle1, setCardTitle1] = useState("")
  const [cardTitle2, setCardTitle2] = useState("")
  const [cardTitle3, setCardTitle3] = useState("")
  const [cardTitle4, setCardTitle4] = useState("")
  const [cardTitle5, setCardTitle5] = useState("")
  const [cardTitle6, setCardTitle6] = useState("")

  const handleCardChange = (e, card) => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      if (card === 1) {
        setCardImage1(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setCardTitle1(reader.result)
          validation.setFieldValue("cardImage1", reader.result)
        }
        reader.readAsDataURL(file)
      } else if (card === 2) {
        setCardImage2(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setCardTitle2(reader.result)
          validation.setFieldValue("cardImage2", reader.result)
        }
        reader.readAsDataURL(file)
      } else if (card === 3) {
        setCardImage3(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setCardTitle3(reader.result)
          validation.setFieldValue("cardImage3", reader.result)
        }
        reader.readAsDataURL(file)
      } else if (card === 4) {
        setCardImage4(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setCardTitle4(reader.result)
          validation.setFieldValue("cardImage4", reader.result)
        }
        reader.readAsDataURL(file)
      } else if (card === 5) {
        setCardImage5(file)

        const reader = new FileReader()
        reader.onloadend = () => {
          setCardTitle5(reader.result)
          validation.setFieldValue("cardImage5", reader.result)
        }
        reader.readAsDataURL(file)
      } else if (card === 6) {
        setCardImage6(file)

        const reader = new FileReader()
        reader.onloadend = () => {
          setCardTitle6(reader.result)
          validation.setFieldValue("cardImage6", reader.result)
        }
        reader.readAsDataURL(file)
      }
    }
  }
  const handleCardTitleChange = (e, card) => {
    if (card === 1) {
      setCardTitle1(e.target.value)
      validation.setFieldValue("cardTitle1", e.target.value)
    } else if (card === 2) {
      setCardTitle2(e.target.value)
      validation.setFieldValue("cardTitle2", e.target.value)
    } else if (card === 3) {
      setCardTitle3(e.target.value)
      validation.setFieldValue("cardTitle3", e.target.value)
    } else if (card === 4) {
      setCardTitle4(e.target.value)
      validation.setFieldValue("cardTitle4", e.target.value)
    } else if (card === 5) {
      setCardTitle5(e.target.value)
      validation.setFieldValue("cardTitle5", e.target.value)
    } else if (card === 6) {
      setCardTitle6(e.target.value)
      validation.setFieldValue("cardTitle6", e.target.value)
    }
  }

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

  const handleUserPicChange = e => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      setImgUser(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedUserPic(reader.result)
        validation.setFieldValue("userPic", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validation = useFormik({
    initialValues: {
      taglineCategorie: "",
      titleCategorie: "",
      categorieDescription: "",
      projectImage: "",
      userPic: "",
      signature: "",
    },
    validationSchema: Yup.object({
      taglineCategorie: Yup.string().required("Please Enter Tagline"),
      titleCategorie: Yup.string().required("Please Enter Title"),
      categorieDescription: Yup.string().required("Please Enter Description"),
      projectImage: Yup.string().required("Please Select Image"),
      userPic: Yup.string().required("Please Select User Picture"),
      signature: Yup.string().required("Please Type A Signature"),
    }),
    onSubmit: async values => {
      console.log("values", values)
      const formDat = new FormData()
      formDat.append("taglineCategorie", values.taglineCategorie)
      formDat.append("titleCategorie", values.titleCategorie)
      formDat.append("categorieDescription", values.categorieDescription)
      formDat.append("projectImage", img)
      formDat.append("userPic", imgUser)
      formDat.append("signature", values.signature)

      try {
        setLoader(true)
        const response = await axios.post(
          process.env.REACT_APP_DATABASEURL + "/projects/create",
          formDat,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        if (response.data) {
          validation.resetForm()
          setSelectedImage(null)
          setImg(null)
          setSelectedUserPic(null)
          setImgUser(null)
          setImgSignature(null)
          toast.success("🎉 Project Created Successfully")
          setLoader(false)
        }
      } catch (error) {
        console.error("error", error)
      }
      setLoader(false)
    },
  })

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
                              <img
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
                          onBlur={validation.handleBlur} // Add onBlur to mark the field as touched
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
                          as="textarea"
                          id="titleCategorie"
                          rows={3}
                          name="titleCategorie"
                          placeholder="Enter Title Categorie..."
                          onChange={validation.handleChange}
                          value={validation.values.titleCategorie || ""}
                          onBlur={validation.handleBlur} // Add onBlur to mark the field as touched
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
                      <Label htmlFor="descriptionCategorie-input">
                        Description
                      </Label>
                      <Input
                        as="textarea"
                        id="categorieDescription"
                        rows={4}
                        name="categorieDescription"
                        placeholder="Enter Description Categorie..."
                        onChange={validation.handleChange}
                        value={validation.values.categorieDescription || ""}
                        onBlur={validation.handleBlur} // Add onBlur to mark the field as touched
                      />
                      {validation.touched.categorieDescription &&
                      validation.errors.categorieDescription ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.categorieDescription}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="d-flex gap-5">
                      <div className="mb-3">
                        <Label className="form-label">User Picture</Label>
                        <div className="d-flex gap-5">
                          <div>
                            <div className="position-relative d-inline-block">
                              <div className="position-absolute bottom-0 end-0">
                                <Label
                                  htmlFor="user-pic-input"
                                  className="mb-0"
                                  id="userImageInput"
                                >
                                  <div className="avatar-xs">
                                    <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">
                                      <i className="bx bxs-image-alt"></i>
                                    </div>
                                  </div>
                                </Label>
                                <UncontrolledTooltip
                                  placement="right"
                                  target="userImageInput"
                                >
                                  Select Image
                                </UncontrolledTooltip>
                                <input
                                  className="form-control d-none"
                                  id="user-pic-input"
                                  type="file"
                                  accept="image/png, image/gif, image/jpeg"
                                  onChange={handleUserPicChange}
                                />
                              </div>
                              <div
                                className="avatar-lg"
                                style={{
                                  height: "80px",
                                  width: "90px",
                                  border: "none",
                                }}
                              >
                                <div
                                  className="avatar-title bg-light rounded-circle"
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    border: "none",
                                  }}
                                >
                                  <img
                                    src={selectedUserPic || ""}
                                    id="user-pic-img"
                                    alt=""
                                    className="avatar-md rounded-circle"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      backgroundRepeat: "no-repeat",
                                      backgroundPosition: "center",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {validation.touched.userPic &&
                        validation.errors.userPic ? (
                          <FormFeedback type="invalid" className="d-block">
                            {validation.errors.userPic}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <div className="d-flex gap-5">
                          <div className="mb-3 ms-2 flex-grow-1">
                            <Label className="form-label">Signature</Label>
                            <Input
                              as="textarea"
                              id="signature"
                              rows={3}
                              name="signature"
                              placeholder="Enter Signature..."
                              onChange={validation.handleChange}
                              value={validation.values.signature || ""}
                              onBlur={validation.handleBlur} // Add onBlur to mark the field as touched
                            />
                            {validation.touched.signature &&
                            validation.errors.signature ? (
                              <FormFeedback type="invalid" className="d-block">
                                {validation.errors.signature}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 text-center font-size-16 ">
                      <h1>Cards </h1>
                      <div className="d-flex gap-5 mb-3"></div>
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

export default ManageCategorie
