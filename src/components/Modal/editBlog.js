import React, { useEffect, useState } from "react"
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap"
import axios from "axios"

const EditBlogModal = ({
  show,
  toggle,
  blog,
  onCloseClick,
  setEditBlog,
  onSaveFinished,
}) => {
  const [tempBlog, setTempBlog] = useState(blog)
  const [previewImage, setPreviewImage] = useState(blog.image)

  useEffect(() => {
    if (show) {
      setTempBlog(blog)
      setPreviewImage(blog.image)
    }
  }, [show, blog])

  const onSave = async () => {
    try {
      const formData = new FormData()
      formData.append("image", tempBlog.image)
      formData.append("title", tempBlog.title)
      formData.append("content", tempBlog.content)
      formData.append("privacy", tempBlog.privacy === "public" ? true : false)
      await axios
        .put(
          `${process.env.REACT_APP_DATABASEURL}/blogs/update/${blog.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then(response => {
          onSaveFinished()
        })
    } catch (error) {
      console.error("Error updating blog", error)
    }
  }

  const handleImageChange = event => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempBlog({ ...tempBlog, image: file })
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async e => {
    e.preventDefault()
    await onSave()
    await onCloseClick()
  }

  return (
    <Modal
      size="md"
      isOpen={show}
      toggle={() => {
        onCloseClick()
        setPreviewImage(null)
      }}
      centered={true}
    >
      <ModalHeader toggle={toggle}>Edit Blog</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSave}>
          <FormGroup style={{ width: "100%" }}>
            <Label for="blogImage">Image</Label>
            <Input
              type="file"
              id="blogImage"
              name="image"
              onChange={handleImageChange}
              accept="image/png, image/jpeg"
              style={{ display: "none" }}
            />
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                height: 200,
                cursor: "pointer",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                onClick={() => document.getElementById("blogImage").click()}
                src={previewImage || blog.image}
                alt="Preview"
                style={{
                  height: 200,
                  width: 300,
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            </div>
          </FormGroup>

          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={tempBlog.title}
              onChange={e =>
                setTempBlog({ ...tempBlog, title: e.target.value })
              }
            />
          </FormGroup>
          <FormGroup>
            <Label for="privacy">Privacy</Label>
            <Input
              type="select"
              id="privacy"
              name="privacy"
              value={tempBlog.privacy ? "public" : "private"}
              onChange={e =>
                setTempBlog({ ...tempBlog, privacy: e.target.value })
              }
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="content">Content</Label>
            <Input
              type="textarea"
              id="content"
              name="content"
              value={tempBlog.content}
              onChange={e =>
                setTempBlog({ ...tempBlog, content: e.target.value })
              }
            />
          </FormGroup>

          <Button type="submit" color="primary">
            Save Changes
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default EditBlogModal
