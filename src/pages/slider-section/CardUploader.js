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
  fetchDefaultOnes,
}) => {
  const handleCardChange = (e, cardIndex) => {
    const file = e.target.files[0]
    if (file) {
      const updatedCards = cards.map((card, idx) =>
        idx === cardIndex ? { ...card, bg: file } : card
      )
      setCards(updatedCards)
      validation.setFieldValue(`cardImage${cardIndex + 1}`, file)
    }
  }

  const getImageSrc = bg => {
    return bg instanceof Blob ? URL.createObjectURL(bg) : bg
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
    setCards([...cards, { id: 0, bg: null }])
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
