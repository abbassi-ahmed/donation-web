import React, { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import PropTypes from "prop-types"
import SimpleBar from "simplebar-react"
import { Collapse } from "react-bootstrap"
import withRouter from "components/Common/withRouter"
import { withTranslation } from "react-i18next"
import classNames from "classnames"

const SidebarContent = props => {
  const ref = useRef()
  const [permissions, setPermissions] = useState([])
  const [openMenus, setOpenMenus] = useState({})
  const location = useLocation()

  const fetchPermissions = () => {
    try {
      const permissions = JSON.parse(
        localStorage.getItem("userPermissions") || "[]"
      )
      setPermissions(permissions)
    } catch (error) {
      console.error("Error fetching permissions", error)
    }
  }

  useEffect(() => {
    fetchPermissions()
  }, [])

  const menuItems = [
    {
      path: "/action",
      icon: "bx bx-calendar",
      label: "Action",
      permission: "action",
    },
    {
      path: "/apps-filemanager",
      icon: "bx bx-file",
      label: "File Manager",
      permission: "file manager",
    },
    {
      label: "Subscription",
      icon: "bx bx-store",
      permission: "subscription",
      subMenu: [
        { path: "/subscriptions", label: "Subscriptions" },
        { path: "/subscription-create", label: "Create New" },
      ],
    },
    {
      label: "Projects",
      icon: "bx bx-book-open",
      permission: "projects",
      subMenu: [
        { path: "/projects", label: "Projects" },
        { path: "/projects-create", label: "Create New" },
      ],
    },
    {
      label: "Derigants",
      icon: "bx bx-user",
      permission: "derigants",
      subMenu: [
        { path: "/derigants", label: "Derigants" },
        { path: "/derigants-create", label: "Create New" },
      ],
    },
    {
      label: "Manage Users",
      icon: "bx bxs-user-detail",
      permission: "manage users",
      subMenu: [
        { path: "/manage-admins", label: "Admins List" },
        { path: "/manage-users", label: "Users List" },
      ],
    },
    {
      label: "Donations",
      icon: "bx bx-dollar",
      permission: "donations",
      subMenu: [
        { path: "/project-donation", label: "Project Donations" },
        { path: "/donation", label: "Donation" },
        { path: "/subscriptions-payments", label: "Subscription" },
      ],
    },
    {
      path: "/contact",
      icon: "bx bx-envelope",
      label: "Contact",
      permission: "contact",
    },
    {
      label: "Blog",
      icon: "bx bxs-detail",
      permission: "blog",
      subMenu: [
        { path: "/blog-grid", label: "Blogs" },
        { path: "/blog-create", label: "Blog Create" },
      ],
    },
    {
      label: "Manage Pages",
      icon: "bx bx-edit",
      permission: "manage pages",
      subMenu: [
        { path: "/manage-slider", label: "Slider Section" },
        { path: "/manage-categories", label: "Categorie Section" },
        { path: "/manage-fun", label: "Fun Fact Section" },
        { path: "/gallery", label: "Gallery" },
        { path: "/partner-section", label: "Partner Section" },
        { path: "/info-section", label: "Information Section" },
        { path: "/about-section", label: "About Section" },
      ],
    },
    {
      label: "FAQ",
      icon: "bx bx-help-circle",
      permission: "faq",
      subMenu: [
        { path: "/faq", label: "FAQ" },
        { path: "/faq-create", label: "Faq Create" },
      ],
    },
  ]

  const filteredMenuItems = menuItems.filter(item =>
    permissions.includes(item.permission)
  )

  const toggleSubMenu = label => {
    setOpenMenus(prevState => ({
      ...prevState,
      [label]: !prevState[label],
    }))
  }

  const renderMenuItems = items => {
    return items.map(item => {
      const isActive = location.pathname === item.path

      if (item.subMenu) {
        const isOpen = openMenus[item.label]
        return (
          <li key={item.label} className={classNames({ "mm-active": isOpen })}>
            <Link
              to="#"
              className={classNames("has-arrow", { "mm-active": isOpen })}
              onClick={() => toggleSubMenu(item.label)}
            >
              <i
                className={classNames(item.icon, { "text-primary": isActive })}
              ></i>
              <span className={classNames({ "text-primary": isActive })}>
                {props.t(item.label)}
              </span>
            </Link>
            <Collapse in={isOpen}>
              <ul className="sub-menu">
                {item.subMenu.map(subItem => {
                  const isSubItemActive = location.pathname === subItem.path
                  return (
                    <li
                      key={subItem.label}
                      className={classNames({ "mm-active": isSubItemActive })}
                    >
                      <Link
                        to={subItem.path}
                        className={classNames({
                          "text-primary": isSubItemActive,
                        })}
                      >
                        {props.t(subItem.label)}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </Collapse>
          </li>
        )
      }

      return (
        <li key={item.label} className={classNames({ "mm-active": isActive })}>
          <Link
            to={item.path}
            className={classNames({ "text-white": isActive })}
          >
            <i
              className={classNames(item.icon, { "text-white": isActive })}
            ></i>
            <span className={classNames({ "text-white": isActive })}>
              {props.t(item.label)}
            </span>
          </Link>
        </li>
      )
    })
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {renderMenuItems(filteredMenuItems)}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))
