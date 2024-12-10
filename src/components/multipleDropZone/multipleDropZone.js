import React from "react"
import { useDropzone } from "react-dropzone"

const MultipleDropZone = ({ onDrop, fileNames }) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept:
        "image/*, application/pdf, .doc, .docx, .txt, .xls, .xlsx, .ppt, .pptx, .zip, .rar",
      multiple: true,
    })

  const backgroundColor =
    isDragActive || fileNames.length ? "#e0ffe0" : "#f9f9f9"

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #cccccc",
        borderRadius: "5px",
        height: "150px",
        padding: "20px",
        textAlign: "center",
        backgroundColor: backgroundColor,
        color: isDragReject ? "#ff0000" : "#000000",
        overflowY: "auto",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : fileNames.length > 0 ? (
        <ul style={{ fontSize: "14px", marginTop: "20px", padding: "0" }}>
          {fileNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: "16px", marginTop: "20px" }}>
          Drag 'n' drop some files here, or click to select files
        </p>
      )}
    </div>
  )
}

export default MultipleDropZone
