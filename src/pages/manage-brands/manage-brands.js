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

const ManageBrands = () => {
  document.title = "Manage Brands"

  const [loader, setLoader] = useState(false)
  const [brands, setBrands] = useState(Array(4).fill({ id: null, image: null }))

  const validation = useFormik({
    initialValues: {},
    validationSchema: Yup.object({}),
    onSubmit: async values => {
      if (brands.some(card => !card.image)) {
        toast.error("Please fill all the Brands")
        return
      } else {
        try {
          setLoader(true)
          await Promise.all(
            brands.map(card =>
              axios.post(
                process.env.REACT_APP_DATABASEURL + "/worked-with/create",
                {
                  image: card.image,
                },
                { headers: { "Content-Type": "multipart/form-data" } }
              )
            )
          )
          toast.success("🎉 Brands Saved Successfully")
        } catch (error) {
          console.error("error", error)
        } finally {
          setLoader(false)
        }
      }
    },
  })

  const fetchDefaultOnes = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DATABASEURL + "/worked-with/find-all"
      )
      if (response.data) {
        const data = response.data
        setBrands(
          data.map(card => ({
            image: card.image,
            id: card.id, // Store the unique identifier
          }))
        )
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  const removeBrand = async indexToRemove => {
    const brandToRemove = brands[indexToRemove]

    // Prevent removing the last brand
    if (brands.length === 1) {
      toast.error("You can't remove the last brand")
      return
    }

    if (brandToRemove.id) {
      try {
        await axios.delete(
          process.env.REACT_APP_DATABASEURL +
            `/worked-with/remove/${brandToRemove.id}`
        )
        toast.success("Brand removed successfully")
      } catch (error) {
        console.error("Error removing brand", error)
        toast.error("Failed to remove brand")
        return
      }
    }

    setBrands(brands.filter((_, index) => index !== indexToRemove))
  }
  useEffect(() => {
    fetchDefaultOnes()
  }, [])

  const addBrand = () => {
    setBrands([...brands, { image: null }])
  }

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
                          {brands.map((brand, index) => (
                            <Col md={3} key={index} className="mb-4 gap-2">
                              <CardUploader
                                index={index}
                                brands={brands}
                                setBrands={setBrands}
                                validation={validation}
                              />
                              <Button
                                color="danger"
                                size="sm"
                                className="mt-2"
                                onClick={() => removeBrand(index)}
                              >
                                Remove Brand
                              </Button>
                            </Col>
                          ))}
                        </Row>
                      </Container>
                      <Button
                        color="primary"
                        size="sm"
                        className="mt-3"
                        onClick={addBrand}
                      >
                        Add Brand
                      </Button>
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

export default ManageBrands
