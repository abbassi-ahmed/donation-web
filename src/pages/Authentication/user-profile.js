import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap"
import axios from "axios"

import Breadcrumb from "../../components/Common/Breadcrumb"

const UserProfile = ({ history }) => {
  document.title = "Profile Page"
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [firstNameError, setFirstNameError] = useState(false)
  const [lastName, setLastName] = useState("")
  const [lastNameError, setLastNameError] = useState(false)
  const [avatar, setAvatar] = useState("")
  const [user, setUser] = useState({})
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("authUser"))
        if (!token) {
          throw new Error("Token not found")
        }
        const response = await axios.post(
          process.env.REACT_APP_DATABASEURL + "/admin/verify",
          {},
          { headers: { token: `${token}` } }
        )
        const profile = response.data
        setUser(profile)
        setFirstName(profile.firstName || "")
        setLastName(profile.lastName || "")
        setEmail(profile.email || "")
        setAvatar(profile.avatar || avatarPlaceholder)
      } catch (err) {
        console.error("Error fetching profile data", err)
      }
    }

    fetchProfile()
  }, [success])

  const handleSubmit = async () => {
    let hasError = false
    if (firstName.trim() === "") {
      setFirstNameError(true)
      hasError = true
    }
    if (lastName.trim() === "") {
      setLastNameError(true)
      hasError = true
    }
    if (email.trim() === "") {
      setEmailError(true)
      hasError = true
    }
    if (hasError) return

    const formData = new FormData()
    formData.append("firstName", firstName)
    formData.append("lastName", lastName)
    formData.append("email", email)
    if (selectedFile) {
      formData.append("avatar", selectedFile)
    }

    try {
      const response = await axios.put(
        process.env.REACT_APP_DATABASEURL + `/admin/update/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      if (response.data.message) {
        setError(response.data.message)
      } else {
        setSuccess("Profile updated successfully")
        localStorage.setItem("admin", JSON.stringify(response.data))
      }
    } catch (error) {
      console.error("Error updating profile", error)
      setError("Error updating profile")
    }
  }

  const handleFileChange = e => {
    setSelectedFile(e.target.files[0])
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Skote" breadcrumbItem="Profile" />

          <Row>
            <Col lg="12">
              {error && <Alert color="danger">{error}</Alert>}
              {success && <Alert color="success">{success}</Alert>}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{`${user.firstName} ${user.lastName}`}</h5>
                        <p className="mb-1">{email}</p>
                        <p className="mb-0">Id no: #{user.id}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Change User Name</h4>

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={e => {
                  e.preventDefault()
                  handleSubmit()
                  return false
                }}
              >
                <div className="form-group">
                  <Label className="form-label">First Name</Label>
                  <Input
                    name="FirstName"
                    className="form-control"
                    placeholder="Enter User First Name"
                    type="text"
                    onChange={e => {
                      setFirstName(e.target.value)
                      setFirstNameError(false)
                    }}
                    value={firstName}
                    invalid={firstNameError}
                  />
                  {firstNameError && (
                    <FormFeedback type="invalid">
                      First name is required
                    </FormFeedback>
                  )}
                </div>
                <div className="form-group">
                  <Label className="form-label">Last Name</Label>
                  <Input
                    name="LastName"
                    className="form-control"
                    placeholder="Enter User Last Name"
                    type="text"
                    onChange={e => {
                      setLastName(e.target.value)
                      setLastNameError(false)
                    }}
                    value={lastName}
                    invalid={lastNameError}
                  />
                  {lastNameError && (
                    <FormFeedback type="invalid">
                      Last name is required
                    </FormFeedback>
                  )}
                </div>
                <div className="form-group">
                  <Label className="form-label">Email</Label>
                  <Input
                    name="Email"
                    className="form-control"
                    placeholder="Enter your email"
                    type="text"
                    onChange={e => {
                      setEmail(e.target.value)
                      setEmailError(false)
                    }}
                    value={email}
                    invalid={emailError}
                  />
                  {emailError && (
                    <FormFeedback type="invalid">
                      Email is required
                    </FormFeedback>
                  )}
                </div>
                <div className="form-group">
                  <Label className="form-label">Avatar</Label>
                  <Input
                    type="file"
                    name="avatar"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <div className="text-center mt-4">
                  <Button type="submit" color="danger">
                    Update Profile
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default UserProfile
