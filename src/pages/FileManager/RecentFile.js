import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  Button,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Table,
  UncontrolledDropdown,
} from "reactstrap"
import axios from "axios"
import "./styles.css"
import DropZone from "../../components/dropzone/dropzone"

const RecentFile = ({ files, fetchFiles, fetchStats, folderId }) => {
  const [modalCategory, setModalCategory] = useState(false)
  const [TheFile, setTheFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [isOpen, setIsOpen] = useState(true)

  const removeFile = async id => {
    try {
      await axios
        .delete(`${process.env.REACT_APP_DATABASEURL}/documents/remove/${id}`)
        .then(res => {
          fetchFiles()
          fetchStats()
        })
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }
  const createNewFile = async e => {
    e.preventDefault()

    if (!TheFile) {
      console.error("No file selected.")
      return
    }

    const formData = new FormData()
    formData.append("folderId", folderId)
    formData.append("files", TheFile)

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_DATABASEURL}/documents/create`,
        formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      fetchFiles()
      setTheFile(null)
      setFileName("")
      togglee()
      fetchStats()

      console.log("File uploaded successfully", res.data)
    } catch (error) {
      console.error("Error adding new file:", error)
    }
  }

  const togglee = () => {
    if (modalCategory) {
      setModalCategory(false)
      setTheFile(null)
      setFileName("")
    } else {
      setModalCategory(true)
    }
  }
  const toggle = () => setIsOpen(!isOpen)
  const handleDrop = acceptedFiles => {
    setTheFile(acceptedFiles[0])
    setFileName(acceptedFiles[0].name)
  }
  return (
    <React.Fragment>
      <div>
        <Row className="mb-3">
          <Col xl={3} sm={6}>
            <div className="mt-2">
              <h5>Files List</h5>
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
                    <i className="mdi mdi-plus me-1"></i> Create New File
                  </DropdownToggle>
                </UncontrolledDropdown>
              </div>
            </Form>
          </Col>
        </Row>

        <hr className="mt-2" />

        <div className="table-responsive custom-dropdown-menu">
          <Table className="table align-middle table-nowrap table-hover mb-0">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Created At</th>
                <th scope="col" colSpan="2">
                  Size
                </th>
              </tr>
            </thead>
            <tbody>
              {files.length > 0 &&
                files?.map((item, key) => (
                  <tr key={key}>
                    <td>
                      <Link
                        to={
                          item.mimeTypes === "image"
                            ? item.files
                            : `${process.env.REACT_APP_DATABASEURL}/${item.files}`
                        }
                        target="_blank"
                        className="text-dark fw-medium"
                      >
                        <i
                          className={item.icon ? item.icon : "bx bxs-file"}
                        ></i>
                        {item.name}
                      </Link>
                    </td>
                    <td>{new Date(item.createdAt).toDateString()} </td>
                    <td>{item.size} </td>
                    <td>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          tag="a"
                          className="font-size-16 text-muted"
                          role="button"
                        >
                          <i className="mdi mdi-dots-horizontal"></i>
                        </DropdownToggle>

                        <DropdownMenu className="dropdown-menu-end ">
                          <DropdownItem
                            href={
                              item.mimeTypes === "image"
                                ? item.files
                                : `${process.env.REACT_APP_DATABASEURL}/${item.files}`
                            }
                            target="_blank"
                          >
                            Open
                          </DropdownItem>
                          <div className="dropdown-divider"></div>
                          <DropdownItem onClick={() => removeFile(item.id)}>
                            Remove
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
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
          <ModalHeader toggle={togglee}>Upload New File</ModalHeader>
          <ModalBody>
            <Form
              onSubmit={e => {
                e.preventDefault()
                createNewFile(e)
              }}
            >
              <Row>
                <Col md={12}>
                  <div className="mb-3">
                    <DropZone onDrop={handleDrop} fileName={fileName} />
                    <button onClick={createNewFile} hidden>
                      Upload File
                    </button>
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

export default RecentFile
