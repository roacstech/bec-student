import toast from 'react-hot-toast';
import axiosInstance from 'services/axiosMiddleware';

export async function getALeadsById(id) {
  try {
    const response = await axiosInstance.get(`leads/getleads/${id}`); // Dynamically insert id
    console.log(response);
    if (response.data) {
      return response; // Return the array of categories
    } else {
      throw new Error(response.data.message); // Throw an error with the message if status is false
    }
  } catch (error) {
    console.error('Error fetching Leads data:', error);
    throw error; // Re-throw the error to be handled by react-query
  }
}
