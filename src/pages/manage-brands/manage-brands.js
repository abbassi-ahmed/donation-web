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

const postPartner = async ({ image, title, link }) => {
  return axios.post(
    `${apiBaseURL}/worked-with/create`,
    {
      image,
      title,
      link,
    },

    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  )
}

const fetchAllPartners = async () => {
  try {
    const response = await axios.get(`${apiBaseURL}/worked-with/find-all`)
    return response.data
  } catch (error) {
    console.error("Error fetching partners", error)
    return []
  }
}

const deletePartnerById = async id => {
  try {
    await axios.delete(`${apiBaseURL}/worked-with/remove/${id}`)
    toast.success("Partner removed successfully")
  } catch (error) {
    console.error("Error removing partner", error)
    toast.error("Failed to remove partner")
  }
}
const updatePartnerById = async (id, { image, title, link }) => {
  return axios.put(
    `${apiBaseURL}/worked-with/update/${id}`,
    {
      image,
      title,
      link,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  )
}

const ManagePartners = () => {
  document.title = "Manage Partners"

  const [loader, setLoader] = useState(false)
  const [partners, setPartners] = useState(
    Array(4).fill({ id: null, image: null, title: "", link: "" })
  )

  const validation = useFormik({
    initialValues: {},
    validationSchema: Yup.object({}),
    onSubmit: async () => {
      const newPartners = partners.filter(
        partner => !partner.id && partner.image
      )
      const updatedPartners = partners.filter(
        partner =>
          partner.id && (partner.title || partner.link || partner.image)
      )

      if (!newPartners.length && !updatedPartners.length) {
        toast.error("Please add or update at least one partner")
        return
      }

      try {
        setLoader(true)

        // Handle new partners
        if (newPartners.length) {
          await Promise.all(newPartners.map(partner => postPartner(partner)))
        }

        // Handle updates to existing partners
        if (updatedPartners.length) {
          await Promise.all(
            updatedPartners.map(partner =>
              updatePartnerById(partner.id, partner)
            )
          )
        }

        toast.success("🎉 Partners Saved Successfully")
      } catch (error) {
        console.error("Error saving partners", error)
        toast.error("Failed to save partners")
      } finally {
        setLoader(false)
      }
    },
  })

  useEffect(() => {
    const initializePartners = async () => {
      const data = await fetchAllPartners()
      if (data.length) {
        setPartners(
          data.map(partner => ({
            id: partner.id,
            image: partner.image,
            title: partner.title,
            link: partner.link,
          }))
        )
      }
    }
    initializePartners()
  }, [])

  const addPartner = () => {
    setPartners(prev => [...prev, { image: null, title: "", link: "" }])
  }

  const removePartner = async index => {
    const partnerToRemove = partners[index]

    if (partners.length === 1) {
      toast.error("You can't remove the last partner")
      return
    }

    if (partnerToRemove.id) {
      await deletePartnerById(partnerToRemove.id)
    }

    setPartners(partners.filter((_, i) => i !== index))
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Section" breadcrumbItem="Partners" />
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
                  <PartnerList
                    partners={partners}
                    setPartners={setPartners}
                    removePartner={removePartner}
                    validation={validation}
                  />
                  <Button
                    color="primary"
                    size="sm"
                    className="mt-3"
                    onClick={addPartner}
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

const PartnerList = ({ partners, setPartners, removePartner, validation }) => (
  <Container className="d-flex flex-row flex-wrap justify-content-center">
    {partners.map((partner, index) => (
      <Row key={index} className="mb-4 align-items-center d-flex">
        <Row>
          <Col md={3}>
            <CardUploader
              index={index}
              partners={partners}
              setPartners={setPartners}
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
              onClick={() => removePartner(index)}
            >
              Remove This
            </Button>
          </Col>
        </Row>
      </Row>
    ))}
  </Container>
)

export default ManagePartners
