import supabase from "../config/supabaseClient.js";

export const uploadFile = async (file, folder = "img") => {
  if (!file) throw new Error("No file provided");

  const filename = `${Date.now()}_${file.originalname}`;
  const filePath = `${folder}/${filename}`;

  const { data, error } = await supabase.storage
    .from("panggilaja-assets")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false, // kalau false, tidak menimpa file lama
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from("panggilaja-assets")
    .getPublicUrl(filePath);

  return {
    filename,
    folder,
    url: publicUrlData.publicUrl,
  };
};
