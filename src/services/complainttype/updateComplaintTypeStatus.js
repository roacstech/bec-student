import axiosInstance from "services/axiosMiddleware";

export async function updateComplaintTypeStatus({ key, complainttypeid }) {
  try {
    const response = await axiosInstance.post('complainttype/updateComplaintTypeStatus', {
      key,
      complainttypeid,
    });
    return response; // Return the success message
  } catch (error) {
    console.error('Error updating complainttype status:', error);
    throw error; // Re-throw the error to be handled by react-query
  }
}
