import React from "react"
import { Input, Label, UncontrolledTooltip } from "reactstrap"
import SuspenseImage from "../../components/SuspenseImage/ImageComponent"

const CardUploader = ({ index, brands, setBrands, validation }) => {
  const handleCardChange = (e, cardIndex) => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      const newBrands = [...brands]

      newBrands[cardIndex] = { ...newBrands[cardIndex], image: file }
      setBrands(newBrands)
      validation.setFieldValue(`cardImage${cardIndex + 1}`, file)
    }
  }

  const getImageSrc = image => {
    if (image instanceof Blob) {
      return URL.createObjectURL(image)
    }
    return image
  }

  const card = brands[index] || {}
  const iconSrc = card.image ? getImageSrc(card.image) : null

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
            {iconSrc ? (
              <SuspenseImage
                src={iconSrc}
                id={`card${index + 1}-img`}
                alt="Project Logo"
                className="avatar-md rounded-circle overflow-hidden"
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
    </div>
  )
}

export default CardUploader
