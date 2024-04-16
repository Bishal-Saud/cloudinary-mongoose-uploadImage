import { getAllPhotos } from "@/Actions/uploadAction";
import PhotoList from "@/components/PhotoList";
import UploadForm from "@/components/uploadForm";

export default async function Home() {
  const photos = await getAllPhotos();

  return (
    <main>
      <h2>Image upload in server and mongoose</h2>
      <UploadForm />
      <h1>All photos</h1>
      <PhotoList photos={photos || {}} />
    </main>
  );
}
