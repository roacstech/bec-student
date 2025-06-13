import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function editComplaintType(complaintData) {
  try {
    const response = await axiosInstance.post('complainttype/editComplaintType', complaintData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
