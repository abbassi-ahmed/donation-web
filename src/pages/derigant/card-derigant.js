import PropTypes from "prop-types"
import React, { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import DeleteModal from "components/Common/DeleteModal"
import EditDerigantModal from "components/Modal/editDerigantModal"

const CardDerigant = ({ derigants, fetchDerigants }) => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [derigantId, setDerigantId] = useState(null)
  const [selectedDerigant, setSelectedDerigant] = useState(null)
  const [editModal, setEditModal] = useState(false)

  const handleDelete = async derigantId => {
    try {
      await axios
        .delete(
          `${process.env.REACT_APP_DATABASEURL}/derigant/remove/${derigantId}`
        )
        .then(response => {
          fetchDerigants()
          setDeleteModal(false)

          toast.success("Derigant deleted successfully")
        })
    } catch (error) {
      console.error("Error deleting blog", error)
    }
  }

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDelete(derigantId)}
        onCloseClick={() => setDeleteModal(false)}
      />
      {selectedDerigant && (
        <EditDerigantModal
          show={editModal}
          toggle={() => setEditModal(!editModal)}
          derigant={selectedDerigant}
          onCloseClick={() => setEditModal(false)}
          onSaveFinished={() => {
            fetchDerigants()
            setEditModal(false)
          }}
        />
      )}

      {(derigants || []).map(derigant => (
        <div key={derigant.id} className="col-xl-3 col-sm-6 mb-4">
          <div className="card h-100 shadow-sm" style={{ maxWidth: "280px" }}>
            <div className="card-body text-center">
              <img
                src={derigant.avatar}
                alt={`${derigant.firstName} ${derigant.lastName}`}
                className="rounded-circle mb-3"
                width="120"
                height="120"
              />
              <h5 className="card-title mb-1">
                {derigant.firstName} {derigant.lastName}
              </h5>
              <p className="text-muted">{derigant.email}</p>
              <div className="mt-3">
                <a
                  href={`https://${derigant.facebook || ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary me-2"
                >
                  <i className="mdi mdi-facebook"></i>
                </a>
                <a
                  href={`https://${derigant.instagram || ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-danger me-2"
                >
                  <i className="mdi mdi-instagram"></i>
                </a>

                <a
                  href={`https://${derigant.twitter || ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-info"
                >
                  <i className="mdi mdi-twitter"></i>
                </a>
              </div>
              <div className="d-flex justify-content-center mt-4">
                <button
                  className="btn btn-primary me-2"
                  onClick={() => {
                    setSelectedDerigant(derigant)
                    setEditModal(true)
                  }}
                >
                  <i className="mdi mdi-pencil align-middle"></i>
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setDerigantId(derigant.id)
                    setDeleteModal(true)
                  }}
                >
                  <i className="mdi mdi-trash-can align-middle"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </React.Fragment>
  )
}

CardDerigant.propTypes = {
  derigants: PropTypes.array,
}

CardDerigant.defaultProps = {
  derigants: [],
}

export default CardDerigant
