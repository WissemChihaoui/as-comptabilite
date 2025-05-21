import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/user',
    signIn: '/api/login',
    signUp: '/api/register',
    signOut: '/api/logout'
  },
  documents: {
    getByService: (i)=> `api/services/${i}/documents`,
    upload: "/api/documents/upload"
  },
  profile: {
    updateRecords: '/api/user/profile'
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  notification: {
    user: '/api/notifications',
  },
  services: {
    all: '/api/services',
  },
  forms: {
    all: '/api/forms',
    deleteForm: (id)=> `/api/forms/${id}`,
    get: (id) => `/api/forms/${id}`,
    myForms: '/api/myforms'
  },
  users: {
    all: '/api/users'
  },
  statistics: {
    get: '/api/statistics'
  }
};
