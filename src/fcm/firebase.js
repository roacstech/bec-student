import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyCYxwL4LZegkKYTIugeCrMBItCJ-rVzGiE',
  authDomain: 'rythm-3b155.firebaseapp.com',
  projectId: 'rythm-3b155',
  storageBucket: 'rythm-3b155.firebasestorage.app',
  messagingSenderId: '407860925097',
  appId: '1:407860925097:web:2a5b0722cc8f95b9becfb8',
  measurementId: 'G-QRV9V5STKF'
};

//
initializeApp(firebaseConfig);
const messaging = getMessaging();

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: 'BL0Tikyn9vW_rDe7mnm_j-9sO8sT6ioBa2rVXajy8ez7STxlGjfnG1QATgKmkMHJDJTb5hxqSCHCZPawNgRMJM0'
    });
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (err) {
    console.error('An error occurred while retrieving token:', err);
    return null;
  }
};

export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      // console.log('onMessage Payload', payload)

      resolve(payload);
    });
  });
};

// console.log(onMessageListener())
