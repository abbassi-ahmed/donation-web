import React from "react"
import { Modal, Button } from "react-bootstrap"

const ContactInfoModal = ({ show, onHide, user }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user ? (
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center float-start">
              <img
                src={user.avatar}
                alt="avatar"
                className="rounded-circle"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
              <div className="ms-3">
                <h4 className="mb-0">{`${user.firstName} ${user.lastName}`}</h4>
                <p className="text-muted mb-0">{user.email}</p>
              </div>
            </div>
            <div>
              {user.subscription ? (
                <div className="mt-3">
                  <h5>Subscription Details</h5>
                  <p>
                    <strong>Title:</strong> {user.subscription.title}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {user.subscription.description}
                  </p>
                  <p>
                    <strong>Price:</strong> ${user.subscription.price}
                  </p>
                  <p>
                    <strong>Duration:</strong> {user.subscription.duration} days
                  </p>
                </div>
              ) : (
                <p className="text-muted">No active subscription</p>
              )}
            </div>
          </div>
        ) : (
          <p>No user selected</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
          style={{
            cursor: "pointer",
            color: "white",
            backgroundColor: "#4CAF50",
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ContactInfoModal
