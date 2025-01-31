import React, { useState } from "react"
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Card,
  CardBody,
  Alert,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import "flatpickr/dist/themes/material_blue.css"
import axios from "axios"
import imageCompression from "browser-image-compression"
const SportsCreate = () => {
  document.title = "Create New Sport"

  const [tempSport, setTempSport] = useState({
    name: "",
    description: "",
    cover: null,
    logo: null,
    images: [],
  })
  const [coverPreview, setCoverPreview] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [imagesPreviews, setImagesPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleRemoveImage = index => {
    const newImages = tempSport.images.filter((_, i) => i !== index)
    const newPreviews = imagesPreviews.filter((_, i) => i !== index)
    setTempSport({ ...tempSport, images: newImages })
    setImagesPreviews(newPreviews)
  }

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0]
    if (file) {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      }

      try {
        const compressedFile = await imageCompression(file, options)
        const reader = new FileReader()

        reader.onloadend = () => {
          const base64Image = reader.result

          if (type === "cover") {
            setTempSport({ ...tempSport, cover: compressedFile })
            setCoverPreview(base64Image)
          } else if (type === "logo") {
            setTempSport({ ...tempSport, logo: compressedFile })
            setLogoPreview(base64Image)
          } else if (type === "gallery") {
            setTempSport({
              ...tempSport,
              images: [...tempSport.images, compressedFile],
            })
            setImagesPreviews([...imagesPreviews, base64Image])
          }
        }

        reader.readAsDataURL(compressedFile)
      } catch (error) {
        console.error("Error compressing image:", error)
      }
    }
  }

  const onSave = async () => {
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("name", tempSport.name)
      formData.append("description", tempSport.description)

      if (tempSport.cover) formData.append("cover", tempSport.cover)
      if (tempSport.logo) formData.append("logo", tempSport.logo)

      tempSport.images.forEach(image => {
        formData.append("images", image)
      })

      await axios.post(
        `${process.env.REACT_APP_DATABASEURL}/sports/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )

      setTempSport({
        name: "",
        description: "",
        cover: null,
        logo: null,
        images: [],
      })
      setCoverPreview(null)
      setLogoPreview(null)
      setImagesPreviews([])
    } catch (error) {
      console.error("Error updating sport", error)
      setError("Failed to update sport. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async e => {
    e.preventDefault()
    await onSave()
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Sports" breadcrumbItem="Create New" />
          <Card className="shadow-sm">
            <CardBody>
              <h4 className="card-title mb-4">Create New Sport</h4>
              <Form id="createsport-form" onSubmit={handleSave}>
                <FormGroup>
                  <Label for="name">Sport Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={tempSport.name}
                    onChange={e =>
                      setTempSport({ ...tempSport, name: e.target.value })
                    }
                    required
                    className="form-control-lg"
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    type="textarea"
                    rows="4"
                    value={tempSport.description}
                    onChange={e =>
                      setTempSport({
                        ...tempSport,
                        description: e.target.value,
                      })
                    }
                    required
                    className="form-control-lg"
                  />
                </FormGroup>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="coverImage">Cover Image</Label>
                      <div
                        className="mb-3 d-flex justify-content-center align-items-center bg-light rounded"
                        style={{ height: "200px" }}
                      >
                        {coverPreview ? (
                          <img
                            src={coverPreview || "/placeholder.svg"}
                            alt="Cover"
                            className="img-fluid rounded"
                            style={{
                              maxHeight: "100%",
                              maxWidth: "100%",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <div className="text-center">
                            <i
                              className="bx bx-cloud-upload"
                              style={{ fontSize: "48px" }}
                            ></i>
                            <p className="text-muted">
                              Click to upload cover image
                            </p>
                          </div>
                        )}
                      </div>
                      <Input
                        type="file"
                        id="coverImage"
                        name="cover"
                        onChange={e => handleImageChange(e, "cover")}
                        accept="image/*"
                        hidden
                      />
                      <Button
                        color="primary"
                        onClick={() =>
                          document.getElementById("coverImage").click()
                        }
                      >
                        Upload Cover Image
                      </Button>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="logoImage">Logo</Label>
                      <div
                        className="mb-3 d-flex justify-content-center align-items-center bg-light rounded"
                        style={{ height: "200px" }}
                      >
                        {logoPreview ? (
                          <img
                            src={logoPreview || "/placeholder.svg"}
                            alt="Logo"
                            className="img-fluid rounded"
                            style={{
                              maxHeight: "100%",
                              maxWidth: "100%",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <div className="text-center">
                            <i
                              className="bx bx-cloud-upload"
                              style={{ fontSize: "48px" }}
                            ></i>
                            <p className="text-muted">Click to upload logo</p>
                          </div>
                        )}
                      </div>
                      <Input
                        type="file"
                        id="logoImage"
                        name="logo"
                        onChange={e => handleImageChange(e, "logo")}
                        accept="image/*"
                        hidden
                      />
                      <Button
                        color="primary"
                        onClick={() =>
                          document.getElementById("logoImage").click()
                        }
                      >
                        Upload Logo
                      </Button>
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label>Gallery Images</Label>
                  <Row>
                    {imagesPreviews.map((image, index) => (
                      <Col key={index} xs={6} md={3} className="mb-3">
                        <div className="position-relative">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Gallery ${index + 1}`}
                            className="img-fluid rounded"
                            style={{
                              width: "100%",
                              height: "150px",
                              objectFit: "cover",
                            }}
                          />
                          <Button
                            color="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <i className="bx bx-x"></i>
                          </Button>
                        </div>
                      </Col>
                    ))}
                    <Col xs={6} md={3}>
                      <div
                        className="d-flex justify-content-center align-items-center bg-light rounded"
                        style={{ height: "150px", cursor: "pointer" }}
                        onClick={() =>
                          document.getElementById("galleryImage").click()
                        }
                      >
                        <i className="bx bx-plus text-primary h1"></i>
                      </div>
                      <Input
                        type="file"
                        id="galleryImage"
                        onChange={e => handleImageChange(e, "gallery")}
                        accept="image/*"
                        hidden
                      />
                    </Col>
                  </Row>
                </FormGroup>

                {error && <Alert color="danger">{error}</Alert>}

                <div className="text-center mt-4">
                  <Button
                    color="primary"
                    type="submit"
                    disabled={loading}
                    className="px-5"
                  >
                    {loading ? "Saving..." : "Save Sport"}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default SportsCreate
