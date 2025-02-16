import React, { useEffect, useState } from "react"
import axios from "axios"
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap"
import MultipleDropZone from "components/multipleDropZone/multipleDropZone"
import { toast } from "react-toastify"
import imageCompression from "browser-image-compression"

export default function ImageGallery() {
  const [images, setImages] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [fileNames, setFileNames] = useState([])
  const [loader, setLoader] = useState(false)

  const [pending, setPending] = useState(false)

  const fetchFiles = async () => {
    try {
      setLoader(true)
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/gallerie/find-all`
      )
      setImages(response.data)
      setLoader(false)
    } catch (error) {
      console.error("Error fetching files:", error)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const createNewFile = async e => {
    e.preventDefault()

    if (selectedFiles.length === 0) {
      toast.error("No files selected.")
      return
    }

    const formData = new FormData()
    selectedFiles.forEach(file => {
      formData.append("images", file)
    })

    try {
      setPending(true)
      await axios.post(
        `${process.env.REACT_APP_DATABASEURL}/gallerie/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      setSelectedFiles([])
      setFileNames([])
      toast.success("Images uploaded successfully.")
      setIsOpen(false)
      fetchFiles()
      setPending(false)
    } catch (error) {
      console.error("Error adding new files:", error)
      toast.error("Failed to upload images.")
    }
  }

  const removeImage = async id => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_DATABASEURL}/gallerie/remove/${id}`
      )
      fetchFiles()
      toast.success("Image removed successfully.")
    } catch (error) {
      console.error("Error deleting file:", error)
      toast.error("Failed to delete image.")
    }
  }

  const handleDrop = async acceptedFiles => {
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    }

    const compressedFiles = await Promise.all(
      acceptedFiles.map(async file => {
        try {
          const compressedFile = await imageCompression(file, options)
          return new File([compressedFile], file.name, { type: file.type })
        } catch (error) {
          console.error("Error compressing file:", error)
          return file
        }
      })
    )

    setSelectedFiles(compressedFiles)
    setFileNames(compressedFiles.map(file => file.name))
  }

  return (
    <div className="page-content">
      <Container fluid>
        <div className="d-flex justify-content-end mb-4">
          <Button variant="primary" onClick={() => setIsOpen(true)}>
            <i className="bi bi-plus-circle me-2"></i>
            Upload New Images
          </Button>
        </div>

        <Row xs={1} md={2} lg={3} className="g-4 justify-content-center">
          {loader && (
            <Col xs={12} className="text-center">
              <p className="text-muted">Loading...</p>
            </Col>
          )}

          {!loader && images.length === 0 && (
            <Col xs={12} className="text-center">
              <p className="text-muted">No images available.</p>
            </Col>
          )}

          {!loader &&
            images.map(image => (
              <Col
                key={image.id}
                className="d-flex justify-content-center"
                xl={4}
                sm={6}
              >
                <Card
                  className="gallery-card shadow-sm"
                  style={{
                    width: "300px",
                    height: "350px",
                    overflow: "hidden",
                    borderRadius: "10px",
                    transition: "transform 0.3s",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={image.image}
                    alt="Gallery image"
                    className="gallery-image"
                    style={{ objectFit: "cover", height: "250px" }}
                  />
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeImage(image.id)}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Remove
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>

        <Modal show={isOpen} onHide={() => setIsOpen(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Upload New Images</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={createNewFile}>
              <Form.Group className="mb-3">
                <MultipleDropZone onDrop={handleDrop} fileNames={fileNames} />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
                <Button variant="primary" type="submit" disabled={pending}>
                  {pending ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  )
}
