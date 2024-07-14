import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { isEmpty, set } from "lodash"

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
import interactionPlugin, { Draggable } from "@fullcalendar/interaction"
import BootstrapTheme from "@fullcalendar/bootstrap"
import allLocales from "@fullcalendar/core/locales-all"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//import Images
import verification from "../../assets/images/verification-img.png"

import DeleteModal from "./DeleteModal"
import axios from "axios"

const Calender = props => {
  //meta title
  document.title = "Calendar | Skote - React Admin & Dashboard Template"

  const [event, setEvent] = useState({})
  const [isEdit, setIsEdit] = useState(false)
  const [events, setEvents] = useState([])
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState()
  const [modalCategory, setModalCategory] = useState(false)
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedImage, setSelectedImage] = useState(null)
  const [img, setImg] = useState(null)

  const handleImageChange = e => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      setImg(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
        eventValidation.setFieldValue("image", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

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

  useEffect(() => {
    fetchEvents()
    new Draggable(document.getElementById("external-events"), {
      itemSelector: ".external-event",
    })
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
      const response = await fetch(
        `${process.env.REACT_APP_DATABASEURL}/events/find-all`
      )
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const addNewEvent = async newEvent => {
    try {
      const data = await axios
        .post(`${process.env.REACT_APP_DATABASEURL}/events/create`, newEvent)
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
      const data = await axios.put(
        `${process.env.REACT_APP_DATABASEURL}/events/update/` +
          updateEventObj.id,
        body
      )
      fetchEvents()
      eventValidation.resetForm()
    } catch (error) {
      console.error("Error updating event:", error)
    }
  }

  const deleteEvent = async eventId => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_DATABASEURL}/events/remove/${eventId}`,
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

  // event validation
  const eventValidation = useFormik({
    enableReinitialize: true,

    initialValues: {
      title: event?.title || "",
      description: event?.description || "",
      startDate: event?.startDate ? event.startDate.split("T")[0] : "",
      endDate: event?.endDate ? event.endDate.split("T")[0] : "",
      startTime: event?.startTime || "",
      endTime: event?.endTime || "",
      image: event?.image || "",
      location: event?.location || "",
      category: event?.category || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Your Event Title"),
      description: Yup.string().required("Please Enter Your Event description"),
      startDate: Yup.date().required("Please Enter Your Event Start Date"),
      endDate: Yup.date().required("Please Enter Your Event End Date"),
      startTime: Yup.string().required("Please Enter Your Event Start Time"),
      endTime: Yup.string().required("Please Enter Your Event End Time"),
      image: Yup.string().required("Please Enter Your Event Image"),
      location: Yup.string().required("Please Enter Your Event Location"),
      category: Yup.string().required("Please Enter Your Event Category"),
    }),
    onSubmit: values => {
      if (isEdit) {
        const updateEventObj = {
          id: event.id,
          title: values.title,
          description: values.description,
          startDate: values.startDate,
          endDate: values.endDate,
          startTime: values.startTime,
          endTime: values.endTime,
          image: img ? img : values.image,
          location: values.location,
          category: values.category,
        }
        // update event
        updateEvent(updateEventObj)
        eventValidation.resetForm()
      } else {
        const newEventObj = {
          title: values.title,
          description: values.description,
          startDate: values.startDate,
          endDate: values.endDate,
          startTime: values.startTime,
          endTime: values.endTime,
          image: values.image,
          location: values.location,
          category: values.category,
        }
        // save new event
        addNewEvent(newEventObj)
        eventValidation.resetForm()
      }
      toggle()
    },
  })

  /**
   * Handling the modal state
   */
  const toggle = () => {
    if (modalCategory) {
      setModalCategory(false)
      setEvent({})
      setIsEdit(false)
    } else {
      setModalCategory(true)
    }
  }

  /**
   * Handling date click on calendar
   */
  const handleDateClick = arg => {
    const date = arg["date"]
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${day}`
    setSelectedDay(formattedDate)
    setEvent({
      title: "",
      description: "",
      startDate: formattedDate,
      endDate: formattedDate,
      startTime: "",
      endTime: "",
      image: "",
      location: "",
      category: "",
    })
    setIsEdit(false)
    toggle()
  }

  /**
   * Handling click on event on calendar
   */
  const handleEventClick = arg => {
    const event = arg.event
    const eventId = event.id
    const eventTitle = event.title
    const eventdescription = event.extendedProps.description
    const eventStartDate = event.startStr
    const eventEndDate = event.endStr
    const eventStartTime = event.startTime
    const eventEndTime = event.endTime
    const eventImage = event.extendedProps.image
    const eventLocation = event.extendedProps.location
    const eventCategory = event.extendedProps.category

    console.log("event", event)
    console.log("event", eventStartTime)

    setEvent({
      id: eventId,
      title: eventTitle,
      description: eventdescription,
      startDate: eventStartDate,
      endDate: eventEndDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
      image: eventImage,
      location: eventLocation,
      category: eventCategory,
    })
    setDeleteId(event.id)
    setIsEdit(true)
    toggle()
  }

  /**
   * On delete event
   */
  const handleDeleteEvent = () => {
    if (deleteId) {
      deleteEvent(deleteId)
    }
    setDeleteModal(false)
  }

  const onDrop = event => {
    // Implement drop functionality if needed
  }

  //set the local language
  const handleChangeLocals = value => {
    setIsLocal(value)
  }

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteEvent}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-description mt-5">
        <Container fluid={true}>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Calendar" breadcrumbItem="Full Calendar" />
          <Row>
            <Col xs={12}>
              <Row>
                <Col xl={3}>
                  <Card>
                    <CardBody>
                      <div className="d-flex gap-2">
                        <div className="flex-grow-1">
                          <select
                            id="locale-selector"
                            className="form-select"
                            defaultValue={isLocal}
                            onChange={event => {
                              const selectedValue = event.target.value
                              const selectedLocale = allLocales.find(
                                locale => locale.code === selectedValue
                              )
                              handleChangeLocals(selectedLocale)
                            }}
                          >
                            {(allLocales || []).map((localeCode, key) => (
                              <option key={key} value={localeCode.code}>
                                {localeCode.code}
                              </option>
                            ))}
                          </select>
                        </div>
                        <Button
                          color="primary"
                          className="font-16"
                          onClick={toggle}
                        >
                          <i className="mdi mdi-plus-circle-outline"></i> Create
                          New Event
                        </Button>
                      </div>

                      <div id="external-events" className="mt-3">
                        <p className="text-muted"></p>
                      </div>

                      <Row className="justify-description-center mt-5">
                        <img
                          src={verification}
                          alt=""
                          className="img-fluid d-block"
                        />
                      </Row>
                    </CardBody>
                  </Card>
                </Col>

                <Col xl={9}>
                  <Card>
                    <CardBody>
                      {/* fullcalendar control */}
                      <FullCalendar
                        plugins={[
                          BootstrapTheme,
                          dayGridPlugin,
                          listPlugin,
                          interactionPlugin,
                        ]}
                        slotDuration={"00:15:00"}
                        handleWindowResize={true}
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
                          description: event.description,
                          image: event.image,
                        }))}
                        editable={true}
                        droppable={true}
                        selectable={true}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        drop={onDrop}
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
        <div className="modal-description">
          <ModalHeader toggle={toggle}>
            {isEdit ? "Edit Event" : "Add New Event"}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={eventValidation.handleSubmit}>
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
                    <Label htmlFor="validationCustom02">
                      Event description
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="validationCustom02"
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
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="validationCustom03">Start Date</Label>
                    <Input
                      type="date"
                      className="form-control"
                      id="validationCustom03"
                      name="startDate"
                      value={eventValidation.values.startDate}
                      onChange={eventValidation.handleChange}
                      invalid={!!eventValidation.errors.startDate}
                    />
                    <FormFeedback>
                      {eventValidation.errors.startDate}
                    </FormFeedback>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="validationCustom04">End Date</Label>
                    <Input
                      type="date"
                      className="form-control"
                      id="validationCustom04"
                      name="endDate"
                      value={eventValidation.values.endDate}
                      onChange={eventValidation.handleChange}
                      invalid={!!eventValidation.errors.endDate}
                    />
                    <FormFeedback>
                      {eventValidation.errors.endDate}
                    </FormFeedback>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="validationCustom05">Start Time</Label>
                    <Input
                      type="time"
                      className="form-control"
                      id="validationCustom05"
                      name="startTime"
                      value={eventValidation.values.startTime}
                      onChange={eventValidation.handleChange}
                      invalid={!!eventValidation.errors.startTime}
                    />
                    <FormFeedback>
                      {eventValidation.errors.startTime}
                    </FormFeedback>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="validationCustom06">End Time</Label>
                    <Input
                      type="time"
                      className="form-control"
                      id="validationCustom06"
                      name="endTime"
                      value={eventValidation.values.endTime}
                      onChange={eventValidation.handleChange}
                      invalid={!!eventValidation.errors.endTime}
                    />
                    <FormFeedback>
                      {eventValidation.errors.endTime}
                    </FormFeedback>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="validationCustom07">Event location</Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="validationCustom07"
                      name="location"
                      value={eventValidation.values.location}
                      onChange={eventValidation.handleChange}
                      invalid={!!eventValidation.errors.location}
                    />
                    <FormFeedback>
                      {eventValidation.errors.location}
                    </FormFeedback>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="validationCustom08">Event category</Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="validationCustom08"
                      name="category"
                      value={eventValidation.values.category}
                      onChange={eventValidation.handleChange}
                      invalid={!!eventValidation.errors.category}
                    />
                    <FormFeedback>
                      {eventValidation.errors.category}
                    </FormFeedback>
                  </div>
                </Col>
              </Row>
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
                  {eventValidation.touched.image &&
                  eventValidation.errors.image ? (
                    <FormFeedback type="invalid" className="d-block">
                      {eventValidation.errors.image}
                    </FormFeedback>
                  ) : null}
                </div>
              </div>

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
  isLocal: PropTypes.object,
  event: PropTypes.object,
  isEdit: PropTypes.bool,
  deleteModal: PropTypes.bool,
  modalCategory: PropTypes.bool,
  selectedDay: PropTypes.number,
}

export default Calender
