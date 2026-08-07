import { supabase } from "../lib/supabase";

/**
 * Uploads a doggo image to storage and creates a database record for it.
 *
 * The uploaded image is stored in Supabase Storage, then its file path is
 * saved in the doggo pictures table awaiting approval.
 *
 * @param file - The dog image file to upload.
 * @returns The storage path of the uploaded image.
 * @throws An error if the upload or database insertion fails.
 */
export const uploadDoggo = async (file: File): Promise<string> => {
  const fileExtension = file.name.split(".").pop();

  const fileName = `${crypto.randomUUID()}.${fileExtension}`;

  const { data, error } = await supabase.storage
    .from("doggo_picture_storage")
    .upload(fileName, file);

  if (error) {
    console.error("Storage upload failed:", error);

    throw new Error("We couldn't upload your doggo's image. Please try again.");
  }

  const { error: databaseError } = await supabase
    .from("doggo_pictures")
    .insert({
      file_path: data.path,
      approved: false,
    });

  if (databaseError) {
    console.error("Database insert failed:", databaseError);

    // Cleans up the uploaded file if the DB insert fails
    await supabase.storage.from("doggo_picture_storage").remove([data.path]);

    throw new Error("Your image couldn't be submitted. Please try again.");
  }

  return data.path;
};
