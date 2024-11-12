import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  UncontrolledTooltip,
  Input,
  Label,
  Row,
} from "reactstrap"
import { toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import "flatpickr/dist/themes/material_blue.css"
import FlatPickr from "react-flatpickr"
import * as Yup from "yup"
import { useFormik } from "formik"
import axios from "axios"
import CardUploader from "./CardUploader"

const ManageFacts = () => {
  //meta titleo
  document.title = "Manage Fun Fact"

  const [loader, setLoader] = useState(false)
  const [cards, setCards] = useState(
    Array(4).fill({ icon: null, text: "", count: 0 })
  )

  const validation = useFormik({
    initialValues: {},
    validationSchema: Yup.object({}),
    onSubmit: async values => {
      if (
        cards.some(
          card => !card.icon || !card.text || !card.count || card.count === 0
        )
      ) {
        toast.error("Please fill all the cards")
        return
      } else {
        try {
          setLoader(true)
          await Promise.all(
            cards.map(card =>
              axios
                .post(
                  process.env.REACT_APP_DATABASEURL +
                    "/fun-fact-section/create",
                  {
                    icon: card.icon,
                    text: card.text,
                    count: card.count,
                  },
                  { headers: { "Content-Type": "multipart/form-data" } }
                )
                .then(response => {})
            )
          )
        } catch (error) {
          console.error("error", error)
        } finally {
          toast.success("🎉 Project Created Successfully")

          setLoader(false)
        }
      }
    },
  })

  const fetchDefaultOnes = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DATABASEURL + "/fun-fact-section/find-all"
      )
      if (response.data) {
        const data = response.data
        setCards(
          data.map(card => ({
            icon: card.icon,
            text: card.text,
            count: card.count,
          }))
        )
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
          {/* Render Breadcrumbs */}
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
                    <div className="mb-3 text-center font-size-16 ">
                      <Container>
                        <Row>
                          {[...Array(4)].map((_, index) => (
                            <Col md={3} key={index} className="mb-4 gap-2">
                              <CardUploader
                                index={index}
                                cards={cards}
                                setCards={setCards}
                                validation={validation}
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

export default ManageFacts
