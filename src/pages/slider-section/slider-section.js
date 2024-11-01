import React, { useState, useEffect } from "react"
import { Button, Card, CardBody, Col, Container, Form, Row } from "reactstrap"
import { toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import * as Yup from "yup"
import { useFormik } from "formik"
import axios from "axios"
import CardUploader from "./CardUploader"

const ManageSlider = () => {
  const [loader, setLoader] = useState(false)
  const [cards, setCards] = useState([{ id: 0, bg: null, title: "", text: "" }])
  const [oldCards, setOldCards] = useState([])
  useEffect(() => {
    document.title = "Manage slider"
    fetchDefaultOnes()
  }, [])

  const validation = useFormik({
    initialValues: {},
    validationSchema: Yup.object({}),
    onSubmit: async values => {
      if (cards.some(card => !card.bg || !card.title || !card.text)) {
        toast.error("Please fill all the cards")
        return
      }

      try {
        setLoader(true)

        const newCards = cards.filter(
          card => !oldCards.some(oldCard => oldCard.id === card.id)
        )
        const updatedCards = cards.filter(card =>
          oldCards.some(
            oldCard =>
              oldCard.id === card.id &&
              (oldCard.title !== card.title ||
                oldCard.text !== card.text ||
                oldCard.bg !== card.bg)
          )
        )

        if (newCards.length > 0) {
          await Promise.all(
            newCards.map(card =>
              axios.post(
                `${process.env.REACT_APP_DATABASEURL}/slider-section/create`,
                { bg: card.bg, title: card.title, text: card.text },
                { headers: { "Content-Type": "multipart/form-data" } }
              )
            )
          )
        }
        if (updatedCards.length > 0) {
          await Promise.all(
            updatedCards.map(card =>
              axios.put(
                `${process.env.REACT_APP_DATABASEURL}/slider-section/update/${card.id}`,
                { bg: card.bg, title: card.title, text: card.text },
                { headers: { "Content-Type": "multipart/form-data" } }
              )
            )
          )
        }

        toast.success("Sliders saved successfully")
        fetchDefaultOnes()
      } catch (error) {
        console.error("Error saving sliders:", error)
        toast.error("Error saving sliders")
      } finally {
        setLoader(false)
      }
    },
  })

  const fetchDefaultOnes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/slider-section/find-all`
      )
      const data = response.data || []
      setCards(
        data
          .map(card => ({
            id: card.id,
            bg: card.bg,
            title: card.title,
            text: card.text,
          }))
          .sort((a, b) => a.id - b.id)
      )
      setOldCards(data)
    } catch (error) {
      console.error("Error fetching sliders:", error)
      toast.error("Error fetching sliders")
    }
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Section" breadcrumbItem="Slider" />
        <Form
          id="createproject-form"
          onSubmit={e => {
            e.preventDefault()
            validation.handleSubmit()
          }}
        >
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="mb-3 text-center font-size-16">
                    <Container>
                      <Row>
                        {cards.map((_, index) => (
                          <Col md={12} key={index} className="mb-4 gap-2">
                            <CardUploader
                              index={index}
                              cards={cards}
                              setCards={setCards}
                              validation={validation}
                              fetchDefaultOnes={fetchDefaultOnes}
                            />
                          </Col>
                        ))}
                      </Row>
                    </Container>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col lg={12}>
              <div className="hstack gap-2 justify-content-end">
                <Button type="submit" color="primary" disabled={loader}>
                  {loader ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  )
}

export default ManageSlider
