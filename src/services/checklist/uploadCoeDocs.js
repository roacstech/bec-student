import axiosInstance from 'services/axiosMiddleware';

export async function uploadCoeDocs(coedata) {
  try {
    const response = await axiosInstance.post('student/uploadCoeFile', coedata);
    return response.data;
  } catch (error) {
    console.error('Error uploading Coe checklist file:', error);
    throw error;
  }
}
