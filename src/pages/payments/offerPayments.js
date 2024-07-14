import React, { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import TableContainer from "components/Common/TableContainer"
import { Card, CardBody, Col, Container, Row } from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import Spinners from "components/Common/Spinner"
import { ToastContainer } from "react-toastify"
import axios from "axios"

const OfferPayments = () => {
  document.title = "Offer Payment"

  const [offer, setOffer] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DATABASEURL}/users-offers/find-all`
        )
        setOffer(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
        setLoading(false)
      }
    }

    fetchOffer()
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
                    alt=""
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
        header: "Amount",
        accessorKey: "amount",
        cell: cellProps => (
          <Link to="#" className="text-dark">
            {cellProps.row.original.amount}
          </Link>
        ),
      },
      {
        header: "Name Abonnement",
        accessorKey: "name",
        cell: cellProps => (
          <Link to="#" className="text-dark">
            {cellProps.row.original.offer.name}
          </Link>
        ),
      },

      {
        header: "Duration",
        accessorKey: "duration",
        cell: cellProps => (
          <Link to="#" className="text-dark">
            {cellProps.row.original.offer.duration}
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
          <Breadcrumbs title="Offer" breadcrumbItem="Payments" />
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
                    <TableContainer columns={columns} data={offer} />
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

export default OfferPayments
