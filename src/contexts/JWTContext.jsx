import PropTypes from 'prop-types';
import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project import
import Loader from 'components/Loader';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { requestForToken } from '../fcm/firebase';

const chance = new Chance();

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyAccesstoken = (accesstoken) => {
  if (!accesstoken) {
    return false;
  }
  const decoded = jwtDecode(accesstoken);
  /**
   * Property 'exp' does not exist on type '<T = unknown>(accesstoken: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

const setSession = (accesstoken) => {
  if (accesstoken) {
    localStorage.setItem('accesstoken', accesstoken);
    axios.defaults.headers.common.Authorization = `Bearer ${accesstoken}`;
  } else {
    localStorage.removeItem('accesstoken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [userDetails, setUserDetails] = useState({});
  const [leadStatus, setLeadStatus] = useState(0);
  const [lead, setLead] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // Initialize with the first tab
  const [selectedCompanyId, setSelectedCompanyId] = useState(0);

  const [jobTabs, setJobTabs] = useState([]);
  const [isJobTabLoading, setIsJobTabLoading] = useState(false);

  const [customerId, setCustomerId] = useState(0);
  const [fcmToken, setFcmToken] = useState('');

  // console.log(fcmToken);

  useEffect(() => {
    const initialize = async () => {
      const fetchedToken = await requestForToken();
      // console.log('fetchedToken', fetchedToken)
      setFcmToken(fetchedToken);
    };
    initialize();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const accesstoken = window.localStorage.getItem('accesstoken');
        if (accesstoken && verifyAccesstoken(accesstoken)) {
          const user = setSession(accesstoken);
          // const response = await axios.get('/api/account/me');
          // const { user } = response.data;
          // console.log("user", user)
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();

    // Periodic token expiration check
    const intervalId = setInterval(
      () => {
        const accesstoken = window.localStorage.getItem('accesstoken');
        if (accesstoken && !verifyAccesstoken(accesstoken)) {
          toast.error('Session expired. Logging out...');
          setSession(null); // Clear the session data
          dispatch({ type: LOGOUT }); // Dispatch LOGOUT action to update state
        }
      },
      60 * 60 * 1000
    ); // Check every 5 minutes

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  // const login = async (email, password) => {
  //   const response = await axios.post(`${BASE_URL}auth/login`, { email, password, configid: 1, fcmtoken: fcmToken, roleid: 1 });
  //   console.log('ressss', response?.data);

  //   if (response.data.status) {
  //     const accesstoken = response.data.response;

  //     if (!accesstoken) {
  //       console.error('Service accesstoken is undefined');
  //       toast.error('Service accesstoken is undefined');
  //       return;
  //     }

  //     console.log('redsshsjhshshshh', response);

  //     const decoded = jwtDecode(accesstoken);

  //     console.log('decoded access token', decoded);

  //     const decodedresponse = decoded.response;

  //     setSession(accesstoken);
  //     dispatch({
  //       type: LOGIN,
  //       payload: {
  //         isLoggedIn: true
  //         // user
  //       }
  //     });
  //     setUserDetails(response || {});

  //     // Storing the necessary data in localStorage
  //     localStorage.setItem('tenantid', decodedresponse.tenantid);
  //     localStorage.setItem('sessionid', decodedresponse.sessionid);
  //     localStorage.setItem('userid', decodedresponse.userid);
  //     localStorage.setItem('roleid', decodedresponse.roleid);
  //     localStorage.setItem('userimage', decodedresponse.userimage)
  //     // localStorage.setItem('locationid', decodedresponse.locationid);
  //     localStorage.setItem('name', decodedresponse.username);
  //     localStorage.setItem('accesstoken', accesstoken);

  //     toast.success(response.data.message);
  //   } else {
  //     dispatch({ type: LOGOUT });
  //     toast.error(response.data.message);
  //   }
  // };

  const login = async (emailOrToken, password) => {
    let response;

    if (password) {
      // Regular email/password login
      response = await axios.post(`${BASE_URL}auth/login`, {
        email: emailOrToken,
        password,
        configid: 1,
        fcmtoken: fcmToken,
        roleid: 1
      });
    } else {
      // Google login (emailOrToken is the JWT token from Google)
      response = await axios.post(`${BASE_URL}auth/google/callback`, {
        token: emailOrToken
      });
    }

    if (response.data.status) {
      const accesstoken = response.data.response;

      if (!accesstoken) {
        console.error('Service accesstoken is undefined');
        toast.error('Service accesstoken is undefined');
        return;
      }

      const decoded = jwtDecode(accesstoken);
      console.log('decoded access token', decoded);
      const decodedresponse = decoded.response;

      console.log('decoded👍🏻', decoded);

      setSession(accesstoken);
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true
        }
      });
      setUserDetails(response || {});

      // Storing the necessary data in localStorage
      localStorage.setItem('tenantid', decodedresponse.tenantid);
      localStorage.setItem('studentid', decodedresponse.studentid);
      localStorage.setItem('sessionid', decodedresponse.sessionid);
      localStorage.setItem('userid', decodedresponse.userid);
      localStorage.setItem('roleid', decodedresponse.roleid);
      localStorage.setItem('userimage', decodedresponse.userimage);
      localStorage.setItem('name', decodedresponse.username);
      localStorage.setItem('accesstoken', accesstoken);
      localStorage.setItem('useruniqueid', decodedresponse.useruniqueid);
      localStorage.setItem('email', decodedresponse.email);
      localStorage.setItem('phone', decodedresponse.primarycontact);
      localStorage.setItem('status', decodedresponse.status);

      

      toast.success(response.data.message);
    } else {
      dispatch({ type: LOGOUT });
      toast.error(response.data.message);
    }
  };

  const register = async (email, password, firstName, lastName) => {
    // todo: this flow need to be recode as it not verified
    const id = chance.bb_pin();
    const response = await axios.post('/api/account/register', {
      id,
      email,
      password,
      firstName,
      lastName
    });
    let users = response.data;

    if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
      const localUsers = window.localStorage.getItem('users');
      users = [
        ...JSON.parse(localUsers),
        {
          id,
          email,
          password,
          name: `${firstName} ${lastName}`
        }
      ];
    }

    window.localStorage.setItem('users', JSON.stringify(users));
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async (email) => {
    console.log('email - ', email);
  };

  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        resetPassword,
        updateProfile,
        lead,
        setLead,
        leadStatus,
        setLeadStatus,
        activeTab,
        setActiveTab,
        userDetails,
        selectedCompanyId,
        setSelectedCompanyId,
        customerId,
        setCustomerId,
        jobTabs,
        setJobTabs,
        isJobTabLoading,
        setIsJobTabLoading
      }}
    >
      {children}
    </JWTContext.Provider>
  );
};

JWTProvider.propTypes = {
  children: PropTypes.node
};

export default JWTContext;
