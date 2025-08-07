// User API service

// Helper function to construct avatar URL
export const getAvatarUrl = (filename: string | null | undefined): string => {
  if (!filename) return "";
  return `${import.meta.env.VITE_SERVER_URL}/uploads/${filename}`;
};

export const getUserProfile = async () => {
  const userData = localStorage.getItem('user');
  let token = null;

  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);
      token = parsedUser.access_token;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  // console.log(token, "tokenfjl;sjfl;sjflskjl")

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/users/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  const data = await response.json();
  console.log("Raw API response data:", data);
  return data;
};

export const updateUserProfile = async (userData: any) => {
  console.log('Updating user profile with data:', userData);
  const userDataFromStorage = localStorage.getItem('user');
  let token = null;
  let userId = null;

  if (userDataFromStorage) {
    try {
      const parsedUser = JSON.parse(userDataFromStorage);
      console.log('Parsed user data from localStorage:', parsedUser);
      token = parsedUser.access_token;
      userId = parsedUser._id || parsedUser.user_id || parsedUser.id; // Try multiple possible field names
      console.log('Extracted userId:', userId);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  // If userId is not in localStorage, get it from the profile API
  if (!userId) {
    try {
      console.log('User ID not found in localStorage, fetching from profile API...');
      const profileResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        userId = profileData.user._id;
        console.log('Extracted userId from profile API:', userId);
      } else {
        throw new Error('Failed to fetch user profile for ID');
      }
    } catch (error) {
      console.error('Error fetching user profile for ID:', error);
      throw new Error('User ID not found and could not be retrieved from profile');
    }
  }

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  });

  console.log('Update profile response status:', response.status);
  console.log('Update profile response headers:', response.headers);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Update profile error response:', errorText);
    throw new Error('Failed to update user profile');
  }

  const responseData = await response.json();
  console.log('Update profile response data:', responseData);
  return responseData;
};

export const  uploadAvatar = async (file: File) => {
  const userDataFromStorage = localStorage.getItem('user');
  let token = null;
  let userId = null;

  if (userDataFromStorage) {
    try {
      const parsedUser = JSON.parse(userDataFromStorage);
      token = parsedUser.access_token;
      userId = parsedUser._id || parsedUser.user_id || parsedUser.id; // Try multiple possible field names
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  // If userId is not in localStorage, get it from the profile API
  if (!userId) {
    try {
      console.log('User ID not found in localStorage, fetching from profile API...');
      const profileResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        userId = profileData.user._id;
        console.log('Extracted userId from profile API:', userId);
      } else {
        throw new Error('Failed to fetch user profile for ID');
      }
    } catch (error) {
      console.error('Error fetching user profile for ID:', error);
      throw new Error('User ID not found and could not be retrieved from profile');
    }
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);

  console.log('Uploading avatar for user:', userId);
  console.log('File details:', { name: file.name, size: file.size, type: file.type });

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/users/fileuploads`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  console.log('Upload response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Upload error response:', errorText);
    throw new Error('Failed to upload avatar');
  }

  const responseData = await response.json();
  console.log('Upload response data:', responseData);
  return responseData;
}; 