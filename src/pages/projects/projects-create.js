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

const ProjectsCreate = () => {
  //meta title
  document.title = "Create New Project"

  const [selectedFiles, setSelectedFiles] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [imgStore, setImgStore] = useState([])
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
        validation.setFieldValue("projectImage", reader.result)
      }
      reader.readAsDataURL(file)
      setImg(file)
    }
  }

  const validation = useFormik({
    initialValues: {
      projectname: "",
      projectShortDesc: "",
      projectLongDesc: "",
      projecttarget: "",
      targetDate: "",
      projectImage: "",
      startDate: "",
      type: "",
    },
    validationSchema: Yup.object({
      projectname: Yup.string().required("Please Enter Your Project Name"),
      projectShortDesc: Yup.string().required("Please Enter Your Project Desc"),
      projectLongDesc: Yup.string().required("Please Enter Your Project Desc"),
      projecttarget: Yup.string().required("Please Enter Your Project Target"),
      targetDate: Yup.string().required("Please Enter Your Target Date"),
      projectImage: Yup.string().required("Please Select Image"),
      projectType: Yup.string().required("Please Select Project Type"),
    }),
    onSubmit: async values => {
      const formDat = new FormData()
      formDat.append("name", values.projectname)
      formDat.append("shortDescription", values.projectShortDesc)
      formDat.append("longDescription", values.projectLongDesc)
      formDat.append("target", values.projecttarget)
      formDat.append("targetDate", values.targetDate)
      formDat.append("startDate", values.startDate)
      formDat.append("image", img)
      formDat.append("type", values.projectType)
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
          setSelectedFiles([])
          setSelectedImage(null)
          setImgStore([])
          setImg(null)
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
          <Breadcrumbs title="Projects" breadcrumbItem="Create New" />
          <Form
            id="createproject-form"
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
                      id="project-id-input"
                    />
                    <div className="mb-3">
                      <Label className="form-label">Project Image</Label>

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
                          <div className="avatar-md me-4">
                            <div className="rounded-circle">
                              <img
                                src={selectedImage || ""}
                                id="projectlogo-img"
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
                        {validation.touched.projectImage &&
                        validation.errors.projectImage ? (
                          <FormFeedback type="invalid" className="d-block">
                            {validation.errors.projectImage}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="projectname-input">Project Name</Label>
                      <Input
                        id="projectname"
                        name="projectname"
                        type="text"
                        placeholder="Enter Project Name..."
                        onChange={validation.handleChange}
                        value={validation.values.projectname || ""}
                      />
                      {validation.touched.projectname &&
                      validation.errors.projectname ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.projectname}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="projectShortDesc-input">
                        Project Description
                      </Label>
                      <Input
                        as="textarea"
                        id="projectShortDesc"
                        rows={3}
                        name="projectShortDesc"
                        placeholder="Enter Project Description..."
                        onChange={validation.handleChange}
                        value={validation.values.projectShortDesc || ""}
                      />
                      {validation.touched.projectShortDesc &&
                      validation.errors.projectShortDesc ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.projectShortDesc}
                        </FormFeedback>
                      ) : null}
                    </div>{" "}
                    <div className="mb-3">
                      <Label htmlFor="projectLongDesc-input">
                        Project Long Description
                      </Label>
                      <Input
                        as="textarea"
                        type="textarea"
                        id="projectLongDesc"
                        rows={3}
                        name="projectLongDesc"
                        placeholder="Enter Project Long Description..."
                        onChange={validation.handleChange}
                        value={validation.values.projectLongDesc || ""}
                      />
                      {validation.touched.projectLongDesc &&
                      validation.errors.projectLongDesc ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.projectLongDesc}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="projecttarget-input">
                        Project Target Amount
                      </Label>
                      <Input
                        as="textarea"
                        id="projecttarget"
                        rows={3}
                        name="projecttarget"
                        placeholder="Enter Project Target Amount..."
                        onChange={validation.handleChange}
                        value={validation.values.projecttarget || ""}
                      />
                      {validation.touched.projecttarget &&
                      validation.errors.projecttarget ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.projecttarget}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="projectType">Project Type</Label>
                      <Input
                        type="select"
                        id="projectType"
                        name="projectType"
                        onChange={validation.handleChange}
                        value={validation.values.projectType || ""}
                      >
                        <option value="">Select Project Type</option>
                        <option value="social">Social</option>
                        <option value="startup">Startup</option>
                        <option value="Projet participatif">
                          Projet participatif
                        </option>
                      </Input>
                      {validation.touched.projectType &&
                      validation.errors.projectType ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.projectType}
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
                    Create Project
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

export default ProjectsCreate
