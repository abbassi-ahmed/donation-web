import React, { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import TableContainer from "components/Common/TableContainer"
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  FormFeedback,
  Input,
  Form,
} from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"
import Breadcrumbs from "components/Common/Breadcrumb"
import DeleteModal from "components/Common/DeleteModal"
import Spinners from "components/Common/Spinner"
import { ToastContainer, toast } from "react-toastify"
import axios from "axios"

const ManageCourses = () => {
  document.title = "Course List | Skote - React Admin & Dashboard Template"

  const [courses, setCourses] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [contact, setContact] = useState(null)
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [coaches, setCoaches] = useState([])
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DATABASEURL}/courses/find-all`
        )
        setCourses(
          response.data.map(course => ({
            ...course,
            coachName: coaches.find(coach => coach.id === course.coachId)
              ?.firstName,
          }))
        )

        setLoading(false)
      } catch (error) {
        console.error("Error fetching Courses:", error)
        setLoading(false)
      }
    }

    fetchCourses()
    getCoaches()
  }, [])

  const toggle = () => {
    setModal(!modal)
  }

  const handleCourseClick = course => {
    setContact(course)
    setIsEdit(true)
    toggle()
  }

  const handleCourseClicks = () => {
    setContact(null)
    setIsEdit(false)
    toggle()
  }

  const getCoaches = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/coach/find-all`
      )
      setCoaches(response.data)
    } catch (error) {
      console.error("Error fetching Coaches:", error)
    }
  }

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: contact ? contact.title : "",
      description: contact ? contact.description : "",
      day: contact?.day || "",
      time: contact?.time || "",
      visibility: contact?.visibility ? true : false,
      abonnementType: contact?.abonnementType || "",
      coachName: contact?.coachName || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Course Title is required"),
      description: Yup.string().required("Course Description is required"),
      day: Yup.string().required("Course Day is required"),
      time: Yup.string().required("Course Time is required"),
      visibility: Yup.string().required("Course Visibility is required"),
      abonnementType: Yup.string().required(
        "Course Abonnement Type is required"
      ),
      coachName: Yup.string().required("Course Coach Name is required"),
    }),
    onSubmit: async values => {
      console.log("values: ", values)
      const newCourse = {
        id: isEdit ? contact.id : Math.floor(Math.random() * 100) + 1,
        title: values.title || "",
        description: values.description || "",
        day: values.day || "",
        time: values.time || "",
        visibility: values.visibility ? true : false,
        abonnementType: values.abonnementType || "",
        coachId: values.coachName || "",
      }

      if (isEdit) {
        try {
          const response = await axios.put(
            `${process.env.REACT_APP_DATABASEURL}/courses/update/${contact.id}`,
            newCourse
          )
          setCourses(prevCourses =>
            prevCourses.map(course =>
              course.id === contact.id ? response.data : course
            )
          )
          toast.success("Course updated successfully")
        } catch (error) {
          toast.error("Error updating Course")
          console.error("Error updating Course:", error)
        }
      } else {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_DATABASEURL}/courses/create`,
            newCourse
          )
          setCourses(prevCourses => [...prevCourses, response.data])
          toast.success("Course added successfully")
        } catch (error) {
          toast.error("Error adding Course")
          console.error("Error adding Course:", error)
        }
      }
      toggle()
      validation.resetForm()
    },
  })

  const onClickDelete = course => {
    setContact(course)
    setDeleteModal(true)
  }

  const handleDeleteCourse = async () => {
    if (contact?.id) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_DATABASEURL}/courses/remove/${contact.id}`
        )
        setCourses(prevCourses =>
          prevCourses.filter(course => course.id !== contact.id)
        )
        toast.success("Course deleted successfully")
      } catch (error) {
        toast.error("Error deleting Course")
        console.error("Error deleting Course:", error)
      }
    }
    setDeleteModal(false)
  }

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "avatar",
        cell: cell => (
          <>
            {!cell.getValue() ? (
              <div className="avatar-xs">
                <span className="avatar-title rounded-circle">
                  {cell.row.original.title.charAt(0)}
                </span>
              </div>
            ) : (
              <img
                className="rounded-circle avatar-xs"
                src={cell.getValue()}
                alt=""
              />
            )}
          </>
        ),
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "Title",
        accessorKey: "title",
      },
      {
        header: "Description",
        accessorKey: "description",
      },
      {
        header: "Day",
        accessorKey: "day",
      },
      {
        header: "Time",
        accessorKey: "time",
      },
      {
        header: "Coach Name",
        accessorKey: "coachName",
        cell: cellProps => (
          <span>
            {cellProps.row.original.coach
              ? `${cellProps.row.original.coach.firstName} ${cellProps.row.original.coach.lastName}`
              : "N/A"}
          </span>
        ),
      },
      {
        header: "Visibility",
        accessorKey: "visibility",
      },
      {
        header: "Abonnement Type",
        accessorKey: "abonnementType",
      },

      {
        header: "Action",
        cell: cellProps => (
          <div className="d-flex gap-3">
            <Link
              to="#"
              className="text-success"
              onClick={() => handleCourseClick(cellProps.row.original)}
            >
              <i className="mdi mdi-pencil font-size-18" />
            </Link>
            <Link
              to="#"
              className="text-danger"
              onClick={() => onClickDelete(cellProps.row.original)}
            >
              <i className="mdi mdi-delete font-size-18" />
            </Link>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCourse}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Courses" breadcrumbItem="Course List" />
          <Row>
            {isLoading ? (
              <Spinners setLoading={setLoading} />
            ) : (
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <h4 className="card-title">Courses List</h4>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleCourseClicks}
                      >
                        Add Course
                      </button>
                    </div>
                    <TableContainer
                      columns={columns}
                      data={courses}
                      onEditClick={handleCourseClick}
                    />
                  </CardBody>
                </Card>
              </Col>
            )}
          </Row>
        </Container>
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {isEdit ? "Edit Course" : "Add Course"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={validation.handleSubmit}>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <Label htmlFor="title"> Course Title</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter Course Title"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.title}
                    invalid={
                      validation.touched.title && !!validation.errors.title
                    }
                  />
                  <FormFeedback>{validation.errors.title}</FormFeedback>
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label htmlFor="description">Course Description</Label>
                  <Input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Enter Course Description"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.description}
                    invalid={
                      validation.touched.description &&
                      !!validation.errors.description
                    }
                  />
                  <FormFeedback>{validation.errors.description}</FormFeedback>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <Label htmlFor="day"> Day</Label>
                  <Input
                    type="select"
                    id="day"
                    name="day"
                    placeholder="Enter day"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.day}
                    invalid={validation.touched.day && !!validation.errors.day}
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
                  <FormFeedback>{validation.errors.day}</FormFeedback>
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label htmlFor="time"> Time</Label>
                  <Input
                    type="time"
                    id="time"
                    name="time"
                    placeholder="Enter time"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.time}
                    invalid={
                      validation.touched.time && !!validation.errors.time
                    }
                  />
                  <FormFeedback>{validation.errors.time}</FormFeedback>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <div className="mb-3">
                  <Label htmlFor="coachName">Coach Name</Label>
                  <Input
                    type="select"
                    id="coachName"
                    name="coachName"
                    placeholder="Enter coach name"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.coachName}
                    invalid={
                      validation.touched.coachName &&
                      !!validation.errors.coachName
                    }
                  >
                    <option value="">Select Coach Name</option>
                    {coaches.map(coach => (
                      <option key={coach.id} value={coach.id}>
                        {coach.firstName} {coach.lastName}
                      </option>
                    ))}
                  </Input>
                  <FormFeedback>{validation.errors.coachName}</FormFeedback>
                </div>
              </Col>
              <Col md="12">
                <div className="mb-3">
                  <Label htmlFor="abonnementType">Abonnement Type</Label>
                  <Input
                    type="select"
                    id="abonnementType"
                    name="abonnementType"
                    placeholder="Enter abonnement type"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.abonnementType}
                    invalid={
                      validation.touched.abonnementType &&
                      !!validation.errors.abonnementType
                    }
                  >
                    <option value="">Select abonnement Type</option>
                    <option value="All">All</option>
                    <option value="Diamond">Diamond</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                  </Input>
                  <FormFeedback>
                    {validation.errors.abonnementType}
                  </FormFeedback>
                </div>
              </Col>
              <Col md="12">
                <div className="mb-3">
                  <Label htmlFor="visibility" style={{ marginRight: "10px" }}>
                    Visibility
                  </Label>
                  <Input
                    type="checkbox"
                    id="visibility"
                    name="visibility"
                    placeholder="Enter visibility"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.visibility}
                    invalid={
                      validation.touched.visibility &&
                      !!validation.errors.visibility
                    }
                  />
                  <FormFeedback>{validation.errors.visibility}</FormFeedback>
                </div>
              </Col>
            </Row>
            <div className="text-end">
              <button type="submit" className="btn btn-primary">
                {isEdit ? "Update" : "Add"}
              </button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
      <ToastContainer />
    </React.Fragment>
  )
}

export default ManageCourses
