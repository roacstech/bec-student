import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function editRolePermssion(roleData) {
  try {
    const response = await axiosInstance.post('roles/editRolePermssion', roleData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
