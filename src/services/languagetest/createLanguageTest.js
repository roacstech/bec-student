import axiosInstance from 'services/axiosMiddleware';

// Updated function to accept category data
export async function createLanguageTest(languagetestdata) {
  // console.log(languagetestdata)
  try {
    const response = await axiosInstance.post('languagetest/createLanguageTest', languagetestdata);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
