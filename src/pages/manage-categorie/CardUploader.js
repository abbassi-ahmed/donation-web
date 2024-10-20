import React, { useEffect } from "react"
import { Input, Label, UncontrolledTooltip } from "reactstrap"
import SuspenseImage from "../../components/SuspenseImage/ImageComponent"

const CardUploader = ({ index, cards, setCards, validation }) => {
  const handleCardChange = e => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      const newCards = [...cards]
      newCards[index] = { ...newCards[index], icon: file }
      setCards(newCards)
      validation.setFieldValue(`cardImage${index + 1}`, file)
    }
  }

  const getImageSrc = icon => {
    return icon instanceof Blob ? URL.createObjectURL(icon) : icon
  }

  const iconSrc = getImageSrc(cards[index].icon)

  return (
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
          onChange={handleCardChange}
        />
      </div>
      <div className="avatar-lg mt-3">
        <div className="avatar-title bg-light rounded-circle">
          {cards[index].icon && (
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
          )}
        </div>
      </div>
    </div>
  )
}

export default CardUploader
