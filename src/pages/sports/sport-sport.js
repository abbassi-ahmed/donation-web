import PropTypes from "prop-types"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, Col, Button } from "reactstrap"
import axios from "axios"
import { toast } from "react-toastify"
import DeleteModal from "components/Common/DeleteModal"

const CardSport = ({ sports, fetchSports }) => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [sportId, setSportId] = useState(null)

  const handleDelete = async sportId => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_DATABASEURL}/sports/remove/${sportId}`
      )
      fetchSports()
      setDeleteModal(false)
      toast.success("Sport deleted successfully")
    } catch (error) {
      console.error("Error deleting sport", error)
      toast.error("Failed to delete sport")
    }
  }

  return (
    <>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDelete(sportId)}
        onCloseClick={() => setDeleteModal(false)}
      />
      {(sports || []).map(sport => (
        <Col xl={4} md={6} sm={12} key={sport.id} className="mb-4">
          <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
            <div className="position-relative">
              <div
                className="position-relative"
                style={{ filter: "brightness(0.8)" }}
              >
                <img
                  src={sport.cover}
                  alt="Cover"
                  className="img-fluid w-100"
                  style={{ height: "150px", objectFit: "cover" }}
                />
              </div>
              <div className="position-absolute top-0 start-0 p-2">
                <img
                  src={sport.logo}
                  alt="Logo"
                  className="rounded-circle border shadow"
                  width="60"
                  height="60"
                />
              </div>
            </div>
            <CardBody>
              <h5 className="text-truncate font-size-16">
                <Link
                  to={`/sports-overview/${sport.id}`}
                  className="text-dark text-decoration-none"
                >
                  {sport.name}
                </Link>
              </h5>
              <p className="text-muted text-truncate">{sport.description}</p>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => {
                    setSportId(sport.id)
                    setDeleteModal(true)
                  }}
                >
                  <i className="mdi mdi-trash-can-outline me-1"></i> Delete
                </Button>
                <Link
                  to={`/sports-overview/${sport.id}`}
                  className="btn btn-primary btn-sm"
                >
                  <i className="mdi mdi-eye me-1"></i> View
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </>
  )
}

CardSport.propTypes = {
  sports: PropTypes.array,
  fetchSports: PropTypes.func.isRequired,
}

CardSport.defaultProps = {
  sports: [],
}

export default CardSport
