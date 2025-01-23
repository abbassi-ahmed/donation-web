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

const ManageCoaches = () => {
  document.title = "Coach List"

  const [coaches, setCoaches] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [contact, setContact] = useState(null)
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DATABASEURL}/coach/find-all`
        )
        if (response.data) {
          setCoaches(response.data)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching Coaches:", error)
        setLoading(false)
      }
    }

    fetchCoaches()
  }, [])
  const toggle = () => {
    setModal(!modal)
  }

  const handleCoachClick = coach => {
    setContact(coach)
    setIsEdit(true)
    toggle()
  }

  const handleCoachClicks = () => {
    setContact(null)
    setIsEdit(false)
    toggle()
  }

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: contact ? contact.firstName : "",
      lastName: contact ? contact.lastName : "",
      email: contact?.email || "",
      specialization: contact?.specialization || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter Your First Name"),
      lastName: Yup.string(),
      email: Yup.string()
        .email("Please Enter Valid Email")
        .required("Please Enter Your Email"),
      specialization: Yup.string().required("Please Enter Your Specialization"),
    }),
    onSubmit: async values => {
      const newCoach = {
        id: isEdit ? contact.id : Math.floor(Math.random() * 100) + 1,
        firstName: values.firstName,
        lastName: values.lastName || "",
        email: values.email,
        avatar: contact?.avatar || "",
        specialization: values.specialization,
      }

      if (isEdit) {
        try {
          const response = await axios.put(
            `${process.env.REACT_APP_DATABASEURL}/coach/update-profile/${contact.id}`,
            newCoach
          )
          setCoaches(prevCoaches =>
            prevCoaches.map(coach =>
              coach.id === contact.id ? response.data : coach
            )
          )
          toast.success("Coach updated successfully")
          setIsEdit(false)
        } catch (error) {
          toast.error("Error updating Coach")
          console.error("Error updating Coach:", error)
        }
      } else {
        setCoaches(prevCoaches => [...prevCoaches, newCoach])
      }
      toggle()
      validation.resetForm()
    },
  })

  const onClickDelete = coach => {
    setContact(coach)
    setDeleteModal(true)
  }

  const handleDeleteCoach = async () => {
    if (contact?.id) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_DATABASEURL}/coach/delete/${contact.id}`
        )
        setCoaches(prevCoaches =>
          prevCoaches.filter(coach => coach.id !== contact.id)
        )
        toast.success("Coach deleted successfully")
      } catch (error) {
        toast.error("Error deleting Coach")
        console.error("Error deleting Coach:", error)
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
                  {cell.row.original.firstName.charAt(0)}
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
        header: "First Name",
        accessorKey: "firstName",
      },
      {
        header: "Last Name",
        accessorKey: "lastName",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Specialization",
        accessorKey: "specialization",
      },

      {
        header: "Action",
        cell: cellProps => (
          <div className="d-flex gap-3">
            <Link
              to="#"
              className="text-success"
              onClick={() => handleCoachClick(cellProps.row.original)}
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
        onDeleteClick={handleDeleteCoach}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Contacts" breadcrumbItem="Coach List" />
          <Row>
            {isLoading ? (
              <Spinners setLoading={setLoading} />
            ) : (
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <h4 className="card-title">Coach List</h4>
                      {/* <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleCoachClicks}
                      >
                        Add Coach
                      </button> */}
                    </div>
                    <TableContainer
                      columns={columns}
                      data={coaches}
                      onEditClick={handleCoachClick}
                    />
                  </CardBody>
                </Card>
              </Col>
            )}
          </Row>
        </Container>
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add Coach</ModalHeader>
        <ModalBody>
          <Form onSubmit={validation.handleSubmit}>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter First Name"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.firstName}
                    invalid={
                      validation.touched.firstName &&
                      !!validation.errors.firstName
                    }
                  />
                  <FormFeedback>{validation.errors.firstName}</FormFeedback>
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter Last Name"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.lastName}
                    invalid={
                      validation.touched.lastName &&
                      !!validation.errors.lastName
                    }
                  />
                  <FormFeedback>{validation.errors.lastName}</FormFeedback>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter Email"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.email}
                    invalid={
                      validation.touched.email && !!validation.errors.email
                    }
                  />
                  <FormFeedback>{validation.errors.email}</FormFeedback>
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    type="text"
                    id="specialization"
                    name="specialization"
                    placeholder="Enter Specialization"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.specialization}
                    invalid={
                      validation.touched.specialization &&
                      !!validation.errors.specialization
                    }
                  />
                  <FormFeedback>
                    {validation.errors.specialization}
                  </FormFeedback>
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

export default ManageCoaches
