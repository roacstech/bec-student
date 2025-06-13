import axiosInstance from 'services/axiosMiddleware';

export async function sendCheckList(checkListdata, userid) {
  console.log('checkListdata:', checkListdata); // Log data before sending
  console.log('userid:', userid); // Log user id

  try {
    const response = await axiosInstance.post('enrollments/sendCheckList', checkListdata, {
      headers: {
        userid: userid
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
