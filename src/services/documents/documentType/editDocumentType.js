import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function editDocumentType(documentTypeData) {
  console.log('documentTypeData', documentTypeData)
  try {
    const response = await axiosInstance.post('/documenttype/editDocumentType', documentTypeData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
