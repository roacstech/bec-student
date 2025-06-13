import axiosInstance from 'services/axiosMiddleware';

// Updated function to accept category data
export async function uploadStudentFile(filesdata) {
  // console.log(admindata)
  try {
    const response = await axiosInstance.post('student/uploadStudentChecklistFile', filesdata);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
