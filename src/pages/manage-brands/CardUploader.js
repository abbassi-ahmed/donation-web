import React from "react"
import { Input, Label, UncontrolledTooltip } from "reactstrap"
import SuspenseImage from "../../components/SuspenseImage/ImageComponent"

const CardUploader = ({ index, brands, setBrands, validation }) => {
  const handleFileChange = e => {
    if (e.target.files.length) {
      const file = e.target.files[0]
      const updatedBrands = [...brands]
      updatedBrands[index] = { ...updatedBrands[index], image: file }
      setBrands(updatedBrands)
      validation.setFieldValue(`cardImage${index + 1}`, file)
    }
  }

  const getImageSrc = image =>
    image instanceof Blob ? URL.createObjectURL(image) : image

  const currentBrand = brands[index]
  const imageSrc = currentBrand?.image ? getImageSrc(currentBrand.image) : null

  return (
    <div className="position-relative d-inline-block">
      <div className="position-absolute bottom-0 end-0">
        <Label htmlFor={`card${index + 1}-image-input`} className="mb-0">
          <div className="avatar-xs">
            <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">
              <i className="bx bxs-image-alt"></i>
            </div>
          </div>
        </Label>
        <input
          type="file"
          id={`card${index + 1}-image-input`}
          className="form-control d-none"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
        />
      </div>
      <div className="avatar-lg mt-3">
        <div className="avatar-title bg-light rounded-circle">
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Brand Logo"
              className="avatar-md rounded-circle"
              style={{
                width: "100%",
                height: "100%",
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
