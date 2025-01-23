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
                All Blogs
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
                            <h5 className="mb-0">Blog List</h5>
                          </div>
                        </div>
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
                                    style={{
                                      width: "100%",
                                      height: "200px",
                                      objectFit: "contain",
                                    }}
                                  />
                                </div>
                                <div className="p-3">
                                  <p
                                    style={{
                                      display: "-webkit-box",
                                      "-webkit-line-clamp": "3",
                                      "-webkit-box-orient": "vertical",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {blog.content}
                                  </p>
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
                    <div className="mt-5"></div>
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
