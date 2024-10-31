import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { Container, Card, CardBody, Col, Row } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import DeleteModal from "components/Common/DeleteModal"
import axios from "axios"
import EditBlogModal from "components/Modal/editBlog"

const BlogDetails = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editBlog, setEditBlog] = useState({
    title: "",
    content: "",
    privacy: "",
    image: "" || null,
  })
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
  useEffect(() => {
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

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!blog) return <div>Blog not found</div>

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
      <EditBlogModal
        show={editModal}
        toggle={() => setEditModal(!editModal)}
        blog={editBlog}
        onCloseClick={() => setEditModal(false)}
        setEditBlog={setEditBlog}
        onSaveFinished={() => {
          setEditModal(false)
          fetchBlog()
        }}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Blog" breadcrumbItem="Blog Details" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div>
                    <div className="d-flex justify-content-between">
                      <div>
                        <div
                          className="btn btn-primary"
                          onClick={() => {
                            setEditBlog(blog)
                            setEditModal(true)
                          }}
                        >
                          <i className="mdi mdi-pencil me-1 align-middle"></i>
                          Edit
                        </div>
                      </div>
                      <div
                        onClick={() => setDeleteModal(true)}
                        className="btn btn-danger"
                      >
                        <i className="mdi mdi-delete me-1 align-middle"></i>
                        Delete
                      </div>
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
                                    blog.privacy ? "Public" : "Private"
                                  }`}</h5>
                                </div>
                              </Col>
                            </Row>
                          </div>
                          <hr />

                          <div className="my-5" style={{ textAlign: "center" }}>
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
