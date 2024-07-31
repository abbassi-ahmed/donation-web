import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  Button,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  UncontrolledTooltip,
  Card,
  CardBody,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledAlert,
  UncontrolledDropdown,
} from "reactstrap"
import { useDropzone } from "react-dropzone"

import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"

import DropZone from "../../components/dropzone/dropzone"
const FileList = ({ folders, fetchFolders }) => {
  const [modalCategory, setModalCategory] = useState(false)
  const [isFileModal, setIsFileModal] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [TheFile, setTheFile] = useState(null)

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
      // save new event
      createNewFolder(newFolderObj)
      folderValidation.resetForm()
      togglee()
    },
  })

  const createNewFile = async newFile => {
    try {
      await axios
        .post(`${process.env.REACT_APP_DATABASEURL}/files/create`, newFile)
        .then(res => {
          fetchFolders()
        })
    } catch (error) {
      console.error("Error adding new event:", error)
    }
  }
  const togglee = () => {
    if (modalCategory) {
      setModalCategory(false)
      setIsFileModal(false)
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
        })
    } catch (error) {
      console.error("Error deleting folder:", error)
    }
  }

  const handleDrop = acceptedFiles => {
    setTheFile(acceptedFiles[0])
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
                  <DropdownToggle className="btn btn-light w-100" type="button">
                    <i className="mdi mdi-plus me-1"></i> Create New
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={togglee}>
                      <i className="bx bx-folder me-1"></i> Folder
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        togglee()
                        setIsFileModal(true)
                      }}
                    >
                      <i className="bx bx-file me-1"></i> File
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
              {/* <div className="search-box mb-2 me-2">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control bg-light border-light rounded"
                    placeholder="Search..."
                  />
                  <i className="bx bx-search-alt search-icon"></i>
                </div>
              </div> */}
              {/* 
              <UncontrolledDropdown className="mb-0">
                <DropdownToggle
                  className="btn btn-link text-muted mt-n2"
                  tag="a"
                >
                  <i className="mdi mdi-dots-vertical font-size-20"></i>
                </DropdownToggle>

                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem href="#">Share Files</DropdownItem>
                  <DropdownItem href="#">Share with me</DropdownItem>
                  <DropdownItem href="#">Other Actions</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown> */}
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
                            <DropdownItem href="#">Open</DropdownItem>
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
          <ModalHeader toggle={togglee}>
            {isFileModal ? "Upload New File" : "Create New Folder"}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={createNewFile}>
              {isFileModal ? (
                <Row>
                  <Col md={12}>
                    <div className="mb-3">
                      <DropZone onDrop={handleDrop} />
                    </div>
                  </Col>
                </Row>
              ) : (
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
                      <FormFeedback>
                        {folderValidation.errors.title}
                      </FormFeedback>
                    </div>
                  </Col>
                </Row>
              )}
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
