import React, { useState, useEffect } from "react"
import { Button, Card, CardBody, Col, Container, Form, Row } from "reactstrap"
import { toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import * as Yup from "yup"
import { useFormik } from "formik"
import axios from "axios"
import CardUploader from "./CardUploader"

const AboutSection = () => {
  document.title = "Manage What they say"

  const [loader, setLoader] = useState(false)
  const [cards, setCards] = useState(
    Array(1).fill({
      id: 0,
      thumb: null,
      tagline: "",
      title: "",
      count: 0,
      text: "",
      bottomText: "",
      item1: "",
      item2: "",
    })
  )
  const [length, setLength] = useState(1)

  const validation = useFormik({
    initialValues: {},
    validationSchema: Yup.object({}),
    onSubmit: async values => {
      if (
        cards.some(
          card =>
            !card.thumb ||
            !card.tagline ||
            !card.title ||
            !card.count ||
            !card.text ||
            !card.bottomText ||
            !card.item1 ||
            !card.item2
        )
      ) {
        toast.error("Please fill all the cards")
        return
      } else {
        try {
          setLoader(true)
          await Promise.all(
            cards.map(card =>
              axios.post(
                process.env.REACT_APP_DATABASEURL + "/about-section/create",
                {
                  thumb: card.thumb,
                  tagline: card.tagline,
                  title: card.title,
                  count: card.count,
                  text: card.text,
                  bottomText: card.bottomText,
                  item1: card.item1,
                  item2: card.item2,
                },
                { headers: { "Content-Type": "multipart/form-data" } }
              )
            )
          )
        } catch (error) {
          console.error("error", error)
        } finally {
          setLoader(false)
          toast.success(" 🎉 About Updated Successfully")
          fetchDefaultOnes()
        }
      }
    },
  })

  const fetchDefaultOnes = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DATABASEURL + "/about-section/find-all"
      )
      if (response.data) {
        const data = response.data
        setCards(
          data.map(card => ({
            id: card.id,
            thumb: card.thumb,
            tagline: card.tagline,
            title: card.title,
            count: card.count,
            text: card.text,
            bottomText: card.bottomText,
            item1: card.item1,
            item2: card.item2,
          }))
        )
        setLength(data.length)
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
          <Breadcrumbs title="Section" breadcrumbItem="What they say" />
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

export default AboutSection
