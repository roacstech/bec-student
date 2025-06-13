import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function editAdmin(admindata) {
  try {
    const response = await axiosInstance.post('admin/editAdmin', admindata);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
