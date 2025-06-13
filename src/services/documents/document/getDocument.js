import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function getDocument(documentData) {
  try {
    const response = await axiosInstance.post('/document/getDocument', documentData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
