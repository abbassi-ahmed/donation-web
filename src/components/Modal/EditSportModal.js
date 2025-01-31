import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
} from "reactstrap"
import axios from "axios"
import imageCompression from "browser-image-compression"
const EditSportModal = ({
  show,
  toggle,
  sport,
  onCloseClick,
  onSaveFinished,
}) => {
  const [tempSport, setTempSport] = useState(sport)
  const [coverPreview, setCoverPreview] = useState(sport.cover)
  const [logoPreview, setLogoPreview] = useState(sport.logo)
  const [imagesPreviews, setImagesPreviews] = useState(sport.images)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [oldImages, setOldImages] = useState([])

  useEffect(() => {
    if (show) {
      setTempSport(sport)
      setCoverPreview(sport.cover)
      setLogoPreview(sport.logo)
      setImagesPreviews(sport.images)
      setError(null)
      setOldImages(sport.images)
    }
  }, [show, sport])

  useEffect(() => {
    if (show) {
      setOldImages(tempSport.images.filter(image => typeof image === "string"))
    }
  }, [tempSport.images])

  const onSave = async () => {
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("name", tempSport.name)
      formData.append("description", tempSport.description)

      oldImages.forEach(image => {
        formData.append("oldImages", image)
      })

      if (tempSport.cover) formData.append("cover", tempSport.cover)
      if (tempSport.logo) formData.append("logo", tempSport.logo)

      tempSport.images.forEach(image => {
        formData.append("images", image)
      })

      await axios.put(
        `${process.env.REACT_APP_DATABASEURL}/sports/update/${sport.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )

      onSaveFinished()
      onCloseClick()
    } catch (error) {
      console.error("Error updating sport", error)
      setError("Failed to update sport. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = async (event, type) => {
    const file = event.target.files[0]
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

  const handleRemoveImage = index => {
    const newImages = tempSport.images.filter((_, i) => i !== index)
    const newPreviews = imagesPreviews.filter((_, i) => i !== index)
    setTempSport({ ...tempSport, images: newImages })
    setImagesPreviews(newPreviews)
  }

  const handleSave = async e => {
    e.preventDefault()
    await onSave()
  }

  return (
    <Modal size="lg" isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalHeader toggle={onCloseClick}>Edit Sport</ModalHeader>
      <Form onSubmit={handleSave}>
        <ModalBody>
          {error && <Alert color="danger">{error}</Alert>}

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
                setTempSport({ ...tempSport, description: e.target.value })
              }
              required
            />
          </FormGroup>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="coverImage">Cover Image</Label>
                <div className="mb-2">
                  <img
                    src={coverPreview || "/placeholder.svg"}
                    alt="Cover"
                    className="img-fluid rounded"
                    style={{
                      width: "400px",
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <Input
                  type="file"
                  id="coverImage"
                  name="cover"
                  onChange={e => handleImageChange(e, "cover")}
                  accept="image/*"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="logoImage">Logo</Label>
                <div className="mb-2">
                  <img
                    src={logoPreview || "/placeholder.svg"}
                    alt="Logo"
                    className="img-fluid rounded"
                    style={{
                      width: "400px",
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <Input
                  type="file"
                  id="logoImage"
                  name="logo"
                  onChange={e => handleImageChange(e, "logo")}
                  accept="image/*"
                />
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
                        width: "150px",
                        height: "150px",
                        objectFit: "contain",
                      }}
                    />
                    <Button
                      color="danger"
                      size="sm"
                      className="position-absolute top-0 end-0 m-1"
                      onClick={() => handleRemoveImage(index)}
                    >
                      &times;
                    </Button>
                  </div>
                </Col>
              ))}
              <Col xs={6} md={3}>
                <div
                  className="d-flex justify-content-center align-items-center bg-light rounded"
                  style={{ height: "100px", cursor: "pointer" }}
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
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={onCloseClick}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Save Changes"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

EditSportModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  sport: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onCloseClick: PropTypes.func.isRequired,
  onSaveFinished: PropTypes.func.isRequired,
}

export default EditSportModal
