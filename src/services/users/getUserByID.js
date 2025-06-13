import axiosInstance from "services/axiosMiddleware";

// Updated function to accept user Data
export async function getUserByID(userdata) {
  console.log(userdata)
  try {
    const response = await axiosInstance.post('/auth/getUserByID', userdata);
    console.log('userdata', response.data);
    
    return response.data.response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
