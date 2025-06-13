import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function createComplaintType(complaintData) {
  // console.log(complaintData)
  try {
    const response = await axiosInstance.post('complainttype/createComplaintType', complaintData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
