"use server";
import path, { resolve } from "path";
import fs from "fs/promises";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "cloudinary";
import { setTimeout } from "timers/promises";
import { revalidatePath } from "next/cache";
import Photo from "@/models/photoModel";
import { log } from "console";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
async function savePhotosToLocal(formData) {
  const files = formData.getAll("files");

  const multipleBuffersPromise = files.map((file) =>
    file.arrayBuffer().then((data) => {
      const buffer = Buffer.from(data);
      const name = uuidv4();
      const ext = file.type.split("/")[1];

      //   const uploadDir = path.join(process.cwd(), "public", `/${file.name}`);
      //   fs.writeFile(uploadDir, buffer);
      // Doesn't work in vercel
      const tempDir = os.tmpdir();
      const uploadDir = path.join(tempDir, `${name}.${ext}`);
      // console.log(uploadDir);/
      fs.writeFile(uploadDir, buffer);

      return { filePath: uploadDir, filename: file.name };
    })
  );

  return await Promise.all(multipleBuffersPromise);
}

async function uploadPhotosToCloudinary(newFiles) {
  const multiplePhotosPromise = newFiles.map((file) => {
    return cloudinary.v2.uploader.upload(file.filePath, {
      folder: "nextjs_upload",
    });
  });

  return await Promise.all(multiplePhotosPromise);
}

const delay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};
export default async function uploadPhoto(formData) {
  try {
    // Save photo to temp folder
    const newFiles = await savePhotosToLocal(formData);
    //upload to the cloudinary after saving the photos and files to the temp folder
    const photos = await uploadPhotosToCloudinary(newFiles);
    // Delete photos and files after successfully uploaded to cloudinary
    // newFiles.map((file) => fs.unlink(file.filePath)); NOT WORKING

    // revalidatePath("/");
    // await delay(2000);
    // console.log(photos);
    // Save Photo files to mongodb => no delay needed

    const newPhotos = photos.map((photo) => {
      const newPhoto = new Photo({
        public_id: photo.public_id,
        secure_url: photo.secure_url,
      });
      return newPhoto;
    });
    // console.log(newPhotos);
    await Photo.insertMany(newPhotos);

    return { msg: "upload success" };
  } catch (error) {
    return { errMsg: error.message };
  }
}

export async function getAllPhotos() {
  try {
    const { resources } = await cloudinary.v2.search
      .expression("folder:nextjs_upload/*")
      .sort_by("created_at", "desc")
      .max_results(500)
      .execute();

    // console.log(resources);
    // console.log(resources);
    return resources;
  } catch (error) {
    return { errMsg: error.message };
  }
}
export async function deletePhoto(public_id) {
  try {
    await cloudinary.v2.uploader.destroy(public_id);
    revalidatePath("/");
    return { msg: "successfully deleted" };
  } catch (error) {
    return { errMsg: error.message };
  }
}

export async function revalidate(path) {
  revalidatePath(path);
}
