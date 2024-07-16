import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { Container, Card, CardBody, Col, Row } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import DeleteModal from "components/Common/DeleteModal"
import axios from "axios"

const BlogDetails = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_DATABASEURL}/blogs/find-one/${id}`
        )
        const data = await response.json()
        setBlog(data)
      } catch (error) {
        setError("Error fetching blog details")
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_DATABASEURL}/blogs/remove/${id}`
      )
      setDeleteModal(false)
      window.location.href = "/blog-grid"
    } catch (error) {
      console.error("Error deleting blog", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!blog) {
    return <div>Blog not found</div>
  }

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Blog" breadcrumbItem="Blog Details" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="pt-3">
                    <div
                      className="delete-icon"
                      onClick={() => setDeleteModal(true)}
                    >
                      <i className="mdi mdi-delete me-1 align-middle"></i>
                    </div>
                    <Row className="justify-content-center">
                      <Col xl={8}>
                        <div>
                          <div className="text-center">
                            <h4>{blog.title}</h4>
                            <p className="text-muted mb-4">
                              <i className="mdi mdi-calendar me-1"></i>
                              {new Date(blog.createdAt).toDateString()}
                            </p>
                          </div>

                          <hr />
                          <div className="text-center">
                            <Row>
                              <Col sm={4}>
                                <div className="mt-4 mt-sm-0">
                                  <p className="text-muted mb-2">Posted on</p>
                                  <h5 className="font-size-15">
                                    {new Date(blog.createdAt).toDateString()}
                                  </h5>
                                </div>
                              </Col>
                              <Col sm={4}>
                                <div className="mt-4 mt-sm-0">
                                  <p className="text-muted mb-2">Post by</p>
                                  <h5 className="font-size-15">{`${blog.admin.firstName} ${blog.admin.lastName}`}</h5>
                                </div>
                              </Col>
                              <Col sm={4}>
                                <div className="mt-4 mt-sm-0">
                                  <p className="text-muted mb-2">Privacy </p>
                                  <h5 className="font-size-15">{`${
                                    blog.Privacy ? "Public" : "Private"
                                  }`}</h5>
                                </div>
                              </Col>
                            </Row>
                          </div>
                          <hr />

                          <div className="my-5">
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="img-fluid rounded"
                              style={{
                                width: "80%",
                                height: "400px",
                                objectFit: "scale-down",
                              }}
                            />
                          </div>

                          <hr />

                          <div className="mt-4">
                            <div className="text-muted font-size-14">
                              <p>{blog.content}</p>
                            </div>
                          </div>

                          <hr />

                          <div className="mt-5">
                            <h5 className="font-size-15">
                              <i className="bx bx-message-dots text-muted align-middle me-1"></i>{" "}
                              Comments :
                            </h5>

                            {/* Comments section can be added here */}
                          </div>

                          <div className="mt-4">
                            <h5 className="font-size-16 mb-3">
                              Leave a Message
                            </h5>

                            {/* <Form>
                              <Row>
                                <Col md={6}>
                                  <div className="mb-3">
                                    <Label htmlFor="commentname-input">
                                      Name
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="commentname-input"
                                      placeholder="Enter name"
                                    />
                                  </div>
                                </Col>
                                <Col md={6}>
                                  <div className="mb-3">
                                    <Label htmlFor="commentemail-input">
                                      Email
                                    </Label>
                                    <Input
                                      type="email"
                                      className="form-control"
                                      id="commentemail-input"
                                      placeholder="Enter email"
                                    />
                                  </div>
                                </Col>
                              </Row>

                              <div className="mb-3">
                                <Label htmlFor="commentmessage-input">
                                  Message
                                </Label>
                                <Input
                                  type="textarea"
                                  className="form-control"
                                  id="commentmessage-input"
                                  placeholder="Your message..."
                                  rows="3"
                                />
                              </div>

                              <div className="text-end">
                                <button
                                  type="submit"
                                  className="btn btn-success w-sm"
                                >
                                  Submit
                                </button>
                              </div>
                            </Form> */}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default BlogDetails
