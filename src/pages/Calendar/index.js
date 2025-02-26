import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { isEmpty } from "lodash"
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
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  UncontrolledTooltip,
} from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"
import BootstrapTheme from "@fullcalendar/bootstrap"
import "flatpickr/dist/themes/material_blue.css"
import moment from "moment"
import FlatPickr from "react-flatpickr"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import verification from "../../assets/images/verification-img.png"
import imageCompression from "browser-image-compression"

import DeleteModal from "./DeleteModal"
import axios from "axios"
import { ListGroup } from "react-bootstrap"

const Calender = props => {
  document.title = "Action"

  const [event, setEvent] = useState({})
  const [isEdit, setIsEdit] = useState(false)
  const [events, setEvents] = useState([])
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState()
  const [modalCategory, setModalCategory] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [img, setImg] = useState(null)
  const [isLocal, setIsLocal] = useState({
    code: "en-nz",
    week: {
      dow: 1,
      doy: 4,
    },
    buttonHints: {
      prev: "Previous $0",
      next: "Next $0",
      today: "This $0",
    },
    viewHint: "$0 view",
    navLinkHint: "Go to $0",
  })

  const handleImageChange = async e => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      }

      try {
        const compressedFile = await imageCompression(file, options)
        setImg(compressedFile)

        const reader = new FileReader()
        reader.onloadend = () => {
          setSelectedImage(reader.result)
          eventValidation.setFieldValue("image", reader.result)
        }
        reader.readAsDataURL(compressedFile)
      } catch (error) {
        console.error("Error compressing image:", error)
      }
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (!modalCategory && !isEmpty(event) && !!isEdit) {
      setTimeout(() => {
        setEvent({})
        setIsEdit(false)
      }, 500)
    }
  }, [modalCategory, event, isEdit])

  const fetchEvents = async () => {
    try {
      const startDateString = startDate.split("T")[0]
      const endDateString = endDate.split("T")[0]

      const res = await axios.post(
        `${process.env.REACT_APP_DATABASEURL}/events/find`,
        {
          start: startDateString,
          end: endDateString,
        }
      )

      setEvents(prevEvents => {
        const existingIds = new Set(prevEvents.map(event => event.id))
        const filteredEvents = res.data.filter(
          event => !existingIds.has(event.id)
        )
        return [...prevEvents, ...filteredEvents]
      })
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [startDate, endDate])

  const addNewEvent = async newEvent => {
    try {
      const formData = new FormData()
      formData.append("image", newEvent.image)
      formData.append("title", newEvent.title)
      formData.append("category", newEvent.category)
      formData.append("description", newEvent.description)
      formData.append("startDate", newEvent.startDate)
      formData.append("endDate", newEvent.endDate)

      await axios
        .post(`${process.env.REACT_APP_DATABASEURL}/events/create`, formData)
        .then(res => {
          fetchEvents()
          eventValidation.resetForm()
          setImg(null)
          setSelectedImage(null)
        })
    } catch (error) {
      console.error("Error adding new event:", error)
    }
  }

  const updateEvent = async updateEventObj => {
    try {
      const body = structuredClone(updateEventObj)
      delete body.id
      const formData = new FormData()

      formData.append("image", img || updateEventObj.image)
      formData.append("title", updateEventObj.title)
      formData.append("category", updateEventObj.category)
      formData.append("description", updateEventObj.description)
      formData.append("startDate", updateEventObj.startDate)
      formData.append("endDate", updateEventObj.endDate)

      await axios.put(
        `${process.env.REACT_APP_DATABASEURL}/events/update/` +
          updateEventObj.id,
        formData
      )
      fetchEvents()
      eventValidation.resetForm()
      setImg(null)
      setSelectedImage(null)
    } catch (error) {
      console.error("Error updating event:", error)
    }
  }

  const eventValidation = useFormik({
    enableReinitialize: true,

    initialValues: {
      title: event?.title || "",
      category: event?.category || "",
      description: event?.description || "",
      startDate: event?.startDate ? event.startDate.split("T")[0] : "",
      endDate: event?.endDate ? event.endDate.split("T")[0] : "",
      image: event?.image || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Your Event Title"),
      category: Yup.string().required("Please Enter Your Event Category"),
      description: Yup.string().required("Please Enter Your Event Description"),
      startDate: Yup.date().required("Please Enter Your Event Start Date"),
      endDate: Yup.date().required("Please Enter Your Event End Date"),
      image: Yup.string().required("Please Enter Your Event Image"),
    }),
    onSubmit: values => {
      if (isEdit) {
        const updateEventObj = {
          id: event.id,
          title: values.title,
          category: values.category,
          description: values.description,
          startDate: values.startDate,
          endDate: values.endDate,
          image: img ? img : values.image,
        }
        updateEvent(updateEventObj)
        eventValidation.resetForm()
      } else {
        const newEventObj = {
          title: values.title,
          category: values.category,
          description: values.description,
          startDate: values.startDate,
          endDate: values.endDate,
          image: img ? img : values.image,
        }
        addNewEvent(newEventObj)
        eventValidation.resetForm()
      }
      toggle()
    },
  })

  const toggle = () => {
    if (modalCategory) {
      setModalCategory(false)
      setEvent({})
      setIsEdit(false)
    } else {
      setModalCategory(true)
    }
  }

  const handleDateClick = arg => {
    const date = arg["date"]
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${day}`
    setEvent({
      title: "",
      category: "",
      description: "",
      startDate: formattedDate,
      endDate: formattedDate,
      image: "",
    })
    setIsEdit(false)
    toggle()
  }

  const handleEventClick = arg => {
    const event = arg.event
    const eventId = event.id
    const eventTitle = event.title
    const eventCategory = event.extendedProps.category
    const eventDescription = event.extendedProps.description
    const eventStartDate = event.startStr
    const eventEndDate = event.endStr ? event.endStr : eventStartDate
    const eventImage = event.extendedProps.image
    console.log(eventImage)
    setEvent({
      id: eventId,
      title: eventTitle,
      category: eventCategory,
      description: eventDescription,
      startDate: eventStartDate,
      endDate: eventEndDate,
      image: eventImage,
    })
    setDeleteId(event.id)
    setIsEdit(true)
    toggle()
  }

  const handleDeleteEvent = async () => {
    if (deleteId) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_DATABASEURL}/events/remove/${deleteId}`,
          {
            method: "DELETE",
          }
        )
        if (response.ok) {
          fetchEvents()
        }
      } catch (error) {
        console.error("Error deleting event:", error)
      }
    }
    setDeleteModal(false)
  }

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteEvent}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content mt-5">
        <Container fluid={true}>
          <Breadcrumbs title="Actions" breadcrumbItem="Manage Actions" />
          <Row>
            <Col xs={12}>
              <Row>
                <Col xl={3}>
                  <Card>
                    <CardBody>
                      <div style={{ width: "100%" }}>
                        <Button
                          color="primary"
                          className="font-16"
                          onClick={toggle}
                          style={{ width: "100%" }}
                        >
                          <i className="mdi mdi-plus-circle-outline"></i> Create
                          New Event
                        </Button>
                      </div>
                      {events && events.length > 0 ? (
                        <div className="mt-4">
                          <h5 className="font-size-14 mb-3">Events</h5>
                          <Card className="shadow-sm">
                            <ListGroup variant="flush">
                              {events.map((event, index) => (
                                <ListGroup.Item key={index}>
                                  <Row className="align-items-center">
                                    <Col xs="auto" className="text-primary">
                                      <i className="bx bx-calendar-event fs-4"></i>
                                    </Col>
                                    <Col>
                                      <h6 className="mb-1">{event.title}</h6>
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <small className="text-muted">
                                          Category: {event.category}
                                        </small>
                                        <small className="text-muted">
                                          Date: {event.startDate} -{" "}
                                          {event.endDate}
                                        </small>
                                      </div>
                                    </Col>
                                  </Row>
                                </ListGroup.Item>
                              ))}
                            </ListGroup>
                          </Card>
                        </div>
                      ) : (
                        <Row className="justify-content-center mt-5">
                          <img
                            src={verification}
                            alt=""
                            className="img-fluid d-block"
                          />
                        </Row>
                      )}
                    </CardBody>
                  </Card>
                </Col>

                <Col xl={9}>
                  <Card>
                    <CardBody>
                      <FullCalendar
                        plugins={[
                          BootstrapTheme,
                          dayGridPlugin,
                          listPlugin,
                          interactionPlugin,
                        ]}
                        slotDuration={"00:15:00"}
                        handleWindowResize={true}
                        datesSet={info => {
                          setStartDate(info.startStr)
                          setEndDate(info.endStr)
                        }}
                        themeSystem="bootstrap"
                        headerToolbar={{
                          left: "prev,next today",
                          center: "title",
                          right: "dayGridMonth,dayGridWeek,dayGridDay,listWeek",
                        }}
                        locale={isLocal}
                        events={events.map(event => ({
                          id: event.id,
                          title: event.title,
                          start: event.startDate,
                          end: event.endDate,
                          category: event.category,
                          description: event.description,
                          image: event.image,
                        }))}
                        editable={false}
                        droppable={true}
                        selectable={true}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <Modal
        isOpen={modalCategory}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="exampleModal"
        tabIndex="-1"
        toggle={toggle}
      >
        <div className="modal-content">
          <ModalHeader toggle={toggle}>
            {isEdit ? "Edit Event" : "Add New Event"}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={eventValidation.handleSubmit}>
              <div className="mb-3">
                <Label className="form-label">Event Image</Label>
                <div className="text-center">
                  <div className="position-relative d-inline-block">
                    <div className="position-absolute bottom-0 end-0">
                      <Label
                        htmlFor="project-image-input"
                        className="mb-0"
                        id="eventInput"
                      >
                        <div className="avatar-xs">
                          <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">
                            <i className="bx bxs-image-alt"></i>
                          </div>
                        </div>
                      </Label>
                      <UncontrolledTooltip
                        placement="right"
                        target="eventInput"
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
                    {selectedImage || event.image ? (
                      <div className="avatar-lg me-4">
                        <div className="rounded-circle overflow-hidden d-inline-block">
                          <img
                            src={selectedImage || img || event.image || ""}
                            id="projectlogo-img"
                            alt=""
                            height="100"
                            width="115px"
                            style={{ borderRadius: "50%" }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar-xl">
                        <div className="avatar-title bg-light rounded-circle">
                          <img
                            src={""}
                            id="projectlogo-img"
                            alt=""
                            className="avatar-md h-auto rounded-circle"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {eventValidation.touched.image &&
                  eventValidation.errors.image ? (
                    <FormFeedback type="invalid" className="d-block">
                      {eventValidation.errors.image}
                    </FormFeedback>
                  ) : null}
                </div>
              </div>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="validationCustom01">Event Title</Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="validationCustom01"
                      name="title"
                      value={eventValidation.values.title}
                      onChange={eventValidation.handleChange}
                      invalid={!!eventValidation.errors.title}
                    />
                    <FormFeedback>{eventValidation.errors.title}</FormFeedback>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="validationCustom02">Event Category</Label>
                    <Input
                      type="select"
                      className="form-control"
                      id="validationCustom02"
                      name="category"
                      value={eventValidation.values.category}
                      onChange={eventValidation.handleChange}
                      invalid={!!eventValidation.errors.category}
                    >
                      <option value="">Select Category</option>
                      <option value="event">Événement</option>
                      <option value="project">Projet</option>
                      <option value="activity">Activité</option>
                    </Input>
                    <FormFeedback>
                      {eventValidation.errors.category}
                    </FormFeedback>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="validationCustom03">Start Date</Label>
                    <FlatPickr
                      className="form-control d-block"
                      id="startDate"
                      name="startDate"
                      placeholder="Select date"
                      options={{
                        mode: "single",
                        dateFormat: "d M, Y",
                      }}
                      value={[new Date(eventValidation.values.startDate)]}
                      onChange={customerdate =>
                        eventValidation.setFieldValue(
                          "startDate",
                          moment(customerdate[0]).format("YYYY-MM-DD")
                        )
                      }
                    />

                    <FormFeedback>
                      {eventValidation.errors.startDate}
                    </FormFeedback>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="validationCustom04">End Date</Label>

                    <FlatPickr
                      className="form-control d-block"
                      id="endDate"
                      name="endDate"
                      placeholder="Select date"
                      options={{
                        mode: "single",
                        dateFormat: "d M, Y",
                      }}
                      value={[new Date(eventValidation.values.endDate)]}
                      onChange={customerdate =>
                        eventValidation.setFieldValue(
                          "endDate",
                          moment(customerdate[0]).format("YYYY-MM-DD")
                        )
                      }
                    />
                    <FormFeedback>
                      {eventValidation.errors.endDate}
                    </FormFeedback>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <div className="mb-3">
                    <Label htmlFor="validationCustom03">
                      Event Description
                    </Label>
                    <Input
                      type="textarea"
                      className="form-control"
                      id="validationCustom03"
                      name="description"
                      value={eventValidation.values.description}
                      onChange={eventValidation.handleChange}
                      invalid={!!eventValidation.errors.description}
                    />
                    <FormFeedback>
                      {eventValidation.errors.description}
                    </FormFeedback>
                  </div>
                </Col>
              </Row>

              <Row className="mt-2">
                <Col xs={6}>
                  {isEdit && (
                    <Button
                      type="button"
                      color="btn btn-danger"
                      id="btn-delete-event"
                      onClick={() => {
                        toggle()
                        setDeleteModal(true)
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </Col>

                <Col xs={6} className="text-end">
                  <Button
                    color="light"
                    type="button"
                    className="me-1"
                    onClick={toggle}
                  >
                    Close
                  </Button>
                  <Button type="submit" color="success" id="btn-save-event">
                    Save
                  </Button>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </div>
      </Modal>
    </React.Fragment>
  )
}

Calender.propTypes = {
  events: PropTypes.array,
  event: PropTypes.object,
  isEdit: PropTypes.bool,
  deleteModal: PropTypes.bool,
  modalCategory: PropTypes.bool,
  selectedDay: PropTypes.number,
}

export default Calender
