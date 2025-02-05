import React, { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap"
import { Formik } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import axios from "axios"

function CreateSubscription() {
  const [loader, setLoader] = useState(false)
  const [sports, setSports] = useState([])
  const [clubs, setClubs] = useState([])
  const [subscriptionType, setSubscriptionType] = useState("sport")

  useEffect(() => {
    fetchSports()
    fetchClubs()
  }, [])

  const fetchSports = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_DATABASEURL}/sports/find`)
        .then(response => {
          setSports(response.data)
        })
    } catch (error) {
      console.error("Error fetching sports:", error)
      toast.error("Failed to load sports")
    }
  }

  const fetchClubs = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_DATABASEURL}/clubs/find`)
        .then(response => {
          setClubs(response.data)
        })
    } catch (error) {
      console.error("Error fetching clubs:", error)
      toast.error("Failed to load clubs")
    }
  }

  const validationSchema = Yup.object({
    subscriptionTitle: Yup.string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),
    subscriptionDescription: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),
    subscriptionPrice: Yup.number()
      .required("Price is required")
      .positive("Price must be positive")
      .min(0.01, "Price must be at least 0.01"),
    subscriptionDuration: Yup.number()
      .required("Duration is required")
      .positive("Duration must be positive")
      .integer("Duration must be a whole number"),
    sportId: Yup.string().optional(),
    clubId: Yup.string().optional(),
  })

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoader(true)
      const token = localStorage.getItem("authUser")?.replace(/"/g, "")

      const payload = {
        title: values.subscriptionTitle,
        description: values.subscriptionDescription,
        price: values.subscriptionPrice,
        duration: values.subscriptionDuration,
        [subscriptionType === "sport" ? "sportId" : "clubId"]:
          subscriptionType === "sport" ? values.sportId : values.clubId,
      }

      await axios.post(
        `${process.env.REACT_APP_DATABASEURL}/subscription/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setLoader(false)
      toast.success("Subscription created successfully")
      resetForm()
    } catch (error) {
      setLoader(false)
      console.error("Error creating subscription:", error)
      toast.error("Failed to create subscription")
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h4 className="mb-0">Create New Subscription</h4>
                </Card.Header>
                <Card.Body>
                  <Formik
                    initialValues={{
                      subscriptionTitle: "",
                      subscriptionDescription: "",
                      subscriptionPrice: "",
                      subscriptionDuration: "",
                      sportId: "",
                      clubId: "",
                      subscriptionType,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({
                      handleSubmit,
                      handleChange,
                      values,
                      touched,
                      errors,
                    }) => (
                      <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                          <Form.Label>Subscription Type</Form.Label>
                          <div className="d-flex gap-3">
                            <Form.Check
                              type="radio"
                              label="Sport"
                              name="subscriptionType"
                              id="sport-type"
                              checked={subscriptionType === "sport"}
                              onChange={() => setSubscriptionType("sport")}
                              className="form-check-inline"
                            />
                            <Form.Check
                              type="radio"
                              label="Club"
                              name="subscriptionType"
                              id="club-type"
                              checked={subscriptionType === "club"}
                              onChange={() => setSubscriptionType("club")}
                              className="form-check-inline"
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>
                            <span className="d-flex align-items-center gap-2">
                              Title
                            </span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="subscriptionTitle"
                            placeholder="Enter subscription title"
                            value={values.subscriptionTitle}
                            onChange={handleChange}
                            isInvalid={
                              touched.subscriptionTitle &&
                              !!errors.subscriptionTitle
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.subscriptionTitle}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="subscriptionDescription"
                            placeholder="Enter subscription description"
                            value={values.subscriptionDescription}
                            onChange={handleChange}
                            isInvalid={
                              touched.subscriptionDescription &&
                              !!errors.subscriptionDescription
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.subscriptionDescription}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label>
                                <span className="d-flex align-items-center gap-2">
                                  Price
                                </span>
                              </Form.Label>
                              <Form.Control
                                type="number"
                                name="subscriptionPrice"
                                placeholder="Enter price"
                                value={values.subscriptionPrice}
                                onChange={handleChange}
                                isInvalid={
                                  touched.subscriptionPrice &&
                                  !!errors.subscriptionPrice
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.subscriptionPrice}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label>
                                <span className="d-flex align-items-center gap-2">
                                  Duration (months)
                                </span>
                              </Form.Label>
                              <Form.Control
                                type="number"
                                name="subscriptionDuration"
                                placeholder="Enter duration in months"
                                value={values.subscriptionDuration}
                                onChange={handleChange}
                                isInvalid={
                                  touched.subscriptionDuration &&
                                  !!errors.subscriptionDuration
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.subscriptionDuration}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        {subscriptionType === "sport" ? (
                          <Form.Group className="mb-4">
                            <Form.Label>
                              <span className="d-flex align-items-center gap-2">
                                Select Sport
                              </span>
                            </Form.Label>
                            <Form.Select
                              name="sportId"
                              value={values.sportId}
                              onChange={handleChange}
                              isInvalid={touched.sportId && !!errors.sportId}
                            >
                              <option value="">Choose a sport...</option>
                              {sports.map(sport => (
                                <option key={sport.id} value={sport.id}>
                                  {sport.name}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {errors.sportId}
                            </Form.Control.Feedback>
                          </Form.Group>
                        ) : (
                          <Form.Group className="mb-4">
                            <Form.Label>
                              <span className="d-flex align-items-center gap-2">
                                Select Club
                              </span>
                            </Form.Label>
                            <Form.Select
                              name="clubId"
                              value={values.clubId}
                              onChange={handleChange}
                              isInvalid={touched.clubId && !!errors.clubId}
                            >
                              <option value="">Choose a club...</option>
                              {clubs.map(club => (
                                <option key={club.id} value={club.id}>
                                  {club.name}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {errors.clubId}
                            </Form.Control.Feedback>
                          </Form.Group>
                        )}

                        <div className="d-flex justify-content-end">
                          <Button
                            type="submit"
                            variant="primary"
                            disabled={loader}
                            className="px-4"
                          >
                            {loader ? "Creating..." : "Create Subscription"}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default CreateSubscription
