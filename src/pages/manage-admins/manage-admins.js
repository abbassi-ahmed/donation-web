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

const ManageAdmins = () => {
  document.title = "Admin List | Skote - React Admin & Dashboard Template"

  const [admins, setAdmins] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [contact, setContact] = useState(null)
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = localStorage.getItem("admin")
        if (user) {
          setUser(JSON.parse(user))
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        setLoading(false)
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DATABASEURL}/admins/find-all`
        )
        if (response.data) {
          setAdmins(response.data.filter(admin => admin.id !== user.id))
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching admins:", error)
        setLoading(false)
      }
    }

    if (user) {
      fetchAdmins()
    }
  }, [user])
  const toggle = () => {
    setModal(!modal)
  }

  const handleAdminClick = admin => {
    setContact(admin)
    setIsEdit(true)
    toggle()
  }

  const handleAdminClicks = () => {
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
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter Your First Name"),
      lastName: Yup.string(),
      email: Yup.string()
        .email("Please Enter Valid Email")
        .required("Please Enter Your Email"),
    }),
    onSubmit: async values => {
      const newAdmin = {
        id: isEdit ? contact.id : Math.floor(Math.random() * 100) + 1,
        firstName: values.firstName,
        lastName: values.lastName || "",
        email: values.email,
        avatar: contact?.avatar || "",
      }

      if (isEdit) {
        try {
          const response = await axios.put(
            `${process.env.REACT_APP_DATABASEURL}/admins/update/${contact.id}`,
            newAdmin
          )
          setAdmins(prevAdmins =>
            prevAdmins.map(admin =>
              admin.id === contact.id ? response.data : admin
            )
          )
          toast.success("Admin updated successfully")
        } catch (error) {
          toast.error("Error updating admin")
          console.error("Error updating admin:", error)
        }
      } else {
        setAdmins(prevAdmins => [...prevAdmins, newAdmin])
      }
      toggle()
      validation.resetForm()
    },
  })

  const onClickDelete = admin => {
    setContact(admin)
    setDeleteModal(true)
  }

  const handleDeleteAdmin = async () => {
    if (contact?.id) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_DATABASEURL}/admins/delete/${contact.id}`
        )
        setAdmins(prevAdmins =>
          prevAdmins.filter(admin => admin.id !== contact.id)
        )
        toast.success("Admin deleted successfully")
      } catch (error) {
        toast.error("Error deleting admin")
        console.error("Error deleting admin:", error)
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
        header: "Action",
        cell: cellProps => (
          <div className="d-flex gap-3">
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
        onDeleteClick={handleDeleteAdmin}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Contacts" breadcrumbItem="Admin List" />
          <Row>
            {isLoading ? (
              <Spinners setLoading={setLoading} />
            ) : (
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <h4 className="card-title">Admin List</h4>
                      {/* <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleAdminClicks}
                      >
                        Add Admin
                      </button> */}
                    </div>
                    <TableContainer
                      columns={columns}
                      data={admins}
                      onEditClick={handleAdminClick}
                    />
                  </CardBody>
                </Card>
              </Col>
            )}
          </Row>
        </Container>
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add Admin</ModalHeader>
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
              <Col md="12">
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

export default ManageAdmins
