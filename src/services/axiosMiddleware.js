import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accesstoken = localStorage.getItem('accesstoken');
    const tenantid = localStorage.getItem('tenantid');
    const roleid = Number(localStorage.getItem('roleid'));
    const userid = localStorage.getItem('userid');
    const locationid = localStorage.getItem('locationid');

    if (accesstoken) {
      config.headers['auth'] = accesstoken;
    }

    if (roleid) {
      config.headers['roleid'] = roleid;
    }

    if (tenantid) {
      config.headers['tenantid'] = tenantid;
    }
    
    if (userid) {
      config.headers['userid'] = Number(userid);
    }

    if (locationid) {
      config.headers['locationid'] = locationid;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
