import axiosInstance from 'services/axiosMiddleware';

// Updated function to accept category data
export async function createLeads(leadsdata) {
  // console.log(admindata)
  try {
    const response = await axiosInstance.post('leads/createleads', leadsdata);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
