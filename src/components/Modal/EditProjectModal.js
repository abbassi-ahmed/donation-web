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
import FlatPickr from "react-flatpickr"
import moment from "moment"

const EditProjectModal = ({
  show,
  toggle,
  project,
  onCloseClick,
  onSaveFinished,
}) => {
  const [tempProject, setTempProject] = useState(project)
  const [previewImage, setPreviewImage] = useState(project.image)

  useEffect(() => {
    if (show) {
      setTempProject(project)
      setPreviewImage(project.image)
    }
  }, [show, project])

  const onSave = async () => {
    try {
      const formData = new FormData()
      formData.append("image", tempProject.image)
      formData.append("name", tempProject.name)
      formData.append("description", tempProject.description)
      formData.append("target", tempProject.target)
      formData.append("startDate", tempProject.startDate)
      formData.append("targetDate", tempProject.targetDate)
      formData.append("type", tempProject.type)

      await axios
        .put(
          `${process.env.REACT_APP_DATABASEURL}/projects/update/${project.id}`,
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
      console.error("Error updating project", error)
    }
  }

  const handleImageChange = event => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempProject({ ...tempProject, image: file })
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
      <ModalHeader toggle={toggle}>Edit Project</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSave}>
          <FormGroup style={{ width: "100%" }}>
            <Label for="projectImage">Image</Label>
            <Input
              type="file"
              id="projectImage"
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
                onClick={() => document.getElementById("projectImage").click()}
                src={previewImage || project.image}
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
            <Label for="name">Project Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={tempProject.name}
              onChange={e =>
                setTempProject({ ...tempProject, name: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              id="description"
              name="description"
              value={tempProject.description}
              onChange={e =>
                setTempProject({ ...tempProject, description: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label for="target">Target</Label>
            <Input
              type="text"
              id="target"
              name="target"
              value={tempProject.target}
              onChange={e =>
                setTempProject({ ...tempProject, target: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label for="startDate">Start Date</Label>

            <FlatPickr
              className="form-control d-block"
              id="startDate"
              name="startDate"
              placeholder="Select date"
              options={{
                mode: "single",
                dateFormat: "d M, Y",
              }}
              value={[new Date(tempProject.startDate)]}
              onChange={customerdate =>
                setTempProject({
                  ...tempProject,
                  startDate: moment(customerdate[0]).format("YYYY-MM-DD"),
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label for="targetDate">Target Date</Label>

            <FlatPickr
              className="form-control d-block"
              id="targetDate"
              name="targetDate"
              placeholder="Select date"
              options={{
                mode: "single",
                dateFormat: "d M, Y",
              }}
              value={[new Date(tempProject.targetDate)]}
              onChange={customerdate =>
                setTempProject({
                  ...tempProject,
                  targetDate: moment(customerdate[0]).format("YYYY-MM-DD"),
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label for="type">Project Type</Label>
            <Input
              type="select"
              id="type"
              name="type"
              value={tempProject.type}
              onChange={e =>
                setTempProject({ ...tempProject, type: e.target.value })
              }
            >
              <option value="social">Social</option>
              <option value="idee de projet">Idea de Projet</option>
              <option value="Economie sociale et solidaire">
                Economie Sociale et Solidaire
              </option>
            </Input>
          </FormGroup>

          <Button type="submit" color="primary">
            Save Changes
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default EditProjectModal
