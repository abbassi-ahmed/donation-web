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
import imageCompression from "browser-image-compression"
import { toast } from "react-toastify"

const CardUploader = ({
  index,
  cards,
  setCards,
  validation,
  fetchDefaultOnes,
}) => {
  const handleCardChange = async (e, cardIndex) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      }

      try {
        const compressedFile = await imageCompression(file, options)

        const updatedCards = cards.map((card, idx) =>
          idx === cardIndex ? { ...card, bg: compressedFile } : card
        )

        setCards(updatedCards)
        validation.setFieldValue(`cardImage${cardIndex + 1}`, compressedFile)
      } catch (error) {
        console.error("Image compression failed:", error)
      }
    }
  }

  const getImageSrc = bg => {
    return bg instanceof Blob ? URL.createObjectURL(bg) : bg
  }

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
    if (cards.length === 1) {
      toast.error("You can't delete the last card")
      return
    }

    const cardToDelete = cards[cardIndex]
    const updatedCards = cards.filter((_, i) => i !== cardIndex)
    setCards(updatedCards)

    if (cardToDelete.bg && cardToDelete.id) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_DATABASEURL}/slider-section/remove/${cardToDelete.id}`
        )
        toast.success("Card deleted successfully")
        fetchDefaultOnes()
      } catch (error) {
        console.error("Error deleting card:", error)
        toast.error("Error deleting card")
      }
    }
  }

  const handleAddCard = () => {
    setCards([...cards, { id: 0, bg: null, title: "", text: "" }])
  }

  return (
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
              {cards[index].bg ? (
                <SuspenseImage
                  src={getImageSrc(cards[index].bg)}
                  alt="Project Logo"
                  className="img-fluid avatar-md"
                  style={{
                    width: "650px",
                    minHeight: "350px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ) : (
                <div
                  className="img-fluid avatar-md"
                  style={{
                    width: "650px",
                    minHeight: "350px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: "#f0f0f0",
                  }}
                />
              )}
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
  )
}

export default CardUploader
