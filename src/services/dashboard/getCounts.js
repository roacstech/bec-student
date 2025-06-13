import axiosInstance from "services/axiosMiddleware";


export async function getCounts() {
  // console.log('CustomerData', CustomerData)

  const response = await axiosInstance.post(`dashboard/getCounts`).catch((error) => {
    console.log(error);
    throw error;
  });
  // console.log('response', response)

  return response.data;
}
