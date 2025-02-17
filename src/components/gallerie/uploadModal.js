import React, { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import imageCompression from "browser-image-compression"
import { Modal, Button, Form } from "react-bootstrap"
import MultipleDropZone from "components/multipleDropZone/multipleDropZone"

export default function UploadModal({ isOpen, onClose, onUploadComplete }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [fileNames, setFileNames] = useState([])
  const [tags, setTags] = useState([])
  const [pending, setPending] = useState(false)

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

  const handleTagChange = e => {
    setTags(e.target.value.split(",").map(tag => tag.trim()))
  }
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

    formData.append("tags", JSON.stringify(tags))

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
      setTags([])
      onClose()
      toast.success("Images uploaded successfully.")
      onUploadComplete()
    } catch (error) {
      console.error("Error adding new files:", error)
      toast.error("Failed to upload images.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Upload New Images</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={createNewFile}>
          <Form.Group className="mb-3">
            <MultipleDropZone onDrop={handleDrop} fileNames={fileNames} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              value={tags}
              onChange={handleTagChange}
              placeholder="nature, landscape, city"
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
