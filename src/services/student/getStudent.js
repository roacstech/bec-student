import toast from 'react-hot-toast';
import axiosInstance from 'services/axiosMiddleware';

async function getStudent(props) {
  try {
    const response = await axiosInstance.post('student/getStudent', props);

    if (response.data.status) {
      return response?.data?.response || []; // Corrected data extraction`
    } else {
      toast.error(response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('❌ Error fetching Student data:', error);
    throw error;
  }
}

export default getStudent;
