import axiosInstance from 'services/axiosMiddleware';

// Updated function to accept category data
export async function editCourse(Coursedata) {
  try {
    const response = await axiosInstance.post('course/editCourse', Coursedata);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
