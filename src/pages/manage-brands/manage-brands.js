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

const apiBaseURL = process.env.REACT_APP_DATABASEURL

const postBrandImage = image => {
  return axios.post(
    `${apiBaseURL}/worked-with/create`,
    {
      image,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  )
}

const fetchAllBrands = async () => {
  try {
    const response = await axios.get(`${apiBaseURL}/worked-with/find-all`)
    return response.data
  } catch (error) {
    console.error("Error fetching brands", error)
    return []
  }
}

const deleteBrandById = async id => {
  try {
    await axios.delete(`${apiBaseURL}/worked-with/remove/${id}`)
    toast.success("Brand removed successfully")
  } catch (error) {
    console.error("Error removing brand", error)
    toast.error("Failed to remove brand")
  }
}

const ManageBrands = () => {
  document.title = "Manage Brands"

  const [loader, setLoader] = useState(false)
  const [brands, setBrands] = useState(Array(4).fill({ id: null, image: null }))

  const validation = useFormik({
    initialValues: {},
    validationSchema: Yup.object({}),
    onSubmit: async () => {
      const newBrands = brands.filter(brand => !brand.id && brand.image)
      if (!newBrands.length) {
        toast.error("Please add at least one brand")
        return
      }
      try {
        setLoader(true)
        await Promise.all(newBrands.map(brand => postBrandImage(brand.image)))
        toast.success("🎉 Brands Saved Successfully")
      } catch (error) {
        console.error("Error saving brands", error)
      } finally {
        setLoader(false)
      }
    },
  })

  useEffect(() => {
    const initializeBrands = async () => {
      const data = await fetchAllBrands()
      if (data.length) {
        setBrands(data.map(brand => ({ id: brand.id, image: brand.image })))
      }
    }
    initializeBrands()
  }, [])

  const addBrand = () => {
    setBrands(prev => [...prev, { image: null }])
  }

  const removeBrand = async index => {
    const brandToRemove = brands[index]

    if (brands.length === 1) {
      toast.error("You can't remove the last brand")
      return
    }

    if (brandToRemove.id) {
      await deleteBrandById(brandToRemove.id)
    }

    setBrands(brands.filter((_, i) => i !== index))
  }

  return (
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
                  <BrandList
                    brands={brands}
                    setBrands={setBrands}
                    removeBrand={removeBrand}
                    validation={validation}
                  />
                  <Button
                    color="primary"
                    size="sm"
                    className="mt-3"
                    onClick={addBrand}
                  >
                    Add
                  </Button>
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
  )
}

const BrandList = ({ brands, setBrands, removeBrand, validation }) => (
  <Container className="d-flex flex-row flex-wrap justify-content-center">
    {brands.map((brand, index) => (
      <Row key={index} className="mb-4 align-items-center d-flex">
        <Row>
          <Col md={3}>
            <CardUploader
              index={index}
              brands={brands}
              setBrands={setBrands}
              validation={validation}
            />
          </Col>
        </Row>
        <Row>
          <Col md={7}>
            <Button
              color="danger"
              size="sm"
              className="mt-2"
              onClick={() => removeBrand(index)}
            >
              Remove This
            </Button>
          </Col>
        </Row>
      </Row>
    ))}
  </Container>
)

export default ManageBrands
