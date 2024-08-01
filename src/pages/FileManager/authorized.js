import React, { useState, useEffect } from "react"
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
import Multiselect from "multiselect-react-dropdown"

import "./styles.css"

const Authorized = ({ authorizedAdmins, folderId, fetchFiles }) => {
  const [modalCategory, setModalCategory] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [admins, setAdmins] = useState([])
  const [selectedValue, setSelectedValue] = useState([])

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/admins/find-all`
      )
      const allAdmins = response.data
      const filteredAdmins = allAdmins.filter(
        admin => !authorizedAdmins.some(authAdmin => authAdmin.id === admin.id)
      )
      setAdmins(filteredAdmins)
    } catch (error) {
      console.error("Error fetching admins:", error)
    }
  }

  const addAdmins = async e => {
    e.preventDefault()
    if (selectedValue.length === 0) {
      console.error("No admin selected.")
      return
    }
    try {
      await axios
        .post(
          `${process.env.REACT_APP_DATABASEURL}/folders/add-admins/${folderId}`,
          { admins: selectedValue.map(admin => admin.id) }
        )
        .then(res => {
          fetchFiles()
          setModalCategory(false)
          setSelectedValue([])
        })
    } catch (error) {
      console.error("Error adding admin:", error)
    }
  }

  const removeAdmin = async id => {
    try {
      await axios
        .delete(
          `${process.env.REACT_APP_DATABASEURL}/folders/remove-auth/${folderId}/${id}`
        )
        .then(res => {
          fetchFiles()
        })
    } catch (error) {
      console.error("Error deleting admin:", error)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const onSelect = (selectedList, selectedItem) => {
    setSelectedValue(selectedList)
  }
  const onRemove = (selectedList, removedItem) => {
    setSelectedValue(selectedList)
  }

  const togglee = () => {
    if (modalCategory) {
      setModalCategory(false)
    } else {
      setModalCategory(true)
      fetchAdmins()
    }
  }
  const toggle = () => setIsOpen(!isOpen)

  return (
    <React.Fragment>
      <div>
        <Row className="mb-3">
          <Col xl={3} sm={6}>
            <div className="mt-2">
              <h5>Authorized Admins</h5>
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
                    <i className="mdi mdi-plus me-1"></i> Add New Admin
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
                <th scope="col">Admin Name</th>
                <th scope="col">Email</th>
                <th scope="col">Created At</th>
                <th scope="col" colSpan="2"></th>
              </tr>
            </thead>
            <tbody>
              {authorizedAdmins.length > 0 &&
                authorizedAdmins?.map((item, key) => (
                  <tr key={key}>
                    <td>
                      <img
                        src={item.avatar}
                        alt="profile image"
                        style={{ height: "30px" }}
                        className="rounded-circle me-2"
                      />
                      {item.firstName + " " + item.lastName}
                    </td>
                    <td>{item.email} </td>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
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
                          <DropdownItem onClick={() => removeAdmin(item.id)}>
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
          <ModalHeader toggle={togglee}>Add New Admin</ModalHeader>
          <ModalBody>
            <Form
              onSubmit={e => {
                e.preventDefault()
                addAdmins(e)
              }}
            >
              <Row>
                <Col md={12}>
                  <div className="mb-3">
                    <Multiselect
                      options={admins}
                      selectedValues={selectedValue}
                      onSelect={onSelect}
                      onRemove={onRemove}
                      displayValue="email"
                    />{" "}
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

export default Authorized
