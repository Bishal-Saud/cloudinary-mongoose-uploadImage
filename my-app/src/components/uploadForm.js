"use client";

import { useRef, useState } from "react";
import PhotoCard from "./PhotoCard";
import ButtonSubmit from "./ButtonSubmit";
import uploadPhoto, { revalidate } from "@/Actions/uploadAction";

export default function UploadForm() {
  const formRef = useRef();
  const [file, setFile] = useState([]);

  async function handleImageChange(e) {
    const files = e.target.files;

    const newFiles = [...files].filter((file) => {
      if (file.size < 1024 * 1024 && file.type.startsWith("image/")) {
        return file;
      }
    });
    setFile((prev) => [...newFiles, ...prev]);
    formRef.current.reset();
  }

  async function handleDeleteFile(index) {
    const newFiles = file.filter((_, i) => i !== index);
    setFile(newFiles);
  }

  async function handleUpload() {
    if (!file.length) return alert("No image files are selected");
    if (file.length > 3) return alert("upload up to 3 image files");
    const formData = new FormData();

    file.forEach((file) => {
      formData.append("files", file);
    });
    const res = await uploadPhoto(formData);
    if (res?.msg) alert(`Success:${res?.msg}`);

    if (res?.errMsg) alert(`Error:${res?.errMsg}`);
    setFile([]);
    formRef.current.reset();
    revalidate("/");
  }
  return (
    <form action={handleUpload} ref={formRef}>
      <div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <p>Only accept image files less then 1mb in size</p>
        {/* Preview image  */}
        <div>
          {file.map((file, index) => (
            <PhotoCard
              key={index}
              url={URL.createObjectURL(file)}
              onClick={() => handleDeleteFile(index)}
            />
          ))}
        </div>
      </div>
      <ButtonSubmit value="upload to cloudinary" />
    </form>
  );
}
