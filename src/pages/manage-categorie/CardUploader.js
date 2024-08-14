import React, { useEffect } from "react"
import { Input, Label, UncontrolledTooltip } from "reactstrap"
import SuspenseImage from "../../components/SuspenseImage/ImageComponent"

const CardUploader = ({ index, cards, setCards, validation }) => {
  const handleCardChange = (e, cardIndex) => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      const newCards = [...cards]

      newCards[cardIndex] = { ...newCards[cardIndex], icon: file }
      setCards(newCards)
      validation.setFieldValue(`cardImage${cardIndex + 1}`, file)
    }
  }
  const getImageSrc = icon => {
    if (icon instanceof Blob) {
      return URL.createObjectURL(icon)
    }
    return icon
  }

  // Usage in your component
  const iconSrc = getImageSrc(cards[index].icon)

  const handleCardTitleChange = (e, cardIndex) => {
    const newCards = [...cards]
    newCards[cardIndex] = { ...newCards[cardIndex], title: e.target.value }
    setCards(newCards)
  }

  return (
    <div>
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
        <div className="avatar-lg mt-3">
          <div className="avatar-title bg-light rounded-circle">
            {cards[index].icon ? (
              <SuspenseImage
                src={iconSrc}
                id={`card${index + 1}-img`}
                alt="Project Logo"
                className="avatar-md rounded-circle overflow-hidden"
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
      <div className="mb-3">
        <Label htmlFor={`card${index + 1}-title-input`}>Title</Label>
        <Input
          id={`cardTitle${index + 1}`}
          name={`cardTitle${index + 1}`}
          type="text"
          placeholder={`Enter Title ${index + 1}...`}
          onChange={e => handleCardTitleChange(e, index)}
          value={cards[index].title}
        />
      </div>
    </div>
  )
}

export default CardUploader
