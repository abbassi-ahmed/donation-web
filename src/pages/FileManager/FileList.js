import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  Button,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Card,
  CardBody,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap"

import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const FileList = ({ folders, fetchFolders }) => {
  const [modalCategory, setModalCategory] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const navigate = useNavigate()

  const createNewFolder = async newFolder => {
    try {
      await axios
        .post(`${process.env.REACT_APP_DATABASEURL}/folders/create`, newFolder)
        .then(res => {
          folderValidation.resetForm()
          fetchFolders()
        })
    } catch (error) {
      console.error("Error adding new event:", error)
    }
  }
  const folderValidation = useFormik({
    enableReinitialize: true,

    initialValues: {
      title: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Your Folder Title"),
    }),
    onSubmit: values => {
      const newFolderObj = {
        name: values.title,
      }
      createNewFolder(newFolderObj)
      folderValidation.resetForm()
      togglee()
    },
  })

  const togglee = () => {
    if (modalCategory) {
      setModalCategory(false)
    } else {
      setModalCategory(true)
    }
  }
  const toggle = () => setIsOpen(!isOpen)
  const removeFolder = async id => {
    try {
      await axios
        .delete(`${process.env.REACT_APP_DATABASEURL}/folders/remove/${id}`)
        .then(res => {
          fetchFolders()
          fetchStats()
        })
    } catch (error) {
      console.error("Error deleting folder:", error)
    }
  }

  return (
    <React.Fragment>
      <div>
        <Row className="mb-3">
          <Col xl={3} sm={6}>
            <div className="mt-2">
              <h5>My Folders</h5>
            </div>
          </Col>
          <Col xl={9} sm={6}>
            <Form className="mt-4 mt-sm-0 float-sm-end d-flex align-items-center">
              <div className="mb-3">
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="btn btn-light w-100"
                    type="button"
                    onClick={togglee}
                  >
                    <i className="mdi mdi-plus me-1"></i> Create New Folder
                  </DropdownToggle>
                </UncontrolledDropdown>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
      <div>
        <Row>
          {folders.length > 0 &&
            folders?.map((myFolders, key) => (
              <Col xl={4} sm={6} key={key}>
                <Card className="shadow-none border">
                  <CardBody className="p-3">
                    <div>
                      <div className="float-end ms-2">
                        <UncontrolledDropdown className="mb-2">
                          <DropdownToggle
                            className="font-size-16 text-muted"
                            tag="a"
                          >
                            <i className="mdi mdi-dots-horizontal"></i>
                          </DropdownToggle>

                          <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem
                              onClick={() =>
                                navigate(`/folder-details/${myFolders.id}`)
                              }
                            >
                              Open
                            </DropdownItem>
                            {/* <DropdownItem href="#">Edit</DropdownItem> */}
                            {/* <DropdownItem href="#">Rename</DropdownItem> */}
                            <div className="dropdown-divider"></div>
                            <DropdownItem
                              onClick={() => removeFolder(myFolders.id)}
                            >
                              Remove
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                      <div className="avatar-xs me-3 mb-3">
                        <div className="avatar-title bg-transparent rounded">
                          <i className="bx bxs-folder font-size-24 text-warning"></i>
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="overflow-hidden me-auto">
                          <h5 className="font-size-14 text-truncate mb-1">
                            <Link to="#" className="text-body">
                              {myFolders.name}
                            </Link>
                          </h5>
                          <p className="text-muted text-truncate mb-0">
                            {myFolders.file} Files
                          </p>
                        </div>
                        <div className="align-self-end ms-2">
                          <p className="text-muted mb-0">{myFolders.size}</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
        </Row>
      </div>
      <Modal
        isOpen={modalCategory}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="exampleModal"
        tabIndex="-1"
        toggle={toggle}
      >
        <div className="modal-content">
          <ModalHeader toggle={togglee}>Create New Folder</ModalHeader>
          <ModalBody>
            <Form onSubmit={folderValidation.handleSubmit}>
              <Row>
                <Col md={12}>
                  <div className="mb-3">
                    <Label htmlFor="validationCustom01">Folder Title</Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="validationCustom01"
                      name="title"
                      value={folderValidation.values.title}
                      onChange={folderValidation.handleChange}
                      invalid={!!folderValidation.errors.title}
                    />
                    <FormFeedback>{folderValidation.errors.title}</FormFeedback>
                  </div>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col xs={8} className="text-end">
                  <Button
                    color="light"
                    type="button"
                    className="me-1"
                    onClick={togglee}
                  >
                    Close
                  </Button>
                  <Button type="submit" color="success" id="btn-save-event">
                    Save
                  </Button>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default FileList
