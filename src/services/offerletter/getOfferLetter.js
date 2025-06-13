import toast from 'react-hot-toast';
import axiosInstance from 'services/axiosMiddleware';

export async function getOfferLetter() {
  try {
    const response = await axiosInstance.post('enrollments/getofferletter');

    if (response.data.status) {
      return response.data;
    } else {
      toast.error(response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Error fetching offer letter data:', error);
    throw error;
  }
}
