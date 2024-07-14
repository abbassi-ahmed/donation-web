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
import "./styles.css"
import DeleteModal from "components/Common/DeleteModal"

const OfferCreate = () => {
  document.title = "Create New offer"

  const [loader, setLoader] = useState(false)
  const [offers, setOffers] = useState([])
  const [toDeleteOffer, setToDeleteOffer] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)

  const onClickDelete = offer => {
    setToDeleteOffer(offer)
    setDeleteModal(true)
  }
  const validation = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      duration: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Offer name is required"),
      description: Yup.string().required("Offer description is required"),
      price: Yup.string().required("Offer price is required"),
      duration: Yup.string().required("Offer duration is required"),
    }),
    onSubmit: async values => {
      try {
        setLoader(true)
        const response = await axios.post(
          process.env.REACT_APP_DATABASEURL + "/offer/create",
          {
            name: values.name,
            description: values.description,
            price: values.price,
            duration: values.duration,
          }
        )
        if (response.data) {
          validation.resetForm()
          fetchOffers()
          toast.success("🎉 Offer Created Successfully")
        }
      } catch (error) {
        if (error.response.data.message) {
          toast.error(error.response.data.message)
        }
      }
      setLoader(false)
    },
  })
  const deleteOffer = async () => {
    if (toDeleteOffer?.id) {
      try {
        const response = await axios.delete(
          process.env.REACT_APP_DATABASEURL +
            `/offer/remove/${toDeleteOffer.id}`
        )
        if (response.data) {
          fetchOffers()
          toast.success("🎉 Offer Deleted Successfully")
        }
      } catch (error) {
        if (error.response.data.message) {
          toast.error(error.response.data.message)
        }
      }
      setDeleteModal(false)
    }
  }

  const fetchOffers = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DATABASEURL + "/offer/find-all"
      )
      setOffers(response.data)
    } catch (error) {
      if (error.response.data.message) {
        toast.error(error.response.data.message)
      }
    }
  }
  useEffect(() => {
    fetchOffers()
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Offers" breadcrumbItem="Offers List" />
          <Row>
            <Col lg={6}>
              <Form
                id="createcoach-form"
                onSubmit={e => {
                  e.preventDefault()
                  validation.handleSubmit()
                }}
              >
                <Card
                  style={{
                    borderRadius: "10px",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
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
                      <Label htmlFor="name-input">Name Offer:</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter offer Name..."
                        onChange={validation.handleChange}
                        value={validation.values.name || ""}
                      />
                      {validation.touched.name && validation.errors.name ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.name}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="price-input">Price:</Label>
                      <Input
                        id="price"
                        name="price"
                        type="text"
                        placeholder="Enter Price..."
                        onChange={validation.handleChange}
                        value={validation.values.price || ""}
                      />
                      {validation.touched.price && validation.errors.price ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.price}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="duration-input">Duration:</Label>
                      <Input
                        id="duration"
                        name="duration"
                        type="number"
                        placeholder="Enter Duration..."
                        onChange={validation.handleChange}
                        value={validation.values.duration || ""}
                      />
                      {validation.touched.duration &&
                      validation.errors.duration ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.duration}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="description-input">Description:</Label>
                      <Input
                        id="description"
                        name="description"
                        type="textarea"
                        placeholder="Enter Description..."
                        onChange={validation.handleChange}
                        value={validation.values.description || ""}
                      />
                      {validation.touched.description &&
                      validation.errors.description ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.description}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
                <div className="text-end mb-4">
                  <Button type="submit" color="primary" disabled={loader}>
                    Create Offer
                  </Button>
                </div>
              </Form>
            </Col>
            <Col lg={6}>
              <div className="Card-container">
                {offers.length === 0 && (
                  <div className="card-item-header">
                    <h3>No Offers Available for now</h3>
                  </div>
                )}

                {offers.map((offer, index) => (
                  <div key={index} className="Card-Item mb-3">
                    <div className="card-item-header">
                      <h3>{offer.name}</h3>
                      <div
                        className="icon"
                        onClick={() => onClickDelete(offer)}
                      >
                        <i className="bx bx-trash"></i>
                      </div>
                    </div>
                    <div className="card-item-body">
                      <p> This Offer Will Include:</p>
                      <p className="card-item-description">
                        {offer.description}
                      </p>
                    </div>
                    <div className="card-item-footer">
                      <div className="card-duration">
                        <p>Duration: {offer.duration} Days</p>
                      </div>

                      <div className="card-price">
                        <p>${offer.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={deleteOffer}
        onCloseClick={() => setDeleteModal(false)}
      />
    </React.Fragment>
  )
}

export default OfferCreate
