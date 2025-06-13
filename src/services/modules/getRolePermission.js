import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function getRolePermission(roleData) {
  try {
    const {data} = await axiosInstance.post('roles/getRolePermission', roleData);
    console.log('data', data.response);
    return data?.response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
