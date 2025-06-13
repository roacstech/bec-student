import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function addDocumentType(documentTypeData) {
  // console.log(documentTypeData)
  try {
    const response = await axiosInstance.post('/documenttype/addDocumentType', documentTypeData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
