import axiosInstance from "services/axiosMiddleware";

// Updated function to accept category data
export async function editCompany(companydata) {
  try {
    const response = await axiosInstance.post('company/editCompany', companydata);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
