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
  const handleTileChange = e => {
    const updatedBrands = [...brands]
    updatedBrands[index] = { ...updatedBrands[index], title: e.target.value }
    setBrands(updatedBrands)
  }

  const handleLinkChange = e => {
    const updatedBrands = [...brands]
    updatedBrands[index] = { ...updatedBrands[index], link: e.target.value }
    setBrands(updatedBrands)
  }

  const getImageSrc = image =>
    image instanceof Blob ? URL.createObjectURL(image) : image

  const currentBrand = brands[index]
  const imageSrc = currentBrand?.image ? getImageSrc(currentBrand.image) : null

  return (
    <div className="mt-3 d-flex align-items-center flex-column">
      <div className="position-relative d-inline-block text-center">
        <div className="position-absolute bottom-0 end-0">
          <Label htmlFor={`card${index + 1}-image-input`} className="mb-0">
            <div className="avatar-xs">
              <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow-sm d-flex align-items-center justify-content-center font-size-16">
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
          <div className="avatar-title bg-light rounded-circle overflow-hidden">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Brand Logo"
                className="rounded-circle w-100 h-100 object-cover"
              />
            ) : (
              <div
                className="text-muted d-flex align-items-center justify-content-center"
                style={{ height: "100%" }}
              >
                No Image
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 d-flex flex-column" style={{ width: "250px" }}>
        <Input
          type="text"
          className="form-control mb-2"
          placeholder="Title"
          value={currentBrand.title}
          onChange={handleTileChange}
        />
        <Input
          type="text"
          className="form-control"
          placeholder="Link"
          value={currentBrand.link}
          onChange={handleLinkChange}
        />
      </div>
    </div>
  )
}

export default CardUploader
