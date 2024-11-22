import React from "react"
import { Modal, Button } from "react-bootstrap"

const MessageModal = ({ show, onHide, contact }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {contact ? (
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center float-start">
              <div className="ms-3">
                <h4 className="mb-0">{`${contact.firstName} ${contact.lastName}`}</h4>
                <p className="text-muted mb-0">{contact.email}</p>
              </div>
            </div>
            <div>
              <p>
                <strong>Phone:</strong> {contact.phone}
              </p>
              <p>
                <strong>Message:</strong> {contact.message}
              </p>
            </div>
          </div>
        ) : (
          <p>No contact selected</p>
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

export default MessageModal
