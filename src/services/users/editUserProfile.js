import axiosInstance from "services/axiosMiddleware";

// Updated function to accept editUserProfile
export async function editUserProfile(userData) {
  // console.log(editUserProfile)
  try {
    const response = await axiosInstance.post('auth/editUserProfile', userData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
