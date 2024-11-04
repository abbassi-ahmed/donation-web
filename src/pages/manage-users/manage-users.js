import React, { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import TableContainer from "components/Common/TableContainer"
import { Card, CardBody, Col, Container, Row } from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"
import Breadcrumbs from "components/Common/Breadcrumb"
import DeleteModal from "components/Common/DeleteModal"
import Spinners from "components/Common/Spinner"
import { ToastContainer, toast } from "react-toastify"
import axios from "axios"
import ContactInfoModal from "components/Modal/ContactInfoModal"

const ManageUsers = () => {
  document.title = "User List | Skote - React Admin & Dashboard Template"

  const [users, setUsers] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [contact, setContact] = useState(null)
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DATABASEURL}/users/find-all`
        )
        setUsers(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const toggle = () => {
    setModal(!modal)
  }

  const handleUserClick = user => {
    setContact(user)
    setIsEdit(true)
    toggle()
  }

  const handleViewUser = user => {
    setSelectedUser(user)
    setShowModal(true)
  }
  const handleUserClicks = () => {
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
      const newUser = {
        id: isEdit ? contact.id : Math.floor(Math.random() * 100) + 1,
        firstName: values.firstName,
        lastName: values.lastName || "",
        email: values.email,
        avatar: contact?.avatar || "",
      }

      if (isEdit) {
        try {
          const response = await axios.put(
            `${process.env.REACT_APP_DATABASEURL}/users/update/${contact.id}`,
            newUser
          )
          setUsers(prevUsers =>
            prevUsers.map(user =>
              user.id === contact.id ? response.data : user
            )
          )
          toast.success("User updated successfully")
        } catch (error) {
          toast.error("Error updating user")
          console.error("Error updating user:", error)
        }
      } else {
        setUsers(prevUsers => [...prevUsers, newUser])
      }
      toggle()
      validation.resetForm()
    },
  })

  const onClickDelete = user => {
    setContact(user)
    setDeleteModal(true)
  }

  const handleDeleteUser = async () => {
    if (contact?.id) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_DATABASEURL}/users/delete/${contact.id}`
        )
        setUsers(prevUsers => prevUsers.filter(user => user.id !== contact.id))
        toast.success("User deleted successfully")
      } catch (error) {
        toast.error("Error deleting user")
        console.error("Error deleting user:", error)
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
              className="text-success"
              onClick={() => handleViewUser(cellProps.row.original)}
            >
              <i className="mdi mdi-eye font-size-18" />
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
        onDeleteClick={handleDeleteUser}
        onCloseClick={() => setDeleteModal(false)}
      />
      <ContactInfoModal
        show={showModal}
        onHide={() => setShowModal(false)}
        user={selectedUser}
      />

      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Contacts" breadcrumbItem="User List" />
          <Row>
            {isLoading ? (
              <Spinners setLoading={setLoading} />
            ) : (
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <h4 className="card-title">User List</h4>
                      {/* <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleUserClicks}
                      >
                        Add User
                      </button> */}
                    </div>
                    <TableContainer
                      columns={columns}
                      data={users}
                      onEditClick={handleUserClick}
                    />
                  </CardBody>
                </Card>
              </Col>
            )}
          </Row>
        </Container>
      </div>

      <ToastContainer />
    </React.Fragment>
  )
}

export default ManageUsers
