import React, { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Pagination,
} from "react-bootstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import Spinners from "components/Common/Spinner"
import { ToastContainer } from "react-toastify"
import axios from "axios"
import MessageModal from "components/Modal/messageModal"

const Contact = () => {
  document.title = "Contact "

  const [contacts, setContacts] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(0)

  useEffect(() => {
    fetchContacts(currentPage, pageSize)
  }, [currentPage, pageSize])

  const fetchContacts = async (page, size) => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/contact/find-all?page=${page}&pageSize=${size}`
      )
      setContacts(response.data.data)
      setTotalRecords(response.data.total)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching contacts:", error)
      setLoading(false)
    }
  }

  const handleViewContact = contact => {
    setSelectedContact(contact)
    setShowModal(true)
  }

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
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

  const renderPagination = () => {
    const totalPages = Math.ceil(totalRecords / pageSize)
    let items = []
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      )
    }
    return (
      <Pagination>
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {items}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    )
  }

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
                    </div>
                    <table className="table">
                      <thead>
                        <tr>
                          {columns.map(column => (
                            <th key={column.accessorKey}>{column.header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((contact, index) => (
                          <tr key={index}>
                            {columns.map(column => (
                              <td key={column.accessorKey}>
                                {column.cell
                                  ? column.cell({ row: { original: contact } })
                                  : contact[column.accessorKey]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <div>
                        Showing {contacts.length} of {totalRecords} Results
                      </div>
                      {renderPagination()}
                    </div>
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
