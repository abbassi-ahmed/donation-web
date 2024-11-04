import React, { useState, useEffect } from "react"
import axios from "axios"
import { Container, Row, Col, Table, Spinner, Button } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { toast } from "react-toastify"
import EditSubscriptionModal from "components/Modal/EditSubscriptionModal"
import DeleteModal from "components/Common/DeleteModal"

const SubscriptionList = () => {
  document.title = "Subscription List"

  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [editModal, setEditModal] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/subscription/find-all`,
        {
          headers: {
            token: localStorage.getItem("authUser")?.replace(/"/g, ""),
          },
        }
      )
      setSubscriptions(response.data)
    } catch (error) {
      toast.error("Failed to load subscriptions.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const toggleEditModal = () => setEditModal(!editModal)

  const handleEdit = subscription => {
    setSelectedSubscription(subscription)
    toggleEditModal()
  }

  const handleSaveFinished = () => {
    toggleEditModal()
    fetchSubscriptions()
  }

  const handleDelete = async id => {
    const token = localStorage.getItem("authUser")?.replace(/"/g, "")
    try {
      await axios.put(
        `${process.env.REACT_APP_DATABASEURL}/subscription/update/${id}`,
        {
          visibility: false,
        },
        {
          headers: { token },
        }
      )
      fetchSubscriptions()
      toast.success("Subscription deleted successfully")
    } catch (error) {
      toast.error("Failed to delete subscription. Please try again.")
    }
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Subscriptions"
            breadcrumbItem="Subscription List"
          />
          <Row>
            <Col lg={12}>
              {loading ? (
                <div className="text-center mt-5">
                  <Spinner color="primary" />
                </div>
              ) : (
                <Table bordered className="mt-4">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.length > 0 ? (
                      subscriptions.map((subscription, index) => (
                        <tr key={subscription.id}>
                          <td>{index + 1}</td>
                          <td>{subscription.title}</td>
                          <td>{subscription.description}</td>
                          <td>{subscription.price} TND</td>
                          <td>{subscription.duration} Days</td>
                          <td>
                            <Button
                              color="info"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(subscription)}
                            >
                              Edit
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => {
                                setSelectedSubscription(subscription)
                                setShowDeleteModal(true)
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No subscriptions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Col>
          </Row>
        </Container>

        {selectedSubscription && (
          <EditSubscriptionModal
            show={editModal}
            toggle={toggleEditModal}
            subscription={selectedSubscription}
            onCloseClick={toggleEditModal}
            onSaveFinished={handleSaveFinished}
          />
        )}
        <DeleteModal
          show={showDeleteModal}
          onCloseClick={() => setShowDeleteModal(false)}
          onDeleteClick={() => {
            handleDelete(selectedSubscription.id)
            setShowDeleteModal(false)
          }}
        />
      </div>
    </React.Fragment>
  )
}

export default SubscriptionList
