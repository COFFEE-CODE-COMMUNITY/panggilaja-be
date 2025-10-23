import supabase from "../utils/supabaseClient.js";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const uploadUserAsset = async (file, filePath) => {
  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  // Dapatkan URL publik
  const { data: publicUrl } = supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .getPublicUrl(filePath);

  console.log("Mau kelar upload");
  return { path: filePath, url: publicUrl.publicUrl };
};

export default uploadUserAsset;
