import React, { useEffect, useRef, useCallback } from "react"
import { useLocation } from "react-router-dom"
import PropTypes from "prop-types"

// //Import Scrollbar
import SimpleBar from "simplebar-react"

// MetisMenu
import MetisMenu from "metismenujs"
import withRouter from "components/Common/withRouter"
import { Link } from "react-router-dom"

//i18n
import { withTranslation } from "react-i18next"

const SidebarContent = props => {
  const ref = useRef()
  const activateParentDropdown = useCallback(item => {
    item.classList.add("active")
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show") // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList.add("mm-active") //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add("mm-show") // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show") // li
              parent5.childNodes[0].classList.add("mm-active") // a tag
            }
          }
        }
      }
      scrollElement(item)
      return false
    }
    scrollElement(item)
    return false
  }, [])

  const removeActivation = items => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i]
      const parent = items[i].parentElement

      if (item && item.classList.contains("active")) {
        item.classList.remove("active")
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show")
        }

        parent.classList.remove("mm-active")
        const parent2 = parent.parentElement

        if (parent2) {
          parent2.classList.remove("mm-show")

          const parent3 = parent2.parentElement
          if (parent3) {
            parent3.classList.remove("mm-active") // li
            parent3.childNodes[0].classList.remove("mm-active")

            const parent4 = parent3.parentElement // ul
            if (parent4) {
              parent4.classList.remove("mm-show") // ul
              const parent5 = parent4.parentElement
              if (parent5) {
                parent5.classList.remove("mm-show") // li
                parent5.childNodes[0].classList.remove("mm-active") // a tag
              }
            }
          }
        }
      }
    }
  }

  const path = useLocation()
  const activeMenu = useCallback(() => {
    const pathName = path.pathname
    let matchingMenuItem = null
    const ul = document.getElementById("side-menu")
    const items = ul.getElementsByTagName("a")
    removeActivation(items)

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  }, [path.pathname, activateParentDropdown])

  useEffect(() => {
    ref.current.recalculate()
  }, [])

  useEffect(() => {
    new MetisMenu("#side-menu")
    activeMenu()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    activeMenu()
  }, [activeMenu])

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Apps")}</li>

            <li>
              <Link to="/calendar">
                <i className="bx bx-calendar"></i>
                <span>{props.t("Calendar")}</span>
              </Link>
            </li>

            <li>
              <Link to="/apps-filemanager">
                <i className="bx bx-file"></i>
                <span>{props.t("File Manager")}</span>
              </Link>
            </li>
            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-store"></i>
                <span>{props.t("Subscription")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/subscriptions">{props.t("Subscriptions")}</Link>
                </li>
                <li>
                  <Link to="/subscription-create">{props.t("Create New")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-book-open"></i>
                <span>{props.t("Projects")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/projects">{props.t("Projects")}</Link>
                </li>
                <li>
                  <Link to="/projects-create">{props.t("Create New")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx  bx-user"></i>
                <span>{props.t("Derigants")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/derigants">{props.t("Derigants")}</Link>
                </li>
                <li>
                  <Link to="/derigants-create">{props.t("Create New")}</Link>
                </li>
              </ul>
            </li>
            {/* 
            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-cart"></i>
                <span>{props.t("products")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/products">{props.t("Products")}</Link>
                </li>
                <li>
                  <Link to="/products-create">{props.t("Create New")}</Link>
                </li>
              </ul>
            </li> */}

            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bxs-user-detail"></i>
                <span>{props.t("Manage Users")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/manage-admins">{props.t("Admins List")}</Link>
                </li>
                <li>
                  <Link to="/manage-users">{props.t("Users List")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-dollar"></i>
                <span>{props.t("Donations")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/project-donation">
                    {props.t("Project Donations")}
                  </Link>
                </li>
                <li>
                  <Link to="/donation">{props.t("Donation")}</Link>
                </li>
                <li>
                  <Link to="/subscriptions-payments">
                    {props.t("Subscription")}
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/contact">
                <i className="bx bx-envelope"></i>
                <span>{props.t("Contact")}</span>
              </Link>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bxs-detail" />

                <span>{props.t("Blog")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/blog-grid">{props.t("Blogs")}</Link>
                </li>
                <li>
                  <Link to="/blog-create">{props.t("Blog Create")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-edit"></i>
                <span>{props.t("Manage Pages")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/manage-slider">{props.t("Slider Section")}</Link>
                </li>
                <li>
                  <Link to="/manage-categories">
                    {props.t("Categorie Section")}
                  </Link>
                </li>
                <li>
                  <Link to="/manage-fun">{props.t("Fun Fact Section")}</Link>
                </li>
                {/* <li>
                  <Link to="/manage-why-choose">
                    {props.t("Why Choose Section")}
                  </Link>
                </li> */}
                <li>
                  <Link to="/brands-section">{props.t("Brands Section")}</Link>
                </li>
                {/* <li>
                  <Link to="/what-say">
                    {props.t("What they say section ")}
                  </Link>
                </li>{" "} */}
                <li>
                  <Link to="/about-section">{props.t("About section ")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-help-circle" />

                <span>{props.t("FAQ")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/faq">{props.t("FAQ")}</Link>
                </li>
                <li>
                  <Link to="/faq-create">{props.t("Faq Create")}</Link>
                </li>
              </ul>
            </li>
            {/* <li>
              <Link to="/feedback">
                <i className="bx bxs-comment-detail"></i>
                <span>{props.t("Feedback")}</span>
              </Link>
            </li> */}

            {/* <li className="menu-title">Pages</li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-user-circle"></i>
                <span>{props.t("Authentication")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/profile">{props.t("Profile")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Login")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Login 2")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Register")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Register 2")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Recover Password")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Recover Password 2")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Lock Screen")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Lock Screen 2")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Confirm Mail")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Confirm Mail 2")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Email Verification")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Email Verification 2")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Two Step Verification")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Two Step Verification 2")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-file"></i>
                <span>{props.t("Utility")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/pages-faqs">{props.t("FAQs")}</Link>
                </li>
              </ul>
            </li> */}
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
