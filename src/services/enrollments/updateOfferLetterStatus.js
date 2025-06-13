import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function updateOfferLetterStatus(enrollData) {
  try {
    const response = await axiosInstance.post('/student/updateOfferLetterStatus', enrollData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
