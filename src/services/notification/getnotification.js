import toast from 'react-hot-toast';
import axiosInstance from 'services/axiosMiddlewar';

export async function getAdmin() {
  try {
    const response = await axiosInstance.post('admin/getAdmin');

    if (response.data.status) {
      return response.data.response; // Return the array of categories
    } else {
      toast.error(response.data.message);
      throw new Error(response.data.message); // Throw an error with the message if status is false
    }
  } catch (error) {
    console.error('Error fetching admin data:', error);
    throw error; // Re-throw the error to be handled by react-query
  }
}
