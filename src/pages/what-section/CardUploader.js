import React, { useMemo, useEffect, useState } from "react"
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
  const getImageSrc = image => {
    if (image instanceof Blob) {
      return URL.createObjectURL(image)
    }
    return image
  }

  const iconSrc = getImageSrc(cards[index].image)

  const handleCardChange = (e, cardIndex) => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      const newCards = [...cards]
      newCards[cardIndex] = { ...newCards[cardIndex], image: file }
      setCards(newCards)
      validation.setFieldValue(`cardImage${cardIndex + 1}`, file)
    }
  }

  const handleTextChange = (e, cardIndex) => {
    const newCards = [...cards]
    newCards[cardIndex] = { ...newCards[cardIndex], text: e.target.value }
    setCards(newCards)
  }

  const handleTitleChange = (e, cardIndex) => {
    const newCards = [...cards]
    newCards[cardIndex] = { ...newCards[cardIndex], name: e.target.value }
    setCards(newCards)
  }

  const handleDeleteCard = async cardIndex => {
    if (length === 1) {
      toast.error("You can't delete the last card")
      return
    }

    const newCards = cards.filter((_, i) => i !== cardIndex)
    setCards(newCards)
    if (cards[cardIndex].image) {
      await axios
        .delete(
          process.env.REACT_APP_DATABASEURL +
            `/slider-section/remove/${cards[cardIndex].id}`
        )
        .then(() => {
          fetchDefaultOnes()
          toast.success("🎉 Why Choose Section Updated Successfully")
        })
    }
  }

  const handleAddCard = () => {
    const newCards = [...cards, { image: "", name: "", text: "" }]
    setCards(newCards)
  }

  return (
    <div>
      <Container>
        <Row>
          <Col
            md={6}
            className="mb-3 justify-content-center align-items-center d-flex flex-column gap-2"
          >
            <div className="mb-3 w-100">
              <Label htmlFor={`card${index + 1}-count-input`}>Name</Label>
              <Input
                id={`cardTitle${index + 1}`}
                name={`cardTitle${index + 1}`}
                type="text"
                placeholder={`Enter Name ${index + 1}...`}
                onChange={e => handleTitleChange(e, index)}
                value={cards[index].name}
              />
            </div>
            <div className="mb-3 w-100">
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
          <Col md={6}>
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
                  {cards[index].image ? (
                    <div
                      style={{
                        width: "400px",
                        minHeight: "400px",
                      }}
                    >
                      <SuspenseImage
                        src={iconSrc}
                        id={`card${index + 1}-img`}
                        alt="Project Logo"
                        className="img-fluid avatar-md overflow-hidden"
                        style={{
                          maxWidth: "100%",
                          width: "400px",
                          minHeight: "400px",
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
                        width: "400px",
                        minHeight: "400px",
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
            <Button color="danger" onClick={() => handleDeleteCard(index)}>
              Delete Testimony
            </Button>
          </Col>
          <Col md={6} className="text-end">
            {index === cards.length - 1 && (
              <Button color="primary" onClick={handleAddCard}>
                Add Testimony
              </Button>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default CardUploader
