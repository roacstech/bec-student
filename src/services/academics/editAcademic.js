import axiosInstance from 'services/axiosMiddleware';

// Updated function to accept category data
export async function editAcademic(Acadmicdata) {
  try {
    const response = await axiosInstance.post('academics/editAcademic', Acadmicdata);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
