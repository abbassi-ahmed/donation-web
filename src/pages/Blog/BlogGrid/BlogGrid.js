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

const BlogGrid = () => {
  const [activeTab, toggleTab] = useState("1")
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    fetchBlogData()
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

  const toggle = tab => {
    if (activeTab !== tab) toggleTab(tab)
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
                className={classnames({ active: activeTab === "1" })}
                onClick={() => toggleTab("1")}
              >
                All Post
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent className="p-4" activeTab={activeTab}>
            <TabPane tabId="1">
              <div>
                <Row className="justify-content-center">
                  <Col xl={8}>
                    <div>
                      <div className="row align-items-center">
                        <div className="col-4">
                          <div>
                            <h5 className="mb-0">Blog Grid</h5>
                          </div>
                        </div>
                        {/* <Col xs={8}>
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
                                <Link className="nav-link" to="/blog-list">
                                  <i className="mdi mdi-format-list-bulleted"></i>
                                </Link>
                              </NavItem>
                              <NavItem>
                                <Link
                                  to="/blog-grid"
                                  className="nav-link active"
                                >
                                  <i className="mdi mdi-view-grid-outline"></i>
                                </Link>
                              </NavItem>
                            </Nav>
                          </div>
                        </Col> */}
                      </div>
                      <hr className="mb-4" />
                      <Row>
                        {blogs.length > 0 ? (
                          blogs.map(blog => (
                            <Col sm={6} key={blog.id}>
                              <Card className="p-1 border shadow-none">
                                <div className="p-3">
                                  <h5>
                                    <Link
                                      to={`/blog-details/${blog.id}`}
                                      className="text-dark"
                                    >
                                      {blog.title}
                                    </Link>
                                  </h5>
                                  <p className="text-muted mb-0">
                                    {new Date(blog.createdAt).toDateString()}
                                  </p>
                                </div>
                                <div className="position-relative">
                                  <img
                                    src={blog.image}
                                    alt=""
                                    className="img-thumbnail"
                                  />
                                </div>
                                <div className="p-3">
                                  <ul className="list-inline">
                                    <li className="list-inline-item me-3">
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
                                </div>
                              </Card>
                            </Col>
                          ))
                        ) : (
                          <div>No blogs found.</div>
                        )}
                      </Row>
                      <hr className="my-4" />
                      <div className="text-center">
                        <ul className="pagination justify-content-center pagination-rounded">
                          <li className="page-item disabled">
                            <Link to="#" className="page-link">
                              <i className="mdi mdi-chevron-left"></i>
                            </Link>
                          </li>
                          <li className="page-item">
                            <Link to="#" className="page-link">
                              1
                            </Link>
                          </li>
                          <li className="page-item active">
                            <Link to="#" className="page-link">
                              2
                            </Link>
                          </li>
                          <li className="page-item">
                            <Link to="#" className="page-link">
                              3
                            </Link>
                          </li>
                          <li className="page-item">
                            <Link to="#" className="page-link">
                              ...
                            </Link>
                          </li>
                          <li className="page-item">
                            <Link to="#" className="page-link">
                              10
                            </Link>
                          </li>
                          <li className="page-item">
                            <Link to="#" className="page-link">
                              <i className="mdi mdi-chevron-right"></i>
                            </Link>
                          </li>
                        </ul>
                      </div>
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
                      {/* Archive content can go here */}
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

export default BlogGrid
