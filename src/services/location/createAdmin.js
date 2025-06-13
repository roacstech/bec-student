import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function createAdmin(admindata) {
  // console.log(admindata)
  try {
    const response = await axiosInstance.post('admin/createAdmin', admindata);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
