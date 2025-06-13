import axiosInstance from 'services/axiosMiddleware';

export async function uploadStudentChecklistFile(studentchecklistdata) {
  try {
    const response = await axiosInstance.post('student/uploadStudentChecklistFile', studentchecklistdata);
    return response.data;
  } catch (error) {
    console.error('Error uploading student checklist files:', error);
    throw error;
  }
}
