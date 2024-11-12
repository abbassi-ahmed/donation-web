import React, { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import TableContainer from "components/Common/TableContainer"
import { Card, CardBody, Col, Container, Row } from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import Spinners from "components/Common/Spinner"
import { ToastContainer } from "react-toastify"
import axios from "axios"

const DonationProject = () => {
  document.title = "Donation"

  const [projects, setProjects] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DATABASEURL}/project-donation/find-all`
        )
        setProjects(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const toggle = () => {
    setModal(!modal)
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
                  <img
                    src={cell.row.original.user.avatar}
                    alt={cell.row.original.user.firstName}
                    width={40}
                    height={40}
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                  />
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
        cell: cellProps => (
          <Link to="#" className="text-dark">
            {cellProps.row.original.user.firstName}
          </Link>
        ),
      },
      {
        header: "Last Name",
        accessorKey: "lastName",
        cell: cellProps => (
          <Link to="#" className="text-dark">
            {cellProps.row.original.user.lastName}
          </Link>
        ),
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: cellProps => (
          <Link to="#" className="text-dark">
            {cellProps.row.original.user.email}
          </Link>
        ),
      },

      {
        header: "#",
        accessorKey: "projectPicture",
        enableColumnFilter: false,
        cell: cellProps => (
          <span
            className="avatar-xs"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
              overflow: "hidden",
              borderRadius: "50%",
            }}
          >
            <img
              src={cellProps.row.original.project.image}
              alt={cellProps.row.original.project.name}
              style={{
                objectFit: "cover",
                width: "40px",
                height: "40px",
              }}
            />
          </span>
        ),
      },
      {
        header: "Name Donation",
        accessorKey: "name",
        cell: cellProps => (
          <Link to="#" className="text-dark">
            {cellProps.row.original.project.name}
          </Link>
        ),
      },

      {
        header: "Amount",
        accessorKey: "amount",

        cell: cellProps => (
          <Link to="#" className="text-dark">
            {cellProps.row.original.amount} TND
          </Link>
        ),
      },
      {
        header: "Target",
        accessorKey: "target",
        cell: cellProps => (
          <Link to="#" className="text-dark">
            {cellProps.row.original.project.target} TND
          </Link>
        ),
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Projects" breadcrumbItem="Donations" />
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
                    <TableContainer columns={columns} data={projects} />
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

export default DonationProject
