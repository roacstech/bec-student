import axiosInstance from 'services/axiosMiddleware';

export async function updateLanguageTestStatus({ key, languagetestid }) {
  try {
    const response = await axiosInstance.post('languagetest/updateLanguageTestStatus', {
      key,
      languagetestid
    });

    if (response.data.status) {
      return response.data.message; // Return the success message
    } else {
      throw new Error(response.data.message); // Throw an error with the message if status is false
    }
  } catch (error) {
    console.error('Error updating Referral Type  status:', error);
    throw error; // Re-throw the error to be handled by react-query
  }
}
