import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function addRole(roleData) {
  // console.log(roleData)
  try {
    const response = await axiosInstance.post('/addRole', roleData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
