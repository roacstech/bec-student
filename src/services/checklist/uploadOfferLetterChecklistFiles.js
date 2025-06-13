import axiosInstance from 'services/axiosMiddleware';

export async function uploadOfferLetterChecklistFiles(OfferLetterChecklistFilesdata) {
  try {
    const response = await axiosInstance.post('student/uploadOfferLetterChecklistFile', OfferLetterChecklistFilesdata);
    return response.data;
  } catch (error) {
    console.error('Error uploading offer letter checklist file:', error);
    throw error;
  }
}
