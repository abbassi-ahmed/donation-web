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

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

// FlatPickr
import "flatpickr/dist/themes/material_blue.css"
import FlatPickr from "react-flatpickr"

import * as Yup from "yup"
import { useFormik } from "formik"
import moment from "moment"
import SimpleBar from "simplebar-react"
import axios from "axios"

const ClubsCreate = () => {
  //meta title
  document.title = "Create New Club"

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
      setImg(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
        validation.setFieldValue("clubImage", reader.result)
      }
      reader.readAsDataURL(file)
      setImg(file)
    }
  }

  const validation = useFormik({
    initialValues: {
      clubname: "",
      clubShortDesc: "",
      clubLongDesc: "",
      clubtarget: "",
      targetDate: "",
      clubImage: "",
      startDate: "",
      type: "",
    },
    validationSchema: Yup.object({
      clubname: Yup.string().required("Please Enter Your Club Name"),
      clubShortDesc: Yup.string().required("Please Enter Your Club Desc"),
      clubLongDesc: Yup.string().required("Please Enter Your Club Desc"),
      clubtarget: Yup.string().required("Please Enter Your Club Target"),
      targetDate: Yup.string().required("Please Enter Your Target Date"),
      clubImage: Yup.string().required("Please Select Image"),
      clubType: Yup.string().required("Please Select Club Type"),
    }),
    onSubmit: async values => {
      const formDat = new FormData()
      formDat.append("name", values.clubname)
      formDat.append("shortDescription", values.clubShortDesc)
      formDat.append("longDescription", values.clubLongDesc)
      formDat.append("target", values.clubtarget)
      formDat.append("targetDate", values.targetDate)
      formDat.append("startDate", values.startDate)
      formDat.append("image", img)
      formDat.append("type", values.clubType)
      try {
        setLoader(true)
        const response = await axios.post(
          process.env.REACT_APP_DATABASEURL + "/clubs/create",
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
          toast.success("🎉 Club Created Successfully")
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
          <Breadcrumbs title="Clubs" breadcrumbItem="Create New" />
          <Form
            id="createclub-form"
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
                      id="club-id-input"
                    />
                    <div className="mb-3">
                      <Label className="form-label">Club Image</Label>

                      <div className="text-center">
                        <div className="position-relative d-inline-block">
                          <div className="position-absolute bottom-0 end-0">
                            <Label
                              htmlFor="club-image-input"
                              className="mb-0"
                              id="clubImageInput"
                            >
                              <div className="avatar-xs">
                                <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">
                                  <i className="bx bxs-image-alt"></i>
                                </div>
                              </div>
                            </Label>
                            <UncontrolledTooltip
                              placement="right"
                              target="clubImageInput"
                            >
                              Select Image
                            </UncontrolledTooltip>
                            <input
                              className="form-control d-none"
                              id="club-image-input"
                              type="file"
                              accept="image/png, image/gif, image/jpeg"
                              onChange={handleImageChange}
                            />
                          </div>
                          <div className="avatar-md me-4">
                            <div className="rounded-circle">
                              <img
                                src={selectedImage || ""}
                                id="clublogo-img"
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
                        {validation.touched.clubImage &&
                        validation.errors.clubImage ? (
                          <FormFeedback type="invalid" className="d-block">
                            {validation.errors.clubImage}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="clubname-input">Club Name</Label>
                      <Input
                        id="clubname"
                        name="clubname"
                        type="text"
                        placeholder="Enter Club Name..."
                        onChange={validation.handleChange}
                        value={validation.values.clubname || ""}
                      />
                      {validation.touched.clubname &&
                      validation.errors.clubname ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.clubname}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="clubShortDesc-input">
                        Club Description
                      </Label>
                      <Input
                        as="textarea"
                        id="clubShortDesc"
                        rows={3}
                        name="clubShortDesc"
                        placeholder="Enter Club Description..."
                        onChange={validation.handleChange}
                        value={validation.values.clubShortDesc || ""}
                      />
                      {validation.touched.clubShortDesc &&
                      validation.errors.clubShortDesc ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.clubShortDesc}
                        </FormFeedback>
                      ) : null}
                    </div>{" "}
                    <div className="mb-3">
                      <Label htmlFor="clubLongDesc-input">
                        Club Long Description
                      </Label>
                      <Input
                        as="textarea"
                        type="textarea"
                        id="clubLongDesc"
                        rows={3}
                        name="clubLongDesc"
                        placeholder="Enter Club Long Description..."
                        onChange={validation.handleChange}
                        value={validation.values.clubLongDesc || ""}
                      />
                      {validation.touched.clubLongDesc &&
                      validation.errors.clubLongDesc ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.clubLongDesc}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="clubtarget-input">
                        Club Target Amount
                      </Label>
                      <Input
                        as="textarea"
                        id="clubtarget"
                        rows={3}
                        name="clubtarget"
                        placeholder="Enter Club Target Amount..."
                        onChange={validation.handleChange}
                        value={validation.values.clubtarget || ""}
                      />
                      {validation.touched.clubtarget &&
                      validation.errors.clubtarget ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.clubtarget}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="clubType">Club Type</Label>
                      <Input
                        type="select"
                        id="clubType"
                        name="clubType"
                        onChange={validation.handleChange}
                        value={validation.values.clubType || ""}
                      >
                        <option value="">Select Club Type</option>
                        <option value="social">Social</option>
                        <option value="startup">Startup</option>
                        <option value="Projet participatif">
                          Projet participatif
                        </option>
                      </Input>
                      {validation.touched.clubType &&
                      validation.errors.clubType ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.clubType}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={4}>
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Start Date</h5>
                    <FlatPickr
                      className="form-control d-block"
                      id="startDate"
                      name="startDate"
                      placeholder="Select date"
                      options={{
                        mode: "single",
                        dateFormat: "d M, Y",
                      }}
                      onChange={customerdate =>
                        validation.setFieldValue(
                          "startDate",
                          moment(customerdate[0]).format("DD MMMM ,YYYY")
                        )
                      }
                      value={validation.values.startDate}
                    />
                    {validation.errors.startDate &&
                    validation.touched.startDate ? (
                      <FormFeedback type="invalid" className="d-block">
                        {validation.errors.startDate}
                      </FormFeedback>
                    ) : null}
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Target Date</h5>
                    <FlatPickr
                      className="form-control d-block"
                      id="targetDate"
                      name="targetDate"
                      placeholder="Select date"
                      options={{
                        mode: "single",
                        dateFormat: "d M, Y",
                      }}
                      onChange={customerdate =>
                        validation.setFieldValue(
                          "targetDate",
                          moment(customerdate[0]).format("DD MMMM ,YYYY")
                        )
                      }
                      value={validation.values.targetDate || ""}
                    />
                    {validation.errors.targetDate &&
                    validation.touched.targetDate ? (
                      <FormFeedback type="invalid" className="d-block">
                        {validation.errors.targetDate}
                      </FormFeedback>
                    ) : null}
                  </CardBody>
                </Card>
              </Col>
              <Col lg={8}>
                <div className="text-end mb-4">
                  <Button type="submit" color="primary" disabled={loader}>
                    Create Club
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

export default ClubsCreate
