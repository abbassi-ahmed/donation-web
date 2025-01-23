import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"

//i18n
import { withTranslation } from "react-i18next"
// Redux
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import withRouter from "components/Common/withRouter"
import axios from "axios"
// users

const ProfileMenu = props => {
  const [menu, setMenu] = useState(false)

  const [username, setusername] = useState("Admin")
  const [user, setUser] = useState({})

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("authUser"))
        if (!token) {
          throw new Error("Token not found")
        }
        const response = await axios.post(
          process.env.REACT_APP_DATABASEURL + "/admins/verify",
          { token: token }
        )
        const profile = response.data
        setUser(profile)
      } catch (err) {
        console.error("Error fetching profile data", err)
      }
    }
    fetchProfile()
  }, [props.success])

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const obj = JSON.parse(localStorage.getItem("authUser"))
        setusername(obj.displayName)
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        const obj = JSON.parse(localStorage.getItem("authUser"))
        setusername(obj.username)
      }
    }
  }, [props.success])

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item"
          id="page-header-user-dropdown"
          tag="button"
        >
          <div className="d-flex align-items-center">
            {user.avatar ? (
              <img
                className="rounded-circle header-profile-user"
                src={user.avatar}
                alt="Header Avatar"
              />
            ) : (
              <div className="avatar-xs">
                <span className="avatar-title rounded-circle bg-soft-primary text-white">
                  {user?.firstName?.charAt(0)}
                </span>
              </div>
            )}
            <span className="d-none d-xl-inline-block ms-2 me-1">
              {user.firstName}
            </span>

            <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
          </div>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/profile">
            <i className="bx bx-user font-size-16 align-middle me-1" />
            {props.t("Profile")}{" "}
          </DropdownItem>
          <div className="dropdown-divider" />
          <Link to="/logout" className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{props.t("Logout")}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
}

const mapStatetoProps = state => {
  const { error, success } = state.Profile
  return { error, success }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
)
