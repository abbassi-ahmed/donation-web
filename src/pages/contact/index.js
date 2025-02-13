import React, { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, Col, Container, Row } from "react-bootstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import Spinners from "components/Common/Spinner"
import { ToastContainer } from "react-toastify"
import axios from "axios"
import MessageModal from "components/Modal/messageModal"
import { debounce } from "lodash"
import TableContainer from "components/Common/TableContainer"

const Contact = () => {
  document.title = "Contact "

  const [contacts, setContacts] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)

  const [totalRecords, setTotalRecords] = useState(0)
  const [page, setPage] = useState(1)
  const rowsPerPage = 10
  const [paginationParams, setPaginationParams] = useState({
    pageNumber: page,
    pageSize: rowsPerPage,
    sortOrder: "DESC",
  })

  const handlePageChange = newPage => {
    setPage(newPage)
  }
  const handleSearch = debounce(e => {
    setPaginationParams({
      ...paginationParams,
      searchQuery: e.target.value,
    })
    fetchContacts()
  }, 400)
  const fetchContacts = async () => {
    try {
      const params = new URLSearchParams({
        pageNumber: page,
        pageSize: paginationParams.pageSize,
        sortOrder: paginationParams.sortOrder,
        searchQuery: paginationParams.searchQuery || "",
      })
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/contact/find?${params.toString()}`
      )
      setContacts(response.data.data)
      setTotalRecords(response.data.total)
    } catch (error) {
      console.error("Error fetching contacts:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [paginationParams])

  useEffect(() => {
    fetchContacts()
  }, [page])

  const handleViewContact = contact => {
    setSelectedContact(contact)
    setShowModal(true)
  }

  const columns = useMemo(
    () => [
      {
        header: "First Name",
        accessorKey: "firstName",
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "Last Name",
        accessorKey: "lastName",
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "Phone",
        accessorKey: "phone",
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "Message",
        accessorKey: "message",
        cell: cellProps => (
          <div className="text-truncate" style={{ maxWidth: "150px" }}>
            {cellProps.row.original.message}
          </div>
        ),
        enableColumnFilter: false,
        enableSorting: false,
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
                      <div className="d-flex gap-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search..."
                          onChange={handleSearch}
                        />
                      </div>
                    </div>
                    <TableContainer
                      columns={columns}
                      data={contacts}
                      currentPage={page}
                      pageSize={rowsPerPage}
                      totalRecords={totalRecords}
                      isPagination
                      onEditClick={handleViewContact}
                      onPageChange={handlePageChange}
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
