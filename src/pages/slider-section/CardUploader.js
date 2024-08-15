import React from "react"
import {
  Col,
  Container,
  Input,
  Label,
  Row,
  UncontrolledTooltip,
  Button,
} from "reactstrap"
import SuspenseImage from "../../components/SuspenseImage/ImageComponent"
import axios from "axios"
import { toast } from "react-toastify"

const CardUploader = ({
  index,
  cards,
  setCards,
  validation,
  length,
  fetchDefaultOnes,
}) => {
  const handleCardChange = (e, cardIndex) => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      const newCards = [...cards]
      newCards[cardIndex] = { ...newCards[cardIndex], bg: file }
      setCards(newCards)
      validation.setFieldValue(`cardImage${cardIndex + 1}`, file)
    }
  }

  const getImageSrc = bg => {
    if (bg instanceof Blob) {
      return URL.createObjectURL(bg)
    }
    return bg
  }

  const iconSrc = getImageSrc(cards[index].bg)

  const handleTextChange = (e, cardIndex) => {
    const newCards = [...cards]
    newCards[cardIndex] = { ...newCards[cardIndex], text: e.target.value }
    setCards(newCards)
  }

  const handleTitleChange = (e, cardIndex) => {
    const newCards = [...cards]
    newCards[cardIndex] = { ...newCards[cardIndex], title: e.target.value }
    setCards(newCards)
  }

  const handleDeleteCard = async cardIndex => {
    if (length === 1) {
      toast.error("You can't delete the last card")
      return
    }

    const newCards = cards.filter((_, i) => i !== cardIndex)
    setCards(newCards)
    if (cards[cardIndex].bg) {
      console.log("cardIndex", cardIndex, cards[cardIndex])
      await axios
        .delete(
          process.env.REACT_APP_DATABASEURL +
            `/slider-section/remove/${cards[cardIndex].id}`
        )
        .then(res => {
          fetchDefaultOnes()
          toast.success("🎉 Why Choose Section Updated Successfully")
        })
    }
  }

  const handleAddCard = () => {
    const newCards = [...cards, { bg: "", title: "", text: "" }]
    setCards(newCards)
  }

  return (
    <div>
      <Container>
        <Row>
          <Col md={12}>
            <div className="position-relative d-inline-block">
              <div className="position-absolute bottom-0 end-0">
                <Label
                  htmlFor={`card${index + 1}-image-input`}
                  className="mb-0"
                  id={`card${index + 1}ImageInput`}
                >
                  <div className="avatar-xs">
                    <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">
                      <i className="bx bxs-image-alt"></i>
                    </div>
                  </div>
                </Label>
                <UncontrolledTooltip
                  placement="right"
                  target={`card${index + 1}ImageInput`}
                >
                  Select Image
                </UncontrolledTooltip>
                <input
                  className="form-control d-none"
                  id={`card${index + 1}-image-input`}
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={e => handleCardChange(e, index)}
                />
              </div>
              <div className="mt-3">
                <div className="avatar-title bg-light">
                  {cards[index].bg ? (
                    <div
                      style={{
                        width: "650px",
                        minHeight: "350px",
                      }}
                    >
                      <SuspenseImage
                        src={iconSrc}
                        id={`card${index + 1}-img`}
                        alt="Project Logo"
                        className="img-fluid avatar-md overflow-hidden"
                        style={{
                          maxWidth: "100%",
                          width: "650px",
                          minHeight: "350px",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="img-fluid avatar-md overflow-hidden"
                      style={{
                        maxWidth: "100%",
                        width: "650px",
                        minHeight: "350px",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={6}>
            <div className="mb-3">
              <Label htmlFor={`card${index + 1}-count-input`}>Title</Label>
              <Input
                id={`cardTitle${index + 1}`}
                name={`cardTitle${index + 1}`}
                type="text"
                placeholder={`Enter Title ${index + 1}...`}
                onChange={e => handleTitleChange(e, index)}
                value={cards[index].title}
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-3">
              <Label htmlFor={`card${index + 1}-title-input`}>Text</Label>
              <Input
                id={`cardText${index + 1}`}
                name={`cardText${index + 1}`}
                type="text"
                placeholder={`Enter Text ${index + 1}...`}
                onChange={e => handleTextChange(e, index)}
                value={cards[index].text}
              />
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={6}>
            <Button color="danger" onClick={() => handleDeleteCard(index)}>
              Delete Card
            </Button>
          </Col>
          <Col md={6} className="text-end">
            {index === cards.length - 1 && (
              <Button color="primary" onClick={handleAddCard}>
                Add Card
              </Button>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default CardUploader
