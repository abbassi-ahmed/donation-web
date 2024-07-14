import React, { useState } from "react"
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
  UncontrolledTooltip,
} from "reactstrap"
import { toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import * as Yup from "yup"
import { useFormik } from "formik"
import axios from "axios"

const CoachCreate = () => {
  document.title = "Create New Coach | Skote - React Admin & Dashboard Template"

  const [selectedImage, setSelectedImage] = useState(null)
  const [img, setImg] = useState(null)
  const [loader, setLoader] = useState(false)

  const handleImageChange = e => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      setImg(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
        validation.setFieldValue("coachAvatar", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validation = useFormik({
    initialValues: {
      coachEmail: "",
      coachFirstName: "",
      coachPassword: "",
      coachLastName: "",
      coachPhone: "",
      coachAvatar: "",
      coachSpecialization: "",
    },
    validationSchema: Yup.object({
      coachEmail: Yup.string().required("Email is required"),
      coachFirstName: Yup.string().required("First Name is required"),
      coachLastName: Yup.string().required("Last Name is required"),
      coachPassword: Yup.string().required("Password is required"),
      coachPhone: Yup.string().required("Phone is required"),
      coachSpecialization: Yup.string().required("Specialization is required"),
      coachAvatar: Yup.string().required("Avatar is required"),
    }),
    onSubmit: async values => {
      const formDat = new FormData()
      formDat.append("email", values.coachEmail)
      formDat.append("password", values.coachPassword)
      formDat.append("firstName", values.coachFirstName)
      formDat.append("lastName", values.coachLastName)
      formDat.append("phoneNumber", values.coachPhone)
      formDat.append("avatar", img)
      formDat.append("specialization", values.coachSpecialization)

      // Debugging: Print the FormData entries
      for (let [key, value] of formDat.entries()) {
        console.log(`${key}: ${value}`)
      }

      try {
        setLoader(true)
        const response = await axios.post(
          process.env.REACT_APP_DATABASEURL + "/coach/create",
          formDat
        )
        if (response.data) {
          validation.resetForm()
          setSelectedImage(null)
          setImg(null)
          toast.success("🎉 Coach Created Successfully")
          setLoader(false)
        }
      } catch (error) {
        if (error.response.data.message) {
          toast.error(error.response.data.message)
        }
      }
      setLoader(false)
    },
  })

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Coaches" breadcrumbItem="Create New" />
          <Form
            id="createcoach-form"
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
                      id="coach-id-input"
                    />
                    <div className="mb-3">
                      <Label className="form-label">Coach Image</Label>
                      <div className="text-center">
                        <div className="position-relative d-inline-block">
                          <div className="position-absolute bottom-0 end-0">
                            <Label
                              htmlFor="project-image-input"
                              className="mb-0"
                              id="coachAvatarInput"
                            >
                              <div className="avatar-xs">
                                <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">
                                  <i className="bx bxs-image-alt"></i>
                                </div>
                              </div>
                            </Label>
                            <UncontrolledTooltip
                              placement="right"
                              target="coachAvatarInput"
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
                          <div className="avatar-lg">
                            <div className="avatar-title bg-light rounded-circle">
                              <img
                                src={selectedImage || ""}
                                id="projectlogo-img"
                                alt=""
                                className="avatar-md h-auto rounded-circle"
                              />
                            </div>
                          </div>
                        </div>
                        {validation.touched.coachAvatar &&
                        validation.errors.coachAvatar ? (
                          <FormFeedback type="invalid" className="d-block">
                            {validation.errors.coachAvatar}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="coachEmail-input">Coach Email</Label>
                      <Input
                        id="coachEmail"
                        name="coachEmail"
                        type="text"
                        placeholder="Enter Coach Email..."
                        onChange={validation.handleChange}
                        value={validation.values.coachEmail || ""}
                      />
                      {validation.touched.coachEmail &&
                      validation.errors.coachEmail ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.coachEmail}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="coachPassword-input">
                        Coach Password
                      </Label>
                      <div className="position-relative">
                        <i className="bx bx-lock position-absolute top-50 end-0 translate-middle-y pe-3"></i>
                        <Input
                          id="coachPassword"
                          name="coachPassword"
                          type="password"
                          placeholder="Enter Coach Password..."
                          onChange={validation.handleChange}
                          value={validation.values.coachPassword || ""}
                          className="pe-5"
                        />
                      </div>
                      {validation.touched.coachPassword &&
                      validation.errors.coachPassword ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.coachPassword}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="coachEmail-input">
                        Coach Specialization
                      </Label>
                      <Input
                        id="coachSpecialization"
                        name="coachSpecialization"
                        type="text"
                        placeholder="Enter Coach Specialization..."
                        onChange={validation.handleChange}
                        value={validation.values.coachSpecialization || ""}
                      />
                      {validation.touched.coachSpecialization &&
                      validation.errors.coachSpecialization ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.coachSpecialization}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={4}>
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">First Name</h5>
                    <Input
                      id="coachFirstName"
                      name="coachFirstName"
                      className="form-control d-block"
                      type="text"
                      placeholder="Enter Coach First Name..."
                      onChange={validation.handleChange}
                      value={validation.values.coachFirstName || ""}
                    />
                    {validation.errors.coachFirstName &&
                    validation.touched.coachFirstName ? (
                      <FormFeedback type="invalid" className="d-block">
                        {validation.errors.coachFirstName}
                      </FormFeedback>
                    ) : null}
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Last Name</h5>
                    <Input
                      id="coachLastName"
                      name="coachLastName"
                      className="form-control d-block"
                      type="text"
                      placeholder="Enter Coach Last Name..."
                      onChange={validation.handleChange}
                      value={validation.values.coachLastName || ""}
                    />
                    {validation.errors.coachLastName &&
                    validation.touched.coachLastName ? (
                      <FormFeedback type="invalid" className="d-block">
                        {validation.errors.coachLastName}
                      </FormFeedback>
                    ) : null}
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Phone Number</h5>
                    <Input
                      id="coachPhone"
                      name="coachPhone"
                      className="form-control d-block"
                      type="tel"
                      placeholder="Enter Coach Phone Number..."
                      onChange={validation.handleChange}
                      value={validation.values.coachPhone || ""}
                    />
                    {validation.errors.coachPhone &&
                    validation.touched.coachPhone ? (
                      <FormFeedback type="invalid" className="d-block">
                        {validation.errors.coachPhone}
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

export default CoachCreate
