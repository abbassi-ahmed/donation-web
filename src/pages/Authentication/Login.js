import PropTypes from "prop-types"
import { React, useState, Fragment } from "react"
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap"
import { Link } from "react-router-dom"
import withRouter from "components/Common/withRouter"
import profile from "assets/images/profile-img.png"
import io from "socket.io-client"
import logo from "assets/images/logo.svg"
import axios from "axios"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
const Login = ({ history }) => {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  document.title = "Login Page"
  const dispatch = useDispatch()

  const handleLogin = async () => {
    let hasError = false
    if (email === "") {
      setEmailError(true)
      hasError = true
    }
    if (password === "") {
      setPasswordError(true)
      hasError = true
    }
    if (hasError) return

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DATABASEURL}/admins/signin`,
        {
          email,
          password,
        }
      )

      if (response.data.message) {
        setError(response.data.message)
      } else {
        localStorage.setItem("authUser", JSON.stringify(response.data.token))
        localStorage.setItem("admin", JSON.stringify(response.data.admin))
        localStorage.setItem(
          "userPermissions",
          JSON.stringify(
            response.data.admin.permissions.flatMap(p => p.name.toLowerCase())
          )
        )
        io("wss://api.olympiquemnihla.com", {
          query: {
            client: JSON.stringify(response.data.admin),
          },
        })
        // dispatch(loginUser(response.data.token, history))
        navigate("/profile")
      }
    } catch (error) {
      if (error.response.status === 404) {
        setError(error.response.data.message)
      }
    }
  }

  return (
    <Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary-subtle">
                  <Row>
                    <Col className="col-7">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p>Sign in to continue to INNOSYS.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/" className="logo-light-element">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={e => {
                        e.preventDefault()
                        handleLogin()
                      }}
                    >
                      {error && <Alert color="danger">{error}</Alert>}

                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={e => {
                            setEmail(e.target.value)
                            setEmailError(false)
                          }}
                          value={email}
                          invalid={emailError}
                        />
                        {emailError && (
                          <FormFeedback>
                            Please enter a valid email address
                          </FormFeedback>
                        )}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <Input
                          name="password"
                          value={password}
                          type="password"
                          placeholder="Enter Password"
                          onChange={e => {
                            setPassword(e.target.value)
                            setPasswordError(false)
                          }}
                          invalid={passwordError}
                        />
                        {passwordError && (
                          <FormFeedback>
                            Please enter a valid password
                          </FormFeedback>
                        )}
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customControlInline"
                        >
                          Remember me
                        </label>
                      </div>

                      <div className="mt-3 d-grid">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                        >
                          Log In
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-muted">
                          <i className="mdi mdi-lock me-1" />
                          Forgot your password?
                        </Link>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  © {new Date().getFullYear()} Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by Innosys
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  )
}

export default withRouter(Login)

Login.propTypes = {
  history: PropTypes.object.isRequired,
}
