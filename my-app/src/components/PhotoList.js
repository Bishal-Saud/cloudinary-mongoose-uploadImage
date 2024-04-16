"use client";

import { deletePhoto } from "@/Actions/uploadAction";
import PhotoCard from "./PhotoCard";

function PhotoList({ photos }) {
  async function handlePhotoDelete(public_id) {
    await deletePhoto(public_id);
  }
  return (
    <div>
      {photos.map((photo) => (
        <PhotoCard
          key={photo?.public_id}
          url={photo?.secure_url}
          onClick={() => handlePhotoDelete(photo?.public_id)}
        />
      ))}
    </div>
  );
}

export default PhotoList;
