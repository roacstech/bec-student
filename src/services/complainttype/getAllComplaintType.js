import axiosInstance from "services/axiosMiddleware";


export async function getAllComplaintType(complaintData) {

  const { data } = await axiosInstance.post(`/complainttype/getAllComplaintType`, complaintData).catch((error) => {
    console.log(error);
    throw error;
  });

  return data;
}
