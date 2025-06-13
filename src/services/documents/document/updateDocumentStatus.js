import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function updateDocumentStatus(documentData) {
  // console.log(documentData)
  try {
    const response = await axiosInstance.post('/document/updateDocumentStatus', documentData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
