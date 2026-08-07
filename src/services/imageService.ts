import { supabase } from "../lib/supabase";

/**
 * Retrieves a random doggo image from the doggo pictures collection
 * and returns its publicly accessible storage URL.
 *
 * @returns The public URL of a random doggo image, or null if no images are available.
 */
export const getRandomDoggo = async (): Promise<string | null> => {
  const randomValue = Math.random();

  const { data: initialData, error } = await supabase
    .from("doggo_pictures")
    .select("file_path")
    .gte("random_key", randomValue)
    .order("random_key", { ascending: true })
    .limit(1)
    .maybeSingle();

  let data = initialData;

  if (error) {
    throw error;
  }

  // If no row exists above the random value, wrap around
  if (!data) {
    const { data: fallback, error: fallbackError } = await supabase
      .from("doggo_pictures")
      .select("file_path")
      .order("random_key", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (fallbackError) {
      throw fallbackError;
    }

    data = fallback;
  }

  if (!data) {
    return null;
  }

  const { data: urlData } = supabase.storage
    .from("doggo_picture_storage")
    .getPublicUrl(data.file_path);

  return urlData.publicUrl;
};
