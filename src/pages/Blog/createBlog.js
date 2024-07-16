import React, { useEffect, useState } from "react"
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  UncontrolledTooltip,
} from "reactstrap"
import { toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import * as Yup from "yup"
import { useFormik } from "formik"
import axios from "axios"
import Switch from "@mui/material/Switch"

import "./styles.css"

const CreateBlog = () => {
  document.title = "Create New Blog"

  const [selectedImage, setSelectedImage] = useState(null)
  const [img, setImg] = useState(null)
  const [loader, setLoader] = useState(false)
  const [blogPrivacy, setBlogPrivacy] = useState(false)
  const [token, setToken] = useState("")

  const handleImageChange = e => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      setImg(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
        validation.setFieldValue("blogImage", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  useEffect(() => {
    const token = localStorage.getItem("authUser")
    if (token) {
      setToken(token.replace(/"/g, ""))
    }
  }, [])

  const validation = useFormik({
    initialValues: {
      blogTitle: "",
      blogContent: "",
      blogImage: "",
    },
    validationSchema: Yup.object({
      blogTitle: Yup.string().required("Title is required"),
      blogContent: Yup.string().required("Content is required"),
      blogImage: Yup.string().required("Image is required"),
    }),
    onSubmit: async values => {
      const formData = new FormData()
      formData.append("image", img)
      formData.append("title", values.blogTitle)
      formData.append("content", values.blogContent)
      formData.append("privacy", blogPrivacy)

      try {
        setLoader(true)
        const response = await axios.post(
          process.env.REACT_APP_DATABASEURL + "/blogs/create",
          formData,
          {
            headers: {
              token: token,
            },
          }
        )
        if (response.data) {
          validation.resetForm()
          setSelectedImage(null)
          setImg(null)
          toast.success("🎉 Blog Created Successfully")
          setLoader(false)
        }
      } catch (error) {
        if (error.response.data.message) {
          toast.error(error.response.data.message)
        }
        setLoader(false)
      }
    },
  })

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Blogs" breadcrumbItem="Create New" />
          <Form
            id="createcoach-form"
            onSubmit={e => {
              e.preventDefault()
              validation.handleSubmit()
            }}
          >
            <Row className="justify-content-center">
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <input
                      type="hidden"
                      className="form-control"
                      id="formAction"
                      name="formAction"
                      defaultValue="add"
                    />
                    <input
                      type="hidden"
                      className="form-control"
                      id="coach-id-input"
                    />
                    <div className="mb-3">
                      <Label className="form-label">Blog Image</Label>
                      <div className="text-center">
                        <div className="position-relative d-inline-block">
                          <div className="position-absolute bottom-0 end-0">
                            <Label
                              htmlFor="project-image-input"
                              className="mb-0"
                              id="blogImage"
                            >
                              <div className="avatar-xs">
                                <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">
                                  <i className="bx bxs-image-alt"></i>
                                </div>
                              </div>
                            </Label>
                            <UncontrolledTooltip
                              placement="right"
                              target="blogImage"
                            >
                              Select Image
                            </UncontrolledTooltip>
                            <input
                              className="form-control d-none"
                              id="project-image-input"
                              type="file"
                              accept="image/png, image/gif, image/jpeg"
                              onChange={handleImageChange}
                            />
                          </div>
                          <div className="square-image">
                            <img
                              src={selectedImage || ""}
                              id="blogImage"
                              alt=""
                              className="img-fluid h-auto rounded"
                            />
                          </div>
                        </div>
                        {validation.touched.blogImage &&
                        validation.errors.blogImage ? (
                          <FormFeedback type="invalid" className="d-block">
                            {validation.errors.blogImage}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="blogTitle-input">Blog Title</Label>
                      <Input
                        id="blogTitle"
                        name="blogTitle"
                        type="text"
                        placeholder="Enter Blog Title..."
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.blogTitle || ""}
                      />
                      {validation.touched.blogTitle &&
                      validation.errors.blogTitle ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.blogTitle}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="blogContent-input">Blog Content</Label>
                      <Input
                        id="blogContent"
                        name="blogContent"
                        type="text"
                        placeholder="Enter Blog Content..."
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.blogContent || ""}
                      />
                      {validation.touched.blogContent &&
                      validation.errors.blogContent ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.blogContent}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3 gap-2">
                      <Label className="ml-2" htmlFor="blogPrivacy-input">
                        Blog Privacy
                      </Label>
                      <Switch
                        checked={blogPrivacy}
                        onChange={() => setBlogPrivacy(!blogPrivacy)}
                        name="blogPrivacy"
                        id="blogPrivacy"
                        color="primary"
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                      {validation.touched.blogPrivacy &&
                      validation.errors.blogPrivacy ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.blogPrivacy}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
                <div className="text-end mb-4">
                  <Button type="submit" color="primary" disabled={loader}>
                    Create Blog
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default CreateBlog
