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

const EditClubModal = ({
  show,
  toggle,
  club,
  onCloseClick,
  onSaveFinished,
}) => {
  const [tempClub, setTempClub] = useState(club)
  const [coverPreview, setCoverPreview] = useState(club.cover)
  const [logoPreview, setLogoPreview] = useState(club.logo)
  const [imagesPreviews, setImagesPreviews] = useState(club.images)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (show) {
      setTempClub(club)
      setCoverPreview(club.cover)
      setLogoPreview(club.logo)
      setImagesPreviews(club.images)
      setError(null)
    }
  }, [show, club])

  const onSave = async () => {
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("name", tempClub.name)
      formData.append("description", tempClub.description)
      if (tempClub.cover instanceof File)
        formData.append("cover", tempClub.cover)
      if (tempClub.logo instanceof File) formData.append("logo", tempClub.logo)
      tempClub.images.forEach((image, index) => {
        if (image instanceof File) formData.append(`images`, image)
      })

      await axios.put(
        `${process.env.REACT_APP_DATABASEURL}/clubs/update/${club.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      onSaveFinished()
      onCloseClick()
    } catch (error) {
      console.error("Error updating club", error)
      setError("Failed to update club. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (event, type) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === "cover") {
          setTempClub({ ...tempClub, cover: file })
          setCoverPreview(reader.result)
        } else if (type === "logo") {
          setTempClub({ ...tempClub, logo: file })
          setLogoPreview(reader.result)
        } else if (type === "gallery") {
          const newImages = [...tempClub.images, file]
          setTempClub({ ...tempClub, images: newImages })
          setImagesPreviews([...imagesPreviews, reader.result])
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = index => {
    const newImages = tempClub.images.filter((_, i) => i !== index)
    const newPreviews = imagesPreviews.filter((_, i) => i !== index)
    setTempClub({ ...tempClub, images: newImages })
    setImagesPreviews(newPreviews)
  }

  const handleSave = async e => {
    e.preventDefault()
    await onSave()
  }

  return (
    <Modal size="lg" isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalHeader toggle={onCloseClick}>Edit Club</ModalHeader>
      <Form onSubmit={handleSave}>
        <ModalBody>
          {error && <Alert color="danger">{error}</Alert>}

          <FormGroup>
            <Label for="name">Club Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={tempClub.name}
              onChange={e => setTempClub({ ...tempClub, name: e.target.value })}
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
              value={tempClub.description}
              onChange={e =>
                setTempClub({ ...tempClub, description: e.target.value })
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

EditClubModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  club: PropTypes.shape({
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

export default EditClubModal
