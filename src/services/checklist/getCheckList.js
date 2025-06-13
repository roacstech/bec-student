import toast from 'react-hot-toast';
import axiosInstance from 'services/axiosMiddleware';

export async function getCheckList() {
  try {
    const response = await axiosInstance.post('checklist/getchecklist');
    console.log('🔥 check list Response:', response.data);
    if (response.data.status) {
      return response?.data?.response; // Return the array of categories
    } else {
      toast.error(response.data.message);
      throw new Error(response.data.message); // Throw an error with the message if status is false
    }
  } catch (error) {
    console.error('Error fetching CheckList data:', error);
    throw error; // Re-throw the error to be handled by react-query
  }
}
