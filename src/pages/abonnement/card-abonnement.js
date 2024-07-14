import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardBody,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  FormFeedback,
  Input,
  Form,
  UncontrolledTooltip,
} from "reactstrap"
import "./styles.css"
import { ToastContainer, toast } from "react-toastify"
import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import DeleteModal from "components/Common/DeleteModal"

const CardAbonnement = ({ products, fetchProduct }) => {
  const [modal, setModal] = useState(false)
  const [contact, setContact] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [img, setImg] = useState(null)
  const [productId, setProductId] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)

  const toggle = () => {
    setModal(!modal)
  }

  const handleProductClick = product => {
    setContact(product)
    setIsEdit(true)
    setProductId(product.id)
    toggle()
  }

  const validation = useFormik({
    initialValues: {
      name: "",
      price: "",
      image: "",
      quantity: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product Name is required"),
      price: Yup.string().required("Product Price is required"),
      image: Yup.string().required("Product Image is required"),
      quantity: Yup.string().required("Product Quantity is required"),
      description: Yup.string().required("Product Description is required"),
    }),
    onSubmit: async values => {
      const formData = new FormData()
      formData.append("image", img || values.image)
      formData.append("name", values.name)
      formData.append("price", values.price)
      formData.append("quantity", values.quantity)
      formData.append("description", values.description)

      try {
        const response = await axios.put(
          `${process.env.REACT_APP_DATABASEURL}/products/update/${productId}`, // Use the productId here
          formData
        )
        toast.success("Product Updated Successfully!")
        fetchProduct()
        setImg(null)
        setSelectedImage(null)
        toggle()
      } catch (error) {
        console.error("Error updating product:", error)
        toast.error("Failed to update product")
      }
    },
  })

  const handleImageChange = e => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      setImg(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
        validation.setFieldValue("image", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onClickDelete = product => {
    setContact(product)
    setDeleteModal(true)
  }

  const handleDeleteProduct = async () => {
    if (contact?.id) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_DATABASEURL}/products/delete/${contact.id}`
        )
        fetchProduct()
        toast.success("Product deleted successfully")
      } catch (error) {
        toast.error("Error deleting Product")
        console.error("Error deleting Product:", error)
      }
    }
    setDeleteModal(false)
  }

  useEffect(() => {
    if (contact) {
      validation.setValues({
        name: contact.name || "",
        price: contact.price || "",
        image: contact.image || "",
        quantity: contact.quantity || "",
        description: contact.description || "",
      })
    }
  }, [contact])

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProduct}
        onCloseClick={() => setDeleteModal(false)}
      />
      <Row>
        {(products || []).map((product, key) => (
          <Col xl={3} sm={4} key={key}>
            <Card className="product-card position-relative p-3">
              {/* Delete button */}
              <div
                className="position-absolute top-0 end-0 border-start border-bottom bg-light border-2 border-red rounded-start"
                style={{ borderColor: "red" }}
              >
                <Link
                  to="#"
                  className="text-danger"
                  onClick={() => onClickDelete(product)}
                >
                  <i className="mdi mdi-delete font-size-18" />
                </Link>
              </div>

              <CardBody>
                <div className="text-center">
                  {/* Product image */}
                  <div className="product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="img-fluid rounded"
                    />
                  </div>

                  {/* Product name */}
                  <h5 className="text-truncate font-size-15 mt-3">
                    <Link
                      to="#"
                      className="text-dark"
                      onClick={() => handleProductClick(product)}
                    >
                      {product.name}
                    </Link>
                  </h5>

                  {/* Product price */}
                  <p className="text-muted mb-2">Price: ${product.price}</p>

                  {/* Product quantity (example) */}
                  <p className="text-muted mb-4">
                    Quantity: {product.quantity}
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {isEdit ? "Edit Product" : "Add Product"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={validation.handleSubmit}>
            <div className="mb-3">
              <Label className="form-label">Product Image</Label>
              <div className="text-center">
                <div className="position-relative d-inline-block">
                  <div className="position-absolute bottom-0 end-0">
                    <Label
                      htmlFor="product-image-input"
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
                      id="product-image-input"
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="avatar-lg">
                    <div className="avatar-title bg-light rounded-circle">
                      <img
                        src={selectedImage || validation.values.image}
                        id="productImage"
                        alt=""
                        className="avatar-md h-auto rounded-circle"
                      />
                    </div>
                  </div>
                </div>
                {validation.touched.image && validation.errors.image ? (
                  <FormFeedback type="invalid" className="d-block">
                    {validation.errors.image}
                  </FormFeedback>
                ) : null}
              </div>
            </div>
            <Row>
              <Col md="12">
                <div className="mb-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter Name"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.name}
                    invalid={
                      validation.touched.name && !!validation.errors.name
                    }
                  />
                  <FormFeedback>{validation.errors.name}</FormFeedback>
                </div>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <div className="mb-3">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    type="text"
                    id="price"
                    name="price"
                    placeholder="Enter Price"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.price}
                    invalid={
                      validation.touched.price && !!validation.errors.price
                    }
                  />
                  <FormFeedback>{validation.errors.price}</FormFeedback>
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    type="number"
                    id="quantity"
                    name="quantity"
                    placeholder="Enter quantity"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.quantity}
                    invalid={
                      validation.touched.quantity &&
                      !!validation.errors.quantity
                    }
                  />
                  <FormFeedback>{validation.errors.quantity}</FormFeedback>
                </div>
              </Col>
            </Row>
            <Col md="12">
              <div className="mb-3">
                <Label htmlFor="description">Description</Label>
                <Input
                  type="textarea"
                  id="description"
                  name="description"
                  placeholder="Enter description"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.description}
                  invalid={
                    validation.touched.description &&
                    !!validation.errors.description
                  }
                />
                <FormFeedback>{validation.errors.description}</FormFeedback>
              </div>
            </Col>

            <div className="text-end">
              <button type="submit" className="btn btn-primary">
                {isEdit ? "Update" : "Add"}
              </button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
      <ToastContainer />
    </React.Fragment>
  )
}

CardAbonnement.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      image: PropTypes.string,
      name: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  fetchProduct: PropTypes.func.isRequired,
}

CardAbonnement.defaultProps = {
  products: [],
}

export default CardAbonnement
