import axiosInstance from 'services/axiosMiddleware';

// Updated function to accept category data
export async function createCourse(Coursedata) {
  // console.log(admindata)
  try {
    const response = await axiosInstance.post('course/createCourse', Coursedata);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
