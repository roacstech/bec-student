import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function updateDocumentTypeStatus(documentTypeData) {
  // console.log(documentTypeData)
  try {
    const response = await axiosInstance.post('/documenttype/updateDocumentTypeStatus', documentTypeData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
