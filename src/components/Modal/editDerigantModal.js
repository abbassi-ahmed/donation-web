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
import "flatpickr/dist/themes/material_blue.css"
import imageCompression from "browser-image-compression"

const EditDerigantModal = ({
  show,
  toggle,
  derigant,
  onCloseClick,
  onSaveFinished,
}) => {
  console.log("derigant", derigant)
  const [tempDerigant, setTempDerigant] = useState(derigant || {})
  const [previewAvatar, setPreviewAvatar] = useState(derigant?.avatar || "")

  useEffect(() => {
    if (show && derigant) {
      setTempDerigant(derigant)
      setPreviewAvatar(derigant.avatar)
    }
  }, [show, derigant])

  const onSave = async () => {
    try {
      const formData = new FormData()
      formData.append("avatar", tempDerigant.avatar)
      formData.append("firstName", tempDerigant.firstName)
      formData.append("lastName", tempDerigant.lastName)
      formData.append("email", tempDerigant.email)
      formData.append("twitter", tempDerigant.twitter)
      formData.append("facebook", tempDerigant.facebook)
      formData.append("instagram", tempDerigant.instagram)

      await axios.put(
        `${process.env.REACT_APP_DATABASEURL}/derigant/update/${derigant.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      onSaveFinished()
    } catch (error) {
      console.error("Error updating derigant", error)
    }
  }

  const handleAvatarChange = event => {
    const file = event.target.files[0]
    if (file) {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      }

      imageCompression(file, options)
        .then(compressedFile => {
          const reader = new FileReader()
          reader.onloadend = () => {
            setTempDerigant({ ...tempDerigant, avatar: compressedFile })
            setPreviewAvatar(reader.result)
          }

          reader.readAsDataURL(compressedFile)
        })
        .catch(error => {
          console.error("Error compressing image:", error)
        })
    }
  }

  const handleSave = async e => {
    e.preventDefault()
    await onSave()
    onCloseClick()
  }

  return (
    <Modal
      size="md"
      isOpen={show}
      toggle={() => {
        onCloseClick()
        setPreviewAvatar(null)
      }}
      centered={true}
    >
      <ModalHeader toggle={toggle}>Edit Derigant</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSave}>
          <FormGroup style={{ width: "100%" }}>
            <Label for="derigantAvatar">Avatar</Label>
            <Input
              type="file"
              id="derigantAvatar"
              name="avatar"
              onChange={handleAvatarChange}
              accept="avatar/png, avatar/jpeg"
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
                onClick={() =>
                  document.getElementById("derigantAvatar").click()
                }
                src={previewAvatar || derigant.avatar}
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
            <Label for="name">Derigant First Name</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={tempDerigant.firstName}
              onChange={e =>
                setTempDerigant({ ...tempDerigant, firstName: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label for="name">Derigant Last Name</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={tempDerigant.lastName}
              onChange={e =>
                setTempDerigant({ ...tempDerigant, lastName: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={tempDerigant.email}
              onChange={e =>
                setTempDerigant({ ...tempDerigant, email: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label for="twitter">Twitter</Label>
            <Input
              type="text"
              id="twitter"
              name="twitter"
              value={tempDerigant.twitter}
              onChange={e =>
                setTempDerigant({ ...tempDerigant, twitter: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label for="facebook">Facebook</Label>
            <Input
              type="text"
              id="facebook"
              name="facebook"
              value={tempDerigant.facebook}
              onChange={e =>
                setTempDerigant({ ...tempDerigant, facebook: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label for="instagram">Instagram</Label>
            <Input
              type="text"
              id="instagram"
              name="instagram"
              value={tempDerigant.instagram}
              onChange={e =>
                setTempDerigant({ ...tempDerigant, instagram: e.target.value })
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

export default EditDerigantModal
