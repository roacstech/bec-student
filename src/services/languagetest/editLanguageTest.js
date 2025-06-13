import axiosInstance from 'services/axiosMiddleware';

// Updated function to accept category data
export async function editLanguageTest(Languagetestdata) {
  try {
    const response = await axiosInstance.post('languagetest/editLanguageTest', Languagetestdata);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
