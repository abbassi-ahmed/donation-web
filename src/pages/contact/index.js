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
import MessageModal from "components/Modal/messageModal"

const Contact = () => {
  document.title = "Contact "

  const [contacts, setContacts] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [contact, setContact] = useState(null)
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DATABASEURL}/contact/find-all`
        )
        setContacts(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching contacts:", error)
        setLoading(false)
      }
    }

    fetchContacts()
  }, [])

  const toggle = () => {
    setModal(!modal)
  }

  const handleContactClick = contact => {
    setContact(contact)
    setIsEdit(true)
    toggle()
  }

  const handleViewContact = contact => {
    setSelectedContact(contact)
    setShowModal(true)
    console.log(contact)
  }

  const columns = useMemo(
    () => [
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
        header: "Phone",
        accessorKey: "phone",
      },
      {
        header: "Message",
        accessorKey: "message",
        cell: cellProps => (
          <div className="text-truncate" style={{ maxWidth: "150px" }}>
            {cellProps.row.original.message}
          </div>
        ),
      },

      {
        header: "Action",
        cell: cellProps => (
          <div className="d-flex gap-3">
            <Link
              to="#"
              className="text-success"
              onClick={() => handleViewContact(cellProps.row.original)}
            >
              <i className="mdi mdi-eye font-size-18" />
            </Link>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <MessageModal
        show={showModal}
        onHide={() => setShowModal(false)}
        contact={selectedContact}
      />

      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Contacts" breadcrumbItem="Contact List" />
          <Row>
            {isLoading ? (
              <Spinners setLoading={setLoading} />
            ) : (
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <h4 className="card-title">Contact List</h4>
                      {/* <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleContactClicks}
                      >
                        Add Contact
                      </button> */}
                    </div>
                    <TableContainer
                      columns={columns}
                      data={contacts}
                      onEditClick={handleContactClick}
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

export default Contact
