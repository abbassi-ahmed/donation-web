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
import FlatPickr from "react-flatpickr"
import * as Yup from "yup"
import { useFormik } from "formik"
import axios from "axios"
import CardUploader from "./CardUploader"
import SuspenseImage from "../../components/SuspenseImage/ImageComponent"

const ManageCategorie = () => {
  //meta title
  document.title = "Manage Categorie"

  const [selectedImage, setSelectedImage] = useState(null)
  const [img, setImg] = useState(null)
  const [selectedUserPic, setSelectedUserPic] = useState(null)
  const [imgUser, setImgUser] = useState(null)
  const [loader, setLoader] = useState(false)
  const [cards, setCards] = useState(Array(6).fill({ icon: null, title: "" }))

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
      if (
        ![3, 6].includes(cards.filter(card => card.icon && card.title).length)
      ) {
        console.log("cards", cards)
        toast.error("Please fill at least 3 or exactly 6 cards")
        return
      } else {
        try {
          setLoader(true)
          await Promise.all(
            cards.map(card =>
              axios.post(
                process.env.REACT_APP_DATABASEURL + "/categories-cards/",
                {
                  icon: card.icon,
                  title: card.title,
                },
                { headers: { "Content-Type": "multipart/form-data" } }
              )
            )
          )

          const payload = {
            tagline: values.taglineCategorie,
            title: values.titleCategorie,
            description: values.categorieDescription,
            signature: values.signature,
          }

          if (img) payload.bg = img
          if (imgUser) payload.categoriesUser = imgUser

          const response = await axios.post(
            process.env.REACT_APP_DATABASEURL + "/categories-section/create",
            payload,
            { headers: { "Content-Type": "multipart/form-data" } }
          )

          if (response.data) {
            fetchDefaultOnes()
            toast.success("🎉 Project Created Successfully")
          }
        } catch (error) {
          console.error("error", error)
        } finally {
          setLoader(false)
        }
      }
    },
  })

  const fetchDefaultOnes = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DATABASEURL + "/categories-section/find-all"
      )
      if (response.data[0].categories.length > 0) {
        const data = response.data[0]
        validation.setFieldValue("taglineCategorie", data.tagline)
        validation.setFieldValue("titleCategorie", data.title)
        validation.setFieldValue("categorieDescription", data.description)
        validation.setFieldValue("signature", data.signature)
        validation.setFieldValue("projectImage", data.bg)
        validation.setFieldValue("userPic", data.categoriesUser)

        if (data.bg) {
          setSelectedImage(data.bg)
          setImg(data.bg)
        }
        if (data.categoriesUser) {
          setSelectedUserPic(data.categoriesUser)
          setImgUser(data.categoriesUser)
        }

        setCards(
          data.categories.map(card => ({
            icon: card.icon,
            title: card.title,
          }))
        )
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
                              {selectedImage ? (
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
                              ) : null}
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
                                  {selectedUserPic ? (
                                    <SuspenseImage
                                      src={selectedUserPic || ""}
                                      id="user-pic-img"
                                      alt=""
                                      loading="lazy"
                                      className="avatar-md rounded-circle"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                      }}
                                    />
                                  ) : null}
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
                      <div
                        style={{
                          width: "100%",
                          height: "1px",
                          backgroundColor: "#e9e9e9",
                        }}
                        className="mb-5"
                      ></div>
                      <Container>
                        <Row>
                          {[...Array(6)].map((_, index) => (
                            <Col md={4} key={index} className="mb-4">
                              <CardUploader
                                index={index}
                                cards={cards}
                                setCards={setCards}
                                validation={validation}
                              />
                            </Col>
                          ))}
                        </Row>
                      </Container>
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
