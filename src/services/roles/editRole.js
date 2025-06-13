import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function editRole(roleData) {
  try {
    const response = await axiosInstance.post('/editRole', roleData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
