import React, { useEffect, useState, useMemo } from "react"
import TableContainer from "components/Common/TableContainer"
import { Card, CardBody, Col, Container, Row } from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import Spinners from "components/Common/Spinner"
import { ToastContainer } from "react-toastify"
import axios from "axios"

const SubscriptionProject = () => {
  document.title = "Subscription"

  const [subscriptions, setSubscriptions] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DATABASEURL}/users/history-payments`
        )

        const flattenedData = response.data.flatMap(user =>
          user.paymentHistory.map(history => ({
            email: user.email,
            subscriptionTitle: history.subscriptionTitle,
            subscriptionPrice: history.subscriptionPrice,
            paymentDate: history.dateStart,
            duration: history.duration,
            endDate: history.dateEnd,
          }))
        )

        setSubscriptions(flattenedData)
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
        header: "Email",
        accessorKey: "email",
        cell: cellProps => (
          <span className="text-dark">{cellProps.getValue()}</span>
        ),
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "Subscription Title",
        accessorKey: "subscriptionTitle",
        cell: cellProps => (
          <span className="text-dark">{cellProps.getValue()}</span>
        ),
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "Subscription Price (TND)",
        accessorKey: "subscriptionPrice",
        cell: cellProps => (
          <span className="text-dark">{cellProps.getValue()}</span>
        ),
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "Payment Date",
        accessorKey: "paymentDate",
        cell: cellProps => (
          <span className="text-dark">
            {new Date(cellProps.getValue()).toLocaleDateString()}
          </span>
        ),
        enableColumnFilter: false,
        enableSorting: false,
      },

      {
        header: "End Date",
        accessorKey: "endDate",
        cell: cellProps => (
          <span className="text-dark">
            {new Date(cellProps.getValue()).toLocaleDateString()}
          </span>
        ),
        enableColumnFilter: false,
        enableSorting: false,
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
