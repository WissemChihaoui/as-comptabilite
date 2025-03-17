import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';

import { STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

export function jwtDecode(token) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid token!');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));

    // console.log('Decoded Token:', decoded); // Log decoded token for debugging
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export function isValidToken(accessToken) {
  // console.log('Access Token:', accessToken);
  // console.log('Decoded Token:', jwtDecode(accessToken));
  if (!accessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);

    if (!decoded || typeof decoded.exp !== 'number') {
      console.error('Invalid token structure or exp field!');
      return false;
    }

    const currentTime = Date.now() / 1000; // Convert to seconds for comparison

    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error during token validation:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export function tokenExpired(exp) {
  const currentTime = Date.now() / 1000; // Ensure we're comparing in seconds
  const timeLeft = exp - currentTime;

  if (timeLeft <= 0) {
    alert('Token expired!');
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.href = paths.auth.jwt.signIn;
  } else {
    setTimeout(() => {
      alert('Token expired!');
      sessionStorage.removeItem(STORAGE_KEY);
      window.location.href = paths.auth.jwt.signIn;
    }, timeLeft * 1000); // Convert timeLeft back to milliseconds for setTimeout
  }
}

// ----------------------------------------------------------------------

export async function setSession(accessToken = sessionStorage.getItem(STORAGE_KEY)) {
  sessionStorage.setItem(STORAGE_KEY, accessToken);
  // console.log("hey", accessToken)
  if (accessToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    // console.log('No valid token found');
  }
  // try {
  //   if (accessToken && isValidToken(accessToken)) {
  //     sessionStorage.setItem(STORAGE_KEY, accessToken);

  //     const decodedToken = jwtDecode(accessToken);
  //     if (decodedToken && 'exp' in decodedToken) {
  //       tokenExpired(decodedToken.exp);
  //     } else {
  //       throw new Error('Invalid access token!');
  //     }
  //   } else {
  //     sessionStorage.removeItem(STORAGE_KEY);
  //     delete axios.defaults.headers.common.Authorization;
  //   }
  // } catch (error) {
  //   console.error('Error during set session:', error);
  //   throw error;
  // }
}
