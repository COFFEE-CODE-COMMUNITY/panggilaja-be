import pgClient from "../db/postgre/pgClient.js";
import userRepository from "../repositories/userRepository.js";

const getById = async (id) => {
  const client = await pgClient.getClient();
  try {
    console.warn(`User Detail : user`);
    const user = await userRepository.getUserById(id, client);
    return {
      fullname: user.fullname,
      email: user.email,
      schoolName: user.school_name || "",
      gradeLevel: user.grade_level || 0,
      profileImage: user.profile_image || "www.profile.image",
    };
  } finally {
    client.release();
  }
};

export default {
  getById,
};
