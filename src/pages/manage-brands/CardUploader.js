import React from "react"
import { Input, Label } from "reactstrap"
import imageCompression from "browser-image-compression"

const CardUploader = ({ index, partners, setPartners, validation }) => {
  const handleFileChange = async e => {
    if (e.target.files.length) {
      const file = e.target.files[0]

      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      }

      try {
        const compressedFile = await imageCompression(file, options)

        const updatedBrands = [...partners]
        updatedBrands[index] = {
          ...updatedBrands[index],
          image: compressedFile,
        }
        setPartners(updatedBrands)

        validation.setFieldValue(`cardImage${index + 1}`, compressedFile)
      } catch (error) {
        console.error("Error compressing image:", error)
      }
    }
  }

  const handleTileChange = e => {
    const updatedBrands = [...partners]
    updatedBrands[index] = { ...updatedBrands[index], title: e.target.value }
    setPartners(updatedBrands)
  }

  const handleLinkChange = e => {
    const updatedBrands = [...partners]
    updatedBrands[index] = { ...updatedBrands[index], link: e.target.value }
    setPartners(updatedBrands)
  }

  const getImageSrc = image =>
    image instanceof Blob ? URL.createObjectURL(image) : image

  const currentBrand = partners[index]
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
