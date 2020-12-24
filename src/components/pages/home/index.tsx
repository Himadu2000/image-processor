import axios from "axios"
import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import Image from "../../image"

const IndexPage = () => {
  const [image, setImage] = useState<any[]>()
  const onDrop = useCallback(async acceptedFiles => {
    const data = new FormData()
    acceptedFiles.forEach(file => {
      data.append("photos", file)
    })

    const ServerURL = process.env.SERVER || "http://localhost:3000/"
    // Do something with the files
    const response = await axios({
      //   photos: acceptedFiles,
      method: "post",
      url: ServerURL,
      headers: { "Content-Type": "multipart/form-data" },
      data: data,
    })
    setImage(response.data)
    console.log(response.data)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  if (image) {
    return (
      <>
        <ul>
          {image.map((iamged, index) => {
            return <img key={index} src={iamged} height="100" />
          })}
        </ul>
      </>
    )
  } else {
    return (
      <>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <div>
              Drop the files here ...
              <Image />
            </div>
          ) : (
            <div>
              Drag 'n' drop some files here, or click to select files
              <Image />
            </div>
          )}
        </div>
        {JSON.stringify(image)}
      </>
    )
  }
}

export default IndexPage
