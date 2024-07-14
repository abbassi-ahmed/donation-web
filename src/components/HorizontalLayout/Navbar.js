import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import { Row, Col, Collapse } from "reactstrap"
import { Link } from "react-router-dom"
import withRouter from "components/Common/withRouter"
import classname from "classnames"

//i18n
import { withTranslation } from "react-i18next"

import { connect } from "react-redux"

const Navbar = props => {
  const [dashboard, setdashboard] = useState(false)
  const [ui, setui] = useState(false)
  const [app, setapp] = useState(false)
  const [email, setemail] = useState(false)
  const [ecommerce, setecommerce] = useState(false)
  const [crypto, setcrypto] = useState(false)
  const [project, setproject] = useState(false)
  const [task, settask] = useState(false)
  const [contact, setcontact] = useState(false)
  const [blog, setBlog] = useState(false)
  const [job, setJob] = useState(false)
  const [candidate, setCandidate] = useState(false)
  const [component, setcomponent] = useState(false)
  const [form, setform] = useState(false)
  const [table, settable] = useState(false)
  const [chart, setchart] = useState(false)
  const [icon, seticon] = useState(false)
  const [map, setmap] = useState(false)
  const [extra, setextra] = useState(false)
  const [invoice, setinvoice] = useState(false)
  const [auth, setauth] = useState(false)
  const [utility, setutility] = useState(false)
  const [coach, setCoach] = useState(false)
  const [courses, setCourses] = useState(false)
  useEffect(() => {
    var matchingMenuItem = null
    var ul = document.getElementById("navigation")
    var items = ul.getElementsByTagName("a")
    removeActivation(items)
    for (var i = 0; i < items.length; ++i) {
      if (window.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  })

  const removeActivation = items => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i]
      const parent = items[i].parentElement
      if (item && item.classList.contains("active")) {
        item.classList.remove("active")
      }
      if (parent) {
        if (parent.classList.contains("active")) {
          parent.classList.remove("active")
        }
      }
    }
  }

  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement
    if (parent) {
      parent.classList.add("active") // li
      const parent2 = parent.parentElement
      parent2.classList.add("active") // li
      const parent3 = parent2.parentElement
      if (parent3) {
        parent3.classList.add("active") // li
        const parent4 = parent3.parentElement
        if (parent4) {
          parent4.classList.add("active") // li
          const parent5 = parent4.parentElement
          if (parent5) {
            parent5.classList.add("active") // li
            const parent6 = parent5.parentElement
            if (parent6) {
              parent6.classList.add("active") // li
            }
          }
        }
      }
    }
    return false
  }

  return (
    <React.Fragment>
      <div className="topnav">
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={props.leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle arrow-none"
                    onClick={e => {
                      e.preventDefault()
                      setdashboard(!dashboard)
                    }}
                    to="/dashboard"
                  >
                    <i className="bx bx-home-circle me-2"></i>
                    {props.t("Dashboard")} {props.menuOpen}
                    <div className="arrow-down"></div>
                  </Link>
                  <div
                    className={classname("dropdown-menu", { show: dashboard })}
                  >
                    <Link to="/dashboard" className="dropdown-item">
                      {props.t("Default")}
                    </Link>
                    <Link to="/dashboard-saas" className="dropdown-item">
                      {props.t("Saas")}
                    </Link>
                    <Link to="/dashboard-crypto" className="dropdown-item">
                      {props.t("Crypto")}
                    </Link>
                    <Link to="/blog" className="dropdown-item">
                      {props.t("Blog")}
                    </Link>
                    <Link to="/dashboard-job" className="dropdown-item">
                      {props.t("Jobs")}
                    </Link>
                  </div>
                </li>

                <li className="nav-item dropdown">
                  <Link
                    to="/#"
                    onClick={e => {
                      e.preventDefault()
                      setapp(!app)
                    }}
                    className="nav-link dropdown-togglez arrow-none"
                  >
                    <i className="bx bx-customize me-2"></i>
                    {props.t("Apps")} <div className="arrow-down"></div>
                  </Link>
                  <div className={classname("dropdown-menu", { show: app })}>
                    <Link to="/calendar" className="dropdown-item">
                      {props.t("Calendar")}
                    </Link>

                    {/* <Link to="/apps-filemanager" className="dropdown-item">
                      {props.t("File Manager")}
                    </Link> */}

                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault()
                          setCoach(!coach)
                        }}
                      >
                        {props.t("Coaches")} <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", {
                          show: coach,
                        })}
                      >
                        <Link to="/coaches-list" className="dropdown-item">
                          {props.t("coaches List")}
                        </Link>
                        <Link to="/coaches-overview" className="dropdown-item">
                          {props.t("Coaches Overview")}
                        </Link>
                        <Link to="/coaches-create" className="dropdown-item">
                          {props.t("Create New Coach")}
                        </Link>
                      </div>
                    </div>
                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault()
                          setCourses(!courses)
                        }}
                      >
                        {props.t("Courses")} <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", {
                          show: courses,
                        })}
                      >
                        <Link to="/courses-list" className="dropdown-item">
                          {props.t("courses List")}
                        </Link>
                        <Link to="/courses-overview" className="dropdown-item">
                          {props.t("courses Overview")}
                        </Link>
                        <Link to="/courses-create" className="dropdown-item">
                          {props.t("Create New Course")}
                        </Link>
                      </div>
                    </div>
                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault()
                          settask(!task)
                        }}
                      >
                        {props.t("Tasks")} <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", { show: task })}
                      >
                        <Link to="/tasks-list" className="dropdown-item">
                          {props.t("Task List")}
                        </Link>
                        <Link to="/tasks-kanban" className="dropdown-item">
                          {props.t("Kanban Board")}
                        </Link>
                        <Link to="/tasks-create" className="dropdown-item">
                          {props.t("Create Task")}
                        </Link>
                      </div>
                    </div>
                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault()
                          setcontact(!contact)
                        }}
                      >
                        {props.t("Contacts")} <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", {
                          show: contact,
                        })}
                      >
                        <Link to="/contacts-grid" className="dropdown-item">
                          {props.t("User Grid")}
                        </Link>
                        <Link to="/contacts-list" className="dropdown-item">
                          {props.t("User List")}
                        </Link>
                        <Link to="/contacts-profile" className="dropdown-item">
                          {props.t("Profile")}
                        </Link>
                      </div>
                    </div>
                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault()
                          setBlog(!blog)
                        }}
                      >
                        {props.t("Blog")} <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", {
                          show: blog,
                        })}
                      >
                        <Link to="/blog-list" className="dropdown-item">
                          {props.t("Blog List")}
                        </Link>
                        <Link to="/blog-grid" className="dropdown-item">
                          {props.t("Blog Grid")}
                        </Link>
                        <Link to="/blog-details" className="dropdown-item">
                          {props.t("Blog Details")}
                        </Link>
                      </div>
                    </div>

                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item arrow-none"
                        onClick={e => {
                          e.preventDefault()
                          setJob(!job)
                        }}
                      >
                        {props.t("Jobs")} <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", { show: job })}
                      >
                        <Link to="/job-list" className="dropdown-item">
                          {props.t("Job List")}
                        </Link>
                        <Link to="/job-grid" className="dropdown-item">
                          {props.t("Job Grid")}
                        </Link>
                        <Link to="/job-apply" className="dropdown-item">
                          {props.t("Job Apply")}
                        </Link>
                        <Link to="/job-details" className="dropdown-item">
                          {props.t("Job Details")}
                        </Link>
                        <Link to="/job-categories" className="dropdown-item">
                          {props.t("Job Catogories")}
                        </Link>

                        <div className="dropdown">
                          <Link
                            className="dropdown-item dropdown-toggle arrow-none"
                            to="/#"
                            onClick={e => {
                              e.preventDefault()
                              setCandidate(!candidate)
                            }}
                          >
                            <span key="t-candidate">Candidate</span>{" "}
                            <div className="arrow-down"></div>
                          </Link>
                          <div
                            className={classname("dropdown-menu", {
                              show: candidate,
                            })}
                          >
                            <Link
                              to="/candidate-list"
                              className="dropdown-item"
                            >
                              {props.t("List")}
                            </Link>
                            <Link
                              to="/candidate-overview"
                              className="dropdown-item"
                            >
                              {props.t("Overview")}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle arrow-none"
                    to="/#"
                    onClick={e => {
                      e.preventDefault()
                      setextra(!extra)
                    }}
                  >
                    <i className="bx bx-file me-2"></i>
                    {props.t("Extra pages")} <div className="arrow-down"></div>
                  </Link>
                  <div className={classname("dropdown-menu", { show: extra })}>
                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault()
                          setinvoice(!invoice)
                        }}
                      >
                        {props.t("Invoices")} <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", {
                          show: invoice,
                        })}
                      >
                        <Link to="/invoices-list" className="dropdown-item">
                          {props.t("Invoice List")}
                        </Link>
                        <Link to="/invoices-detail" className="dropdown-item">
                          {props.t("Invoice Detail")}
                        </Link>
                      </div>
                    </div>

                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault()
                          setauth(!auth)
                        }}
                      >
                        {props.t("Authentication")}{" "}
                        <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", { show: auth })}
                      >
                        <Link to="/pages-login" className="dropdown-item">
                          {props.t("Login")}
                        </Link>
                        <Link to="/pages-login-2" className="dropdown-item">
                          {props.t("Login 2")}
                        </Link>
                        <Link to="/pages-register" className="dropdown-item">
                          {props.t("Register")}
                        </Link>
                        <Link to="/pages-register-2" className="dropdown-item">
                          {props.t("Register 2")}
                        </Link>
                        <Link to="/page-recoverpw" className="dropdown-item">
                          {props.t("Recover Password")}
                        </Link>
                        <Link to="/page-recoverpw-2" className="dropdown-item">
                          {props.t("Recover Password 2")}
                        </Link>
                        <Link to="/auth-lock-screen" className="dropdown-item">
                          {props.t("Lock Screen")}
                        </Link>
                        <Link
                          to="/auth-lock-screen-2"
                          className="dropdown-item"
                        >
                          {props.t("Lock Screen 2")}
                        </Link>
                        <Link to="/page-confirm-mail" className="dropdown-item">
                          {props.t("Confirm Mail")}
                        </Link>
                        <Link
                          to="/page-confirm-mail-2"
                          className="dropdown-item"
                        >
                          {props.t("Confirm Mail 2")}
                        </Link>
                        <Link
                          to="/auth-email-verification"
                          className="dropdown-item"
                        >
                          {props.t("Email Verification")}
                        </Link>
                        <Link
                          to="/auth-email-verification-2"
                          className="dropdown-item"
                        >
                          {props.t("Email Verification 2")}
                        </Link>
                        <Link
                          to="/auth-two-step-verification"
                          className="dropdown-item"
                        >
                          {props.t("Two Step Verification")}
                        </Link>
                        <Link
                          to="/auth-two-step-verification-2"
                          className="dropdown-item"
                        >
                          {props.t("Two Step Verification 2")}
                        </Link>
                      </div>
                    </div>

                    <div className="dropdown">
                      <Link
                        className="dropdown-item dropdown-toggle arrow-none"
                        to="/#"
                        onClick={e => {
                          e.preventDefault()
                          setutility(!utility)
                        }}
                      >
                        {props.t("Utility")} <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", {
                          show: utility,
                        })}
                      >
                        <Link to="/pages-starter" className="dropdown-item">
                          {props.t("Starter Page")}
                        </Link>
                        <Link to="/pages-maintenance" className="dropdown-item">
                          {props.t("Maintenance")}
                        </Link>
                        <Link to="/pages-comingsoon" className="dropdown-item">
                          {props.t("Coming Soon")}
                        </Link>
                        <Link to="/pages-timeline" className="dropdown-item">
                          {props.t("Timeline")}
                        </Link>
                        <Link to="/pages-faqs" className="dropdown-item">
                          {props.t("FAQs")}
                        </Link>
                        <Link to="/pages-pricing" className="dropdown-item">
                          {props.t("Pricing")}
                        </Link>
                        <Link to="/pages-404" className="dropdown-item">
                          {props.t("Error 404")}
                        </Link>
                        <Link to="/pages-500" className="dropdown-item">
                          {props.t("Error 500")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  )
}

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
}

const mapStatetoProps = state => {
  const { leftMenu } = state.Layout
  return { leftMenu }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
)
