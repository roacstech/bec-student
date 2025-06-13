import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function getModuleWithSubmodule(roleData) {
  try {
    const response = await axiosInstance.post('/roles/getModuleWithSubmodule');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
