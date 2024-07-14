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

const AbonnementCreate = () => {
  document.title = "Create New abonnement"

  const [loader, setLoader] = useState(false)
  const [abonnements, setabonnements] = useState([])
  const [toDeleteabonnement, setToDeleteabonnement] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)

  const onClickDelete = abonnement => {
    setToDeleteabonnement(abonnement)
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
      name: Yup.string().required("abonnement name is required"),
      description: Yup.string().required("abonnement description is required"),
      price: Yup.string().required("abonnement price is required"),
      duration: Yup.string().required("abonnement duration is required"),
    }),
    onSubmit: async values => {
      try {
        setLoader(true)
        const response = await axios.post(
          process.env.REACT_APP_DATABASEURL + "/abonnement/create",
          {
            name: values.name,
            description: values.description,
            price: values.price,
            duration: values.duration,
          }
        )
        if (response.data) {
          validation.resetForm()
          fetchabonnements()
          toast.success("🎉 abonnement Created Successfully")
        }
      } catch (error) {
        if (error.response.data.message) {
          toast.error(error.response.data.message)
        }
      }
      setLoader(false)
    },
  })
  const deleteabonnement = async () => {
    if (toDeleteabonnement?.id) {
      try {
        const response = await axios.delete(
          process.env.REACT_APP_DATABASEURL +
            `/abonnement/remove/${toDeleteabonnement.id}`
        )
        if (response.data) {
          fetchabonnements()
          toast.success("🎉 abonnement Deleted Successfully")
        }
      } catch (error) {
        if (error.response.data.message) {
          toast.error(error.response.data.message)
        }
      }
      setDeleteModal(false)
    }
  }

  const fetchabonnements = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DATABASEURL + "/abonnement/find-all"
      )
      setabonnements(response.data)
    } catch (error) {
      if (error.response.data.message) {
        toast.error(error.response.data.message)
      }
    }
  }
  useEffect(() => {
    fetchabonnements()
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="abonnements" breadcrumbItem="abonnements List" />
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
                      <Label htmlFor="name-input">Name abonnement:</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter abonnement Name..."
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
                    Create abonnement
                  </Button>
                </div>
              </Form>
            </Col>
            <Col lg={6}>
              <div className="Card-container">
                {abonnements.length === 0 && (
                  <div className="card-item-header">
                    <h3>No abonnements Available for now</h3>
                  </div>
                )}

                {abonnements.map((abonnement, index) => (
                  <div key={index} className="Card-Item mb-3">
                    <div className="card-item-header">
                      <h3>{abonnement.name}</h3>
                      <div
                        className="icon"
                        onClick={() => onClickDelete(abonnement)}
                      >
                        <i className="bx bx-trash"></i>
                      </div>
                    </div>
                    <div className="card-item-body">
                      <p> This abonnement Will Include:</p>
                      <p className="card-item-description">
                        {abonnement.description}
                      </p>
                    </div>
                    <div className="card-item-footer">
                      <div className="card-duration">
                        <p>Duration: {abonnement.duration} Days</p>
                      </div>

                      <div className="card-price">
                        <p>${abonnement.price}</p>
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
        onDeleteClick={deleteabonnement}
        onCloseClick={() => setDeleteModal(false)}
      />
    </React.Fragment>
  )
}

export default AbonnementCreate
