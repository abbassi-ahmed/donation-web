import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap"
import classnames from "classnames"

const BlogList = () => {
  const [activeTab, toggleTab] = useState("1")
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    fetchBlogData()
    // fetch(process.env.REACT_APP_DATABASEURL + "/blog/find-all")
    //   .then(response => response.json())
    //   .then(data => setBlogs(data))
    //   .catch(error => console.error("Error fetching blogs:", error))
  }, [])
  const fetchBlogData = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_DATABASEURL + "/blogs/find-all"
      )
      const data = await response.json()
      setBlogs(data)
    } catch (error) {
      console.error("Error fetching blogs:", error)
    }
  }

  return (
    <React.Fragment>
      <Col xl={9} lg={8}>
        <Card>
          <Nav
            tag="ul"
            className="nav-tabs nav-tabs-custom justify-content-center pt-2"
            role="tablist"
          >
            <NavItem tag="li">
              <NavLink
                to="#"
                className={classnames({
                  active: activeTab === "1",
                })}
                onClick={() => {
                  toggleTab("1")
                }}
              >
                All Post
              </NavLink>
            </NavItem>
            <NavItem tag="li">
              <NavLink
                to="#"
                className={classnames({
                  active: activeTab === "2",
                })}
                onClick={() => {
                  toggleTab("2")
                }}
              >
                Archive
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent className="p-4" activeTab={activeTab}>
            <TabPane tabId="1">
              <div>
                <Row className="justify-content-center">
                  <Col xl={8}>
                    <div>
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <div>
                            <h5 className="mb-0">Blog List</h5>
                          </div>
                        </Col>

                        <Col xs={8}>
                          <div className="float-end">
                            <Nav
                              tag="ul"
                              className="nav-pills justify-content-end"
                            >
                              <NavItem tag="li">
                                <NavLink
                                  className="disabled"
                                  to="#"
                                  tabIndex="-1"
                                >
                                  View :
                                </NavLink>
                              </NavItem>
                              <NavItem tag="li">
                                <Link
                                  className="nav-link active"
                                  to="/blog-list"
                                >
                                  <i className="mdi mdi-format-list-bulleted"></i>
                                </Link>
                              </NavItem>
                              <NavItem>
                                <Link to="/blog-grid" className="nav-link">
                                  <i className="mdi mdi-view-grid-outline"></i>
                                </Link>
                              </NavItem>
                            </Nav>
                          </div>
                        </Col>
                      </Row>

                      <hr className="mb-4" />

                      {blogs.length > 0 ? (
                        blogs.map(blog => (
                          <div key={blog.id}>
                            <h5>
                              <Link
                                to={`/blog-details/${blog.id}`}
                                className="text-dark"
                              >
                                {blog.title}
                              </Link>
                            </h5>
                            <p className="text-muted">
                              {new Date(blog.createdAt).toDateString()}
                            </p>

                            <div className="position-relative mb-3">
                              <img
                                src={blog.image}
                                alt=""
                                className="img-thumbnail"
                              />
                            </div>

                            <ul className="list-inline">
                              <li className="list-inline-item mr-3">
                                <Link to="#" className="text-muted">
                                  <i className="bx bx-purchase-tag-alt align-middle text-muted me-1"></i>{" "}
                                  {blog.category}
                                </Link>
                              </li>
                            </ul>
                            <p>{blog.content}</p>

                            <div>
                              <Link
                                to={`/blog-details/${blog.id}`}
                                className="text-primary"
                              >
                                Read more{" "}
                                <i className="mdi mdi-arrow-right"></i>
                              </Link>
                            </div>

                            <hr className="my-5" />
                          </div>
                        ))
                      ) : (
                        <div>No blogs found.</div>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            </TabPane>

            <TabPane tabId="2">
              <div>
                <Row className="justify-content-center">
                  <Col xl={8}>
                    <h5>Archive</h5>

                    <div className="mt-5">
                      {/* Your Archive Content Here */}
                    </div>
                  </Col>
                </Row>
              </div>
            </TabPane>
          </TabContent>
        </Card>
      </Col>
    </React.Fragment>
  )
}

export default BlogList
