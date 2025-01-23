import React from "react"
import { Navigate } from "react-router-dom"
import PropTypes from "prop-types"

const PermissionRoute = ({ element, requiredPermission }) => {
  const permissions = JSON.parse(
    localStorage.getItem("userPermissions") || "[]"
  )

  if (
    permissions.includes(requiredPermission) ||
    requiredPermission === "all"
  ) {
    return element
  } else {
    return <Navigate to="/no-permission" replace />
  }
}

PermissionRoute.propTypes = {
  element: PropTypes.element.isRequired,
  requiredPermission: PropTypes.string.isRequired,
}

export default PermissionRoute
