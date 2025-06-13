import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function createCompany(companydata) {
  // console.log(companydata)
  try {
    const response = await axiosInstance.post('company/createCompany', companydata);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
