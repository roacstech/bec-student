import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function getEnrollments(enrollData) {
  try {
    const response = await axiosInstance.post('/enrollments/getEnrollments', enrollData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
