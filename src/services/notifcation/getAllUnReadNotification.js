import axiosInstance from "services/axiosMiddleware";


// Updated function to accept category data
export async function getAllUnReadNotification(notifydata) {
  // console.log(notifydata)
  try {
    const response = await axiosInstance.post('notification/getAllUnReadNotification', notifydata);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
