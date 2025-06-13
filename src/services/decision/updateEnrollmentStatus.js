import axiosInstance from 'services/axiosMiddleware';

// Updated function to accept category data
export async function updateEnrollmentStatus() {
  // console.log(admindata)
  try {
    const response = await axiosInstance.post('enrollments/updateenrollmentStatus');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
