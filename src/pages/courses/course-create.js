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
  Select,
  UncontrolledTooltip,
} from "reactstrap"
import { toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import * as Yup from "yup"
import { useFormik } from "formik"
import axios from "axios"

const CourseCreate = () => {
  document.title = "Create New Course "

  const [loader, setLoader] = useState(false)

  const validation = useFormik({
    initialValues: {
      courseTitle: "",
      courseDescription: "",
      courseDay: "",
      courseTime: "",
    },
    validationSchema: Yup.object({
      courseTitle: Yup.string().required("Course Title is required"),
      courseDescription: Yup.string().required(
        "Course Description is required"
      ),
      courseDay: Yup.string().required("Course Day is required"),
      courseTime: Yup.string().required("Course Time is required"),
    }),
    onSubmit: async values => {
      try {
        console.log("values", values)
        setLoader(true)
        const response = await axios.post(
          process.env.REACT_APP_DATABASEURL + "/courses/create",
          {
            title: values.courseTitle,
            description: values.courseDescription,
            day: values.courseDay,
            time: values.courseTime,
          }
        )
        if (response.data) {
          validation.resetForm()
          toast.success("🎉 Course Created Successfully")
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
          <Breadcrumbs title="Courses" breadcrumbItem="Create New" />
          <Form
            id="createcourse-form"
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
                      id="course-id-input"
                    />

                    <div className="mb-3">
                      <Label htmlFor="courseEmail-input">Course Title</Label>
                      <Input
                        id="courseTitle"
                        name="courseTitle"
                        type="text"
                        placeholder="Enter Course Title..."
                        onChange={validation.handleChange}
                        value={validation.values.courseTitle || ""}
                      />
                      {validation.touched.courseTitle &&
                      validation.errors.courseTitle ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.courseTitle}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="courseDescription-input">
                        Course Description
                      </Label>
                      <Input
                        id="courseDescription"
                        name="courseDescription"
                        type="text"
                        placeholder="Enter Course Description..."
                        onChange={validation.handleChange}
                        value={validation.values.courseDescription || ""}
                        className="pe-5"
                      />
                    </div>
                    {validation.touched.courseDescription &&
                    validation.errors.courseDescription ? (
                      <FormFeedback type="invalid" className="d-block">
                        {validation.errors.courseDescription}
                      </FormFeedback>
                    ) : null}
                    <div className="mb-3">
                      <Label htmlFor="courseDay-input">Course Day</Label>

                      <Input
                        type="select"
                        name="courseDay"
                        id="courseDay"
                        onChange={validation.handleChange}
                        value={validation.values.courseDay || ""}
                      >
                        <option value="">Select Day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </Input>
                      {validation.touched.courseDay &&
                      validation.errors.courseDay ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.courseDay}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="courseTime-input">Course Time</Label>
                      <Input
                        id="courseTime"
                        name="courseTime"
                        type="time"
                        placeholder="Enter Course Time..."
                        onChange={validation.handleChange}
                        value={validation.values.courseTime || ""}
                        className="pe-5"
                      />
                    </div>
                    {validation.touched.courseTime &&
                    validation.errors.courseTime ? (
                      <FormFeedback type="invalid" className="d-block">
                        {validation.errors.courseTime}
                      </FormFeedback>
                    ) : null}
                  </CardBody>
                </Card>
              </Col>
              <Col lg={8}>
                <div className="text-end mb-4">
                  <Button type="submit" color="primary" disabled={loader}>
                    Create Course
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

export default CourseCreate
