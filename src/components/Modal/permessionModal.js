import React, { useEffect } from "react"
import { Modal, Button } from "react-bootstrap"

const PermissonModal = ({
  show,
  onHide,
  user,
  permission,
  selectedPermissions,
  setSelectedPermissions,
  handleUpdatePermission,
}) => {
  useEffect(() => {
    const initialSelected = user?.permissions?.map(p => p.id) || []
    setSelectedPermissions(initialSelected)
  }, [user, show])

  const isPermissionChecked = permissionId => {
    return selectedPermissions.includes(permissionId)
  }

  const handlePermissionChange = permissionId => {
    setSelectedPermissions(prevState =>
      prevState.includes(permissionId)
        ? prevState.filter(id => id !== permissionId)
        : [...prevState, permissionId]
    )
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user ? (
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center float-start">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
              ) : (
                <div className="avatar-md">
                  <span className="avatar-title rounded-circle">
                    {user.firstName.charAt(0)}
                  </span>
                </div>
              )}
              <div className="ms-3">
                <h4 className="mb-0">{`${user.firstName} ${user.lastName}`}</h4>
                <p className="text-muted mb-0">{user.email}</p>
              </div>
            </div>
            <div>
              {permission && permission.length > 0 ? (
                <div className="mt-3">
                  <h5> Available Permissions</h5>
                  {permission.map((p, index) => (
                    <div
                      key={index}
                      className="mb-2 d-flex align-items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        checked={isPermissionChecked(p.id)}
                        onChange={() => handlePermissionChange(p.id)}
                      />
                      <strong className="mb-0">{p.name}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No permission found</p>
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
        <Button
          variant="primary"
          style={{ cursor: "pointer" }}
          onClick={handleUpdatePermission}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PermissonModal
