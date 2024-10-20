import React, { useState, useEffect, useCallback } from "react"
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
  // Meta title
  useEffect(() => {
    document.title = "Manage Why Choose Section"
  }, [])

  const [loader, setLoader] = useState(false)
  const [images, setImages] = useState({ img1: null, img2: null })
  const [selectedImages, setSelectedImages] = useState({
    img1: null,
    img2: null,
  })
  const [listPoints, setListPoints] = useState(
    Array(3).fill({ title: "", text: "" })
  )

  // Helper for image change handling
  const handleImageChange = (e, imgKey) => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImages(prev => ({ ...prev, [imgKey]: reader.result }))
        validation.setFieldValue(imgKey, reader.result)
      }
      reader.readAsDataURL(file)
      setImages(prev => ({ ...prev, [imgKey]: file }))
    }
  }

  const handleAddPoint = () => {
    setListPoints([...listPoints, { title: "", text: "" }])
  }

  const handleRemovePoint = indexToRemove => {
    if (listPoints.length > 3) {
      setListPoints(listPoints.filter((_, index) => index !== indexToRemove))
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
      const filledPoints = listPoints.filter(point => point.title && point.text)
      if (filledPoints.length < 3) {
        toast.error(
          "Please ensure at least 3 points are filled out with a title and text."
        )
        return
      }

      setLoader(true)
      const payload = {
        title: values.title,
        thumb: images.img1,
        thumb2: images.img2,
        tagline: values.tagline,
        title2: values.title2,
        items: listPoints,
      }

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_DATABASEURL}/why-choose-section/create`,
          payload,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
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

  const fetchDefaultOnes = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/why-choose-section/find-all`
      )
      if (response.data) {
        const defaultOne = response.data[0]
        validation.setFieldValue("title", defaultOne.title)
        validation.setFieldValue("tagline", defaultOne.tagline)
        validation.setFieldValue("title2", defaultOne.title2)
        setSelectedImages({ img1: defaultOne.thumb, img2: defaultOne.thumb2 })
        setListPoints(defaultOne.items)
      }
    } catch (error) {
      console.error("error", error)
    }
  }, [])

  useEffect(() => {
    fetchDefaultOnes()
  }, [fetchDefaultOnes])

  return (
    <div className="page-content">
      <Container fluid>
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
                  <TextInput
                    label="Title"
                    id="titleWhyChoose"
                    name="title"
                    placeholder="Enter Title Why Choose..."
                    validation={validation}
                  />

                  <Row>
                    <ImageInput
                      label="Picture Left"
                      imgKey="img1"
                      selectedImage={selectedImages.img1}
                      onChange={e => handleImageChange(e, "img1")}
                      validation={validation}
                    />

                    <ImageInput
                      label="Picture Right"
                      imgKey="img2"
                      selectedImage={selectedImages.img2}
                      onChange={e => handleImageChange(e, "img2")}
                      validation={validation}
                    />
                  </Row>

                  <Row>
                    <TextInput
                      label="Tagline"
                      id="taglineWhyChoose"
                      name="tagline"
                      placeholder="Enter Tagline..."
                      validation={validation}
                    />
                    <TextInput
                      label="Title Right"
                      id="title2WhyChoose"
                      name="title2"
                      placeholder="Enter Title Right..."
                      validation={validation}
                    />
                  </Row>

                  <PointsList
                    listPoints={listPoints}
                    setListPoints={setListPoints}
                    handleAddPoint={handleAddPoint}
                    handleRemovePoint={handleRemovePoint}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col lg={12} className="d-flex justify-content-end">
              <Button type="submit" color="primary" disabled={loader}>
                {loader ? "Saving..." : "Save Changes"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  )
}

// Reusable TextInput Component
const TextInput = ({ label, id, name, placeholder, validation }) => (
  <div className="mb-3">
    <Label htmlFor={id}>{label}</Label>
    <Input
      type="text"
      id={id}
      name={name}
      placeholder={placeholder}
      onChange={validation.handleChange}
      value={validation.values[name]}
      onBlur={validation.handleBlur}
    />
    {validation.touched[name] && validation.errors[name] ? (
      <FormFeedback type="invalid" className="d-block">
        {validation.errors[name]}
      </FormFeedback>
    ) : null}
  </div>
)

// Reusable ImageInput Component
const ImageInput = ({ label, imgKey, selectedImage, onChange, validation }) => (
  <Col lg={6}>
    <div className="mb-3 text-center">
      <Label className="form-label">{label}</Label>
      <div className="position-relative d-inline-block">
        <Label htmlFor={imgKey + "-input"} className="mb-0">
          <div className="avatar-xs">
            <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">
              <i className="bx bxs-image-alt"></i>
            </div>
          </div>
        </Label>
        <input
          className="form-control d-none"
          id={imgKey + "-input"}
          type="file"
          accept="image/png, image/gif, image/jpeg"
          onChange={onChange}
        />
        <div className="avatar-lg" style={{ height: "250px", width: "450px" }}>
          <div className="avatar-title bg-light">
            {selectedImage ? (
              <SuspenseImage
                src={selectedImage || ""}
                alt=""
                className="avatar-md"
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundSize: "cover",
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
      {validation.touched[imgKey] && validation.errors[imgKey] ? (
        <FormFeedback type="invalid" className="d-block">
          {validation.errors[imgKey]}
        </FormFeedback>
      ) : null}
    </div>
  </Col>
)

// Reusable PointsList Component
const PointsList = ({
  listPoints,
  setListPoints,
  handleAddPoint,
  handleRemovePoint,
}) => (
  <>
    <div className="mb-3 text-center font-size-16 ">
      <h1>List Points</h1>
    </div>
    <Row>
      {listPoints.map((point, index) => (
        <Col md={12} key={index} className="mb-4">
          <div
            style={{ width: "100%", height: "1px", backgroundColor: "#e9e9e9" }}
            className="mb-5"
          ></div>
          <ListPoints
            index={index}
            listPoints={listPoints}
            setListPoints={setListPoints}
          />
          {listPoints.length > 3 && (
            <div className="col-md-12 mb-3 d-flex justify-content-end">
              <Button
                type="button"
                color="danger"
                onClick={() => handleRemovePoint(index)}
              >
                <i className="mdi mdi-delete font-size-16 align-middle me-1"></i>{" "}
                Remove
              </Button>
            </div>
          )}
        </Col>
      ))}
    </Row>
    <div className="row justify-content-center mt-3">
      <div className="col-md-12 mb-3 d-flex justify-content-end">
        <Button type="button" color="primary" onClick={handleAddPoint}>
          <i className="mdi mdi-plus-circle-outline font-size-16 align-middle me-1"></i>{" "}
          Add
        </Button>
      </div>
    </div>
  </>
)

export default ManageWhyChoose
