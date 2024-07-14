import React, { useState } from "react"
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
import "./styles.css"
const ProductCreate = () => {
  document.title = "Create New Product "

  const [selectedImage, setSelectedImage] = useState(null)
  const [img, setImg] = useState(null)
  const [loader, setLoader] = useState(false)

  const handleImageChange = e => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      setImg(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
        validation.setFieldValue("productImage", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validation = useFormik({
    initialValues: {
      productName: "",
      productPrice: "",
      productImage: "",
      productQuantity: "",
      productDescription: "",
    },
    validationSchema: Yup.object({
      productName: Yup.string().required("Product Name is required"),
      productPrice: Yup.string().required("Product Price is required"),
      productImage: Yup.string().required("Product Image is required"),
      productQuantity: Yup.string().required("Product Quantity is required"),
      productDescription: Yup.string().required(
        "Product Description is required"
      ),
    }),
    onSubmit: async values => {
      const formDat = new FormData()
      formDat.append("image", img)
      formDat.append("name", values.productName)
      formDat.append("price", values.productPrice)
      formDat.append("quantity", values.productQuantity)
      formDat.append("description", values.productDescription)
      try {
        setLoader(true)
        const response = await axios.post(
          process.env.REACT_APP_DATABASEURL + "/products/create",
          formDat
        )
        if (response.data) {
          validation.resetForm()
          setSelectedImage(null)
          setImg(null)
          toast.success("🎉 Product Created Successfully")
          setLoader(false)
        }
      } catch (error) {
        if (error.response.data.message) {
          toast.error(error.response.data.message)
        }
      }
      setLoader(false)
    },
  })

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Products" breadcrumbItem="Create New" />
          <Form
            id="createcoach-form"
            onSubmit={e => {
              e.preventDefault()
              validation.handleSubmit()
              return false
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
                      <Label className="form-label">Product Image</Label>
                      <div className="text-center">
                        <div className="position-relative d-inline-block">
                          <div className="position-absolute bottom-0 end-0">
                            <Label
                              htmlFor="project-image-input"
                              className="mb-0"
                              id="productImageInput"
                            >
                              <div className="avatar-xs">
                                <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">
                                  <i className="bx bxs-image-alt"></i>
                                </div>
                              </div>
                            </Label>
                            <UncontrolledTooltip
                              placement="right"
                              target="productImageInput"
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
                              id="projectlogo-img"
                              alt=""
                              className="img-fluid h-auto rounded"
                            />
                          </div>
                        </div>
                        {validation.touched.productImage &&
                        validation.errors.productImage ? (
                          <FormFeedback type="invalid" className="d-block">
                            {validation.errors.productImage}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="productName-input">Product Name</Label>
                      <Input
                        id="productName"
                        name="productName"
                        type="text"
                        placeholder="Enter Product Name..."
                        onChange={validation.handleChange}
                        value={validation.values.productName || ""}
                      />
                      {validation.touched.productName &&
                      validation.errors.productName ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.productName}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="productName-input">Product Price</Label>
                      <Input
                        id="productPrice"
                        name="productPrice"
                        type="text"
                        placeholder="Enter Product Price..."
                        onChange={validation.handleChange}
                        value={validation.values.productPrice || ""}
                      />
                      {validation.touched.productPrice &&
                      validation.errors.productPrice ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.productPrice}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="productQuantity-input">
                        Product Quantity
                      </Label>
                      <Input
                        id="productQuantity"
                        name="productQuantity"
                        type="number"
                        placeholder="Enter product quantity..."
                        onChange={validation.handleChange}
                        value={validation.values.productQuantity || ""}
                      />
                      {validation.touched.productQuantity &&
                      validation.errors.productQuantity ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.productQuantity}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="productDescription-input">
                        Product Description
                      </Label>
                      <Input
                        id="productDescription"
                        name="productDescription"
                        type="textarea"
                        placeholder="Enter product description..."
                        onChange={validation.handleChange}
                        value={validation.values.productDescription || ""}
                      />
                      {validation.touched.productDescription &&
                      validation.errors.productDescription ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.productDescription}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
                <div className="text-end mb-4">
                  <Button type="submit" color="primary" disabled={loader}>
                    Create Product
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

export default ProductCreate
