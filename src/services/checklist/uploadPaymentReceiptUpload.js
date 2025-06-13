import axiosInstance from 'services/axiosMiddleware';

export async function uploadPaymentReceiptUpload(PaymentReceiptdata) {
  try {
    const response = await axiosInstance.post('student/uploadPaymentReceiptChecklistFile', PaymentReceiptdata);
    return response.data;
  } catch (error) {
    console.error('Error uploading offer letter checklist file:', error);
    throw error;
  }
}
