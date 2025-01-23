import React, { useState } from "react"
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
import imageCompression from "browser-image-compression"

import Breadcrumbs from "../../components/Common/Breadcrumb"

import "flatpickr/dist/themes/material_blue.css"

import * as Yup from "yup"
import { useFormik } from "formik"
import axios from "axios"

const DerigantsCreate = () => {
  document.title = "Create New Derigant"

  const [selectedFiles, setSelectedFiles] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [imgStore, setImgStore] = useState([])
  const [dropList, setDropList] = useState(false)
  const [active, setActive] = useState(0)
  const [img, setImg] = useState(null)
  const [loader, setLoader] = useState(false)
  const handleAcceptedFiles = files => {
    const newImages = files?.map(file => {
      return Object.assign(file, {
        priview: URL.createObjectURL(file),
      })
    })
    setSelectedFiles([...selectedFiles, ...newImages])
  }

  const handleImageChange = e => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      }

      imageCompression(file, options)
        .then(compressedFile => {
          setImg(compressedFile)

          const reader = new FileReader()
          reader.onloadend = () => {
            setSelectedImage(reader.result)
            validation.setFieldValue("derigantImage", reader.result)
          }
          reader.readAsDataURL(compressedFile)
        })
        .catch(error => {
          console.error("Image compression error:", error)
        })
    }
  }

  const validation = useFormik({
    initialValues: {
      derigantFirstName: "",
      derigantLastName: "",
      derigantEmail: "",
      facebook: "",
      twitter: "",
      instagram: "",
    },
    validationSchema: Yup.object({
      derigantFirstName: Yup.string().required("First Name is required"),
      derigantLastName: Yup.string().required("Last Name is required"),
      derigantEmail: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async values => {
      const formDat = new FormData()
      formDat.append("firstName", values.derigantFirstName)
      formDat.append("lastName", values.derigantLastName)
      formDat.append("email", values.derigantEmail)
      formDat.append("facebook", values.facebook)
      formDat.append("twitter", values.twitter)
      formDat.append("instagram", values.instagram)
      formDat.append("avatar", img)

      try {
        setLoader(true)
        const response = await axios.post(
          process.env.REACT_APP_DATABASEURL + "/derigant/create",
          formDat,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        if (response.data) {
          validation.resetForm()
          setSelectedFiles([])
          setSelectedImage(null)
          setImgStore([])
          setImg(null)
          toast.success("🎉 Derigant Created Successfully")
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
          <Breadcrumbs title="Derigants" breadcrumbItem="Create New" />
          <Form
            id="createderigant-form"
            onSubmit={e => {
              e.preventDefault()
              validation.handleSubmit()
              return false
            }}
          >
            <Row>
              <Col lg={8}>
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
                      id="derigant-id-input"
                    />
                    <div className="mb-3">
                      <Label className="form-label">Derigant Image</Label>

                      <div className="text-center">
                        <div className="position-relative d-inline-block">
                          <div className="position-absolute bottom-0 end-0">
                            <Label
                              htmlFor="derigant-image-input"
                              className="mb-0"
                              id="derigantImageInput"
                            >
                              <div className="avatar-xs">
                                <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">
                                  <i className="bx bxs-image-alt"></i>
                                </div>
                              </div>
                            </Label>
                            <UncontrolledTooltip
                              placement="right"
                              target="derigantImageInput"
                            >
                              Select Image
                            </UncontrolledTooltip>
                            <input
                              className="form-control d-none"
                              id="derigant-image-input"
                              type="file"
                              accept="image/png, image/gif, image/jpeg"
                              onChange={handleImageChange}
                            />
                          </div>
                          <div className="avatar-md me-4">
                            <div className="rounded-circle">
                              <img
                                src={selectedImage || ""}
                                id="derigantlogo-img"
                                alt=""
                                height="75"
                                width={"95px"}
                                style={{
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  objectPosition: "center",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        {validation.touched.derigantImage &&
                        validation.errors.derigantImage ? (
                          <FormFeedback type="invalid" className="d-block">
                            {validation.errors.derigantImage}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="derigantFirstName-input">
                        Derigant firstName
                      </Label>
                      <Input
                        id="derigantFirstName"
                        name="derigantFirstName"
                        type="text"
                        placeholder="Enter Derigan First Name..."
                        onChange={validation.handleChange}
                        value={validation.values.derigantFirstName || ""}
                      />
                      {validation.touched.derigantFirstName &&
                      validation.errors.derigantFirstName ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.derigantFirstName}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="derigantLastName-input">
                        Derigant Last Name
                      </Label>
                      <Input
                        id="derigantLastName"
                        name="derigantLastName"
                        type="text"
                        placeholder="Enter Derigant Last Name..."
                        onChange={validation.handleChange}
                        value={validation.values.derigantLastName || ""}
                      />
                      {validation.touched.derigantLastName &&
                      validation.errors.derigantLastName ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.derigantLastName}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="derigantEmail-input">
                        Derigant Email
                      </Label>
                      <Input
                        id="derigantEmail"
                        name="derigantEmail"
                        type="email"
                        placeholder="Enter Derigant Email..."
                        onChange={validation.handleChange}
                        value={validation.values.derigantEmail || ""}
                      />
                      {validation.touched.derigantEmail &&
                      validation.errors.derigantEmail ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.derigantEmail}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={4}>
                <Card>
                  <CardBody>
                    <Label className="card-title">Facebook</Label>
                    <Input
                      type="text"
                      id="facebook"
                      name="facebook"
                      placeholder="Enter Facebook Link"
                      onChange={validation.handleChange}
                      value={validation.values.facebook || ""}
                    />
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Label className="card-title">Twitter</Label>
                    <Input
                      type="text"
                      id="twitter"
                      name="twitter"
                      placeholder="Enter Twitter Link"
                      onChange={validation.handleChange}
                      value={validation.values.twitter || ""}
                    />
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Label className="card-title">Instagram</Label>
                    <Input
                      type="text"
                      id="instagram"
                      name="instagram"
                      placeholder="Enter Instagram Link"
                      onChange={validation.handleChange}
                      value={validation.values.instagram || ""}
                    />
                  </CardBody>
                </Card>
              </Col>
              <Col lg={8}>
                <div className="text-end mb-4">
                  <Button type="submit" color="primary" disabled={loader}>
                    Create Derigant
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

export default DerigantsCreate
