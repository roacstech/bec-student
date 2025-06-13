import axiosInstance from "services/axiosMiddleware";


export async function customercard() {
  // console.log('CustomerData', CustomerData)

  const response = await axiosInstance.post(`dashboard/customercard`).catch((error) => {
    console.log(error);
    throw error;
  });
  // console.log('response', response)

  return response.data;
}
