import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function getDocumentType(key) {
  try {
    const response = await axiosInstance.post('/documenttype/getDocumentType', { key: key });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
