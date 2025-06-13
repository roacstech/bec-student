import axiosInstance from 'services/axiosMiddleware';

export async function updateAcademicStatus({ key, academicid }) {
  try {
    const response = await axiosInstance.post('academics/updateAcademicStatus', {
      key,
      academicid
    });

    if (response.data.status) {
      return response.data.message; // Return the success message
    } else {
      throw new Error(response.data.message); // Throw an error with the message if status is false
    }
  } catch (error) {
    console.error('Error updating Referral Type  status:', error);
    throw error; // Re-throw the error to be handled by react-query
  }
}
