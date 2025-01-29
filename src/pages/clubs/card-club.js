import PropTypes from "prop-types"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, Col, Button } from "reactstrap"
import axios from "axios"
import { toast } from "react-toastify"
import DeleteModal from "components/Common/DeleteModal"

const CardClub = ({ clubs, fetchClubs }) => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [clubId, setClubId] = useState(null)

  const handleDelete = async clubId => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_DATABASEURL}/clubs/remove/${clubId}`
      )
      fetchClubs()
      setDeleteModal(false)
      toast.success("Club deleted successfully")
    } catch (error) {
      console.error("Error deleting club", error)
      toast.error("Failed to delete club")
    }
  }

  return (
    <>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDelete(clubId)}
        onCloseClick={() => setDeleteModal(false)}
      />
      {(clubs || []).map(club => (
        <Col xl={4} md={6} sm={12} key={club.id} className="mb-4">
          <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
            <div className="position-relative">
              <div
                className="position-relative"
                style={{ filter: "brightness(0.8)" }}
              >
                <img
                  src={club.cover}
                  alt="Cover"
                  className="img-fluid w-100"
                  style={{ height: "150px", objectFit: "cover" }}
                />
              </div>
              <div className="position-absolute top-0 start-0 p-2">
                <img
                  src={club.logo}
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
                  to={`/clubs-overview/${club.id}`}
                  className="text-dark text-decoration-none"
                >
                  {club.name}
                </Link>
              </h5>
              <p className="text-muted text-truncate">{club.description}</p>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => {
                    setClubId(club.id)
                    setDeleteModal(true)
                  }}
                >
                  <i className="mdi mdi-trash-can-outline me-1"></i> Delete
                </Button>
                <Link
                  to={`/clubs-overview/${club.id}`}
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

CardClub.propTypes = {
  clubs: PropTypes.array,
  fetchClubs: PropTypes.func.isRequired,
}

CardClub.defaultProps = {
  clubs: [],
}

export default CardClub
