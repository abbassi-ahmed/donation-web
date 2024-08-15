import React, { useState, useEffect } from "react"
import { Button, Card, CardBody, Col, Container, Form, Row } from "reactstrap"
import { toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import * as Yup from "yup"
import { useFormik } from "formik"
import axios from "axios"
import CardUploader from "./CardUploader"

const ManageSlider = () => {
  document.title = "Manage Fun Fact"

  const [loader, setLoader] = useState(false)
  const [cards, setCards] = useState(
    Array(1).fill({ id: 0, bg: null, text: "", title: "" })
  )
  const [length, setLength] = useState(1)
  const [oldCards, setOldCards] = useState([])

  const validation = useFormik({
    initialValues: {},
    validationSchema: Yup.object({}),
    onSubmit: async values => {
      if (cards.some(card => !card.bg || !card.text || !card.title)) {
        toast.error("Please fill all the cards")
        return
      } else {
        try {
          setLoader(true)
          await Promise.all(
            cards
              .filter(card => !oldCards.some(oldCard => oldCard.id === card.id))
              .map(card =>
                axios.post(
                  process.env.REACT_APP_DATABASEURL + "/slider-section/create",
                  {
                    bg: card.bg,
                    text: card.text,
                    title: card.title,
                  },
                  { headers: { "Content-Type": "multipart/form-data" } }
                )
              )
          )
        } catch (error) {
          console.error("error", error)
        } finally {
          setLoader(false)
          toast.success("Sliders saved successfully")
          fetchDefaultOnes()
        }
      }
    },
  })

  const fetchDefaultOnes = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DATABASEURL + "/slider-section/find-all"
      )
      if (response.data) {
        const data = response.data
        setCards(
          data.map(card => ({
            id: card.id,
            bg: card.bg,
            text: card.text,
            title: card.title,
          }))
        )
        setLength(data.length)
        setOldCards(data)
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  useEffect(() => {
    fetchDefaultOnes()
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Section" breadcrumbItem="FunFact" />
          <Form
            id="createproject-form"
            onSubmit={e => {
              e.preventDefault()
              validation.handleSubmit()
              return false
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
                                length={length}
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
                  <Button
                    type="submit"
                    color="primary"
                    id="add-btn"
                    className="btn btn-primary"
                    disabled={loader}
                  >
                    {loader ? "Saving..." : "Save Changes"}
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

export default ManageSlider
