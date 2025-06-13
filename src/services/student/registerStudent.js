import axiosInstance from 'services/axiosMiddleware';

// Updated function to accept category data
export async function StudentRegister(studentData) {
  // console.log(roleData)
  try { 
    console.log('Student Data:', studentData);
    const response = await axiosInstance.post('/student/registration', studentData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
