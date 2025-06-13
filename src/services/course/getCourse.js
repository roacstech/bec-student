import toast from 'react-hot-toast';
import axiosInstance from 'services/axiosMiddleware';

async function getCourse() {
  try {
    const response = await axiosInstance.post('course/getCourse');
 

    if (response.data.status) {
      return response.data.data.response || []; // Corrected data extraction
    } else {
      toast.error(response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('❌ Error fetching Course data:', error);
    throw error;
  }
}

export default getCourse;
