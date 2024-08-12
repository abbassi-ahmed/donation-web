import React, { useState, useEffect } from "react"
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
import Multiselect from "multiselect-react-dropdown"

import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

import Switch from "@mui/material/Switch"

const ChildFileList = () => {
  const { id } = useParams()
  const [modalCategory, setModalCategory] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [folderPrivacy, setFolderPrivacy] = useState(false)
  const [admins, setAdmins] = useState([])
  const navigate = useNavigate()
  const [folders, setFolders] = useState([])
  const [editModal, setEditModal] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [user, setUser] = useState({})
  const [isUserSet, setIsUserSet] = useState(false)
  const fetchFolders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3636
/folders/find-childs-by-admin/${id}/${user.id}`
      )
      const foldersWithDocumentCount = response.data.map(folder => ({
        ...folder,
        documentCount: folder.documents.length,
      }))
      setFolders(foldersWithDocumentCount)
    } catch (error) {
      console.log(error)
    }
  }
  const handleUpdateFolder = async e => {
    try {
      e.preventDefault()
      await axios.put(
        `${process.env.REACT_APP_DATABASEURL}/folders/update/${selectedFolder.id}`,
        selectedFolder
      )
      fetchFolders()
      setEditModal(false)
      setSelectedFolder(null)
    } catch (error) {
      console.error("Error updating folder:", error)
    }
  }

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/admins/find-all`
      )
      setAdmins(response.data)
    } catch (error) {
      console.error("Error fetching admins:", error)
    }
  }
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("admin"))
    if (storedUser) {
      setUser(storedUser)
      setIsUserSet(true)
    }
  }, [id])

  useEffect(() => {
    if (isUserSet) {
      fetchFolders()
      fetchAdmins()
    }
  }, [isUserSet, id])
  const [selectedValue, setSelectedValue] = useState([])
  const onSelect = (selectedList, selectedItem) => {
    setSelectedValue(selectedList)
  }
  const onRemove = (selectedList, removedItem) => {
    setSelectedValue(selectedList)
  }

  const createNewFolder = async newFolder => {
    try {
      await axios
        .post(
          `${process.env.REACT_APP_DATABASEURL}/folders/create-child`,
          newFolder
        )
        .then(res => {
          folderValidation.resetForm()
          fetchFolders()
          setFolderPrivacy(false)
          setSelectedValue([])
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
        privacy: folderPrivacy ? "private" : "public",
        admins: selectedValue.map(admin => admin.id),
        createdBy: JSON.parse(localStorage.getItem("admin")).id,
        parentFolderId: id,
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
              <div className="arrow-back d-flex align-items-center">
                <span
                  onClick={() => navigate(-1)}
                  className="text-muted"
                  style={{ cursor: "pointer" }}
                >
                  <i className="bx bx-arrow-back me-2 font-size-18"></i>
                </span>
                <h5>My Folders</h5>
              </div>
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
                            <DropdownItem
                              onClick={() => {
                                setSelectedFolder(myFolders)
                                setEditModal(true)
                              }}
                            >
                              Edit
                            </DropdownItem>
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
                      <Link
                        to={`/folder-details/${myFolders.id}`}
                        className="text-body"
                      >
                        <div className="avatar-xs me-3 mb-3">
                          <div className="avatar-title bg-transparent rounded">
                            <i className="bx bxs-folder font-size-24 text-warning"></i>
                          </div>
                        </div>
                        <div className="d-flex">
                          <div className="overflow-hidden me-auto">
                            <h5 className="font-size-14 text-truncate mb-1">
                              {myFolders.name}
                            </h5>
                            <p className="text-muted text-truncate mb-0">
                              {myFolders.documentCount} Files
                            </p>
                          </div>
                          <div className="align-self-end ms-2">
                            <p className="text-muted mb-0">
                              {myFolders.privacy}
                            </p>
                          </div>
                        </div>
                      </Link>
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
                <Col md={12}>
                  <div className="mb-3">
                    <Label htmlFor="folderPrivacy">Folder Privacy</Label>
                    <Switch
                      checked={folderPrivacy}
                      onClick={() => setFolderPrivacy(!folderPrivacy)}
                      color="primary"
                      name="folderPrivacy"
                      id="folderPrivacy"
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  </div>
                </Col>
              </Row>
              {folderPrivacy && (
                <Row>
                  <Col md={12}>
                    <div className="mb-3">
                      <Label htmlFor="validationCustom02">
                        Authorized Users
                      </Label>
                      <Multiselect
                        options={admins}
                        selectedValues={selectedValue}
                        onSelect={onSelect}
                        onRemove={onRemove}
                        displayValue="email"
                      />
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
      <Modal
        isOpen={editModal}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="exampleModal"
        tabIndex="-1"
        toggle={() => setEditModal(!editModal)}
      >
        <div className="modal-content">
          <ModalHeader toggle={() => setEditModal(!editModal)}>
            Edit Folder
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleUpdateFolder}>
              <Row>
                <Col md={12}>
                  <div className="mb-3">
                    <Label htmlFor="validationCustom01">Folder Title</Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="validationCustom01"
                      name="title"
                      value={selectedFolder?.name || ""}
                      onChange={e =>
                        setSelectedFolder({
                          ...selectedFolder,
                          name: e.target.value,
                        })
                      }
                      invalid={!!folderValidation.errors.title}
                    />
                    <FormFeedback>{folderValidation.errors.title}</FormFeedback>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="mb-3">
                    <Label htmlFor="folderPrivacy">Folder Privacy</Label>
                    <Switch
                      checked={selectedFolder?.privacy === "private"}
                      onClick={() => {
                        setSelectedFolder({
                          ...selectedFolder,
                          privacy:
                            selectedFolder?.privacy === "private"
                              ? "public"
                              : "private",
                        })
                      }}
                      color="primary"
                      name="folderPrivacy"
                      id="folderPrivacy"
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  </div>
                </Col>
              </Row>
              {selectedFolder?.privacy === "private" && (
                <Row>
                  <Col md={12}>
                    <div className="mb-3">
                      <Label htmlFor="validationCustom02">
                        Authorized Users
                      </Label>
                      <Multiselect
                        options={admins}
                        selectedValues={selectedValue}
                        onSelect={onSelect}
                        onRemove={onRemove}
                        displayValue="email"
                      />
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
                    onClick={() => setEditModal(!editModal)}
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

export default ChildFileList
