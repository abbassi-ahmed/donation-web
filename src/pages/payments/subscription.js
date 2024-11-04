import React, { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import TableContainer from "components/Common/TableContainer"
import { Card, CardBody, Col, Container, Row } from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import Spinners from "components/Common/Spinner"
import { ToastContainer } from "react-toastify"
import axios from "axios"

const SubscriptionProject = () => {
  document.title = "Subscription Subscription"

  const [subscriptions, setSubscriptions] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DATABASEURL}/subscription/get-subscriptions`
        )

        setSubscriptions(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching subscriptions:", error)
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [])

  const columns = useMemo(
    () => [
      {
        header: "Title",
        accessorKey: "title",
        cell: cellProps => (
          <Link to="#" className="text-dark">
            {cellProps.getValue()}
          </Link>
        ),
      },
      {
        header: "Price (TND)",
        accessorKey: "price",
        cell: cellProps => (
          <span className="text-dark">{cellProps.getValue()}</span>
        ),
      },
      {
        header: "User First Name",
        accessorKey: "users.firstName",
        cell: cellProps => {
          const users = cellProps.row.original.users || []
          return (
            <Link to="#" className="text-dark">
              {users.length > 0 ? users[0].firstName : "N/A"}
            </Link>
          )
        },
      },
      {
        header: "User Last Name",
        accessorKey: "users.lastName",
        cell: cellProps => {
          const users = cellProps.row.original.users || []
          return (
            <Link to="#" className="text-dark">
              {users.length > 0 ? users[0].lastName : "N/A"}
            </Link>
          )
        },
      },
      {
        header: "Start Date",
        accessorKey: "users.dateStart",
        cell: cellProps => {
          const users = cellProps.row.original.users || []
          return (
            <span className="text-dark">
              {users.length > 0
                ? new Date(users[0].dateStart).toLocaleDateString()
                : "N/A"}
            </span>
          )
        },
      },
      {
        header: "End Date",
        accessorKey: "users.dateEnd",
        cell: cellProps => {
          const users = cellProps.row.original.users || []
          return (
            <span className="text-dark">
              {users.length > 0
                ? new Date(users[0].dateEnd).toLocaleDateString()
                : "N/A"}
            </span>
          )
        },
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Projects" breadcrumbItem="Subscriptions" />
          <Row>
            {isLoading ? (
              <Spinners setLoading={setLoading} />
            ) : (
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <h4 className="card-title">Subscription List</h4>
                    </div>
                    <TableContainer columns={columns} data={subscriptions} />
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

export default SubscriptionProject
