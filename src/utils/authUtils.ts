// Utility functions for authentication and user data

// Function to decode JWT token
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const getCurrentUserId = (): string | null => {
  try {
    // Check multiple possible localStorage keys
    const possibleKeys = ['user', 'userData', 'auth', 'token'];
    let userData = null;
    let usedKey = null;
    
    for (const key of possibleKeys) {
      const data = localStorage.getItem(key);
      if (data) {
        userData = data;
        usedKey = key;
        break;
      }
    }
    
    if (!userData) {
      console.log('No user data found in localStorage');
      return null;
    }

    console.log(`Found user data in localStorage key: ${usedKey}`);
    const parsedUser = JSON.parse(userData);
    console.log('Parsed user data:', parsedUser);
    
    // First try to get user ID directly from the user object
    let userId = parsedUser._id || parsedUser.user_id || parsedUser.id;
    console.log('Direct user ID:', userId);
    
    // If not found, try to decode from JWT token
    if (!userId && parsedUser.access_token) {
      const decodedToken = decodeJWT(parsedUser.access_token);
      console.log('Decoded token:', decodedToken);
      if (decodedToken && decodedToken.userId) {
        userId = decodedToken.userId;
        console.log('User ID from token:', userId);
      }
    }
    
    console.log('Final user ID:', userId);
    return userId || null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const getCurrentUserToken = (): string | null => {
  try {
    // Check multiple possible localStorage keys
    const possibleKeys = ['user', 'userData', 'auth', 'token'];
    let userData = null;
    
    for (const key of possibleKeys) {
      const data = localStorage.getItem(key);
      if (data) {
        userData = data;
        break;
      }
    }
    
    if (!userData) return null;

    const parsedUser = JSON.parse(userData);
    return parsedUser.access_token || parsedUser.token || null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const isUserLoggedIn = (): boolean => {
  return getCurrentUserId() !== null && getCurrentUserToken() !== null;
};

export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return null;

    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};