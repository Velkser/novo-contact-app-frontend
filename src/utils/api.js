// src/utils/api.js
const API_BASE_URL = 'http://localhost:8000/api';

// Функция для создания заголовков
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Если нужна аутентификация, браузер автоматически отправит cookies
  // благодаря credentials: 'include'
  
  return headers;
};

// Функция для выполнения запросов
const apiRequest = async (url, options = {}) => {
  const config = {
    credentials: 'include', // Важно для cookies
    headers: getHeaders(),
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),
  
  getMe: () => apiRequest('/auth/me'),
};

// Contacts API
export const contactsAPI = {
  getAll: () => apiRequest('/contacts/'),
  
  getById: (id) => apiRequest(`/contacts/${id}`),
  
  create: (contactData) => apiRequest('/contacts/', {
    method: 'POST',
    body: JSON.stringify(contactData),
  }),
  
  update: (id, contactData) => apiRequest(`/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(contactData),
  }),
  
  delete: (id) => apiRequest(`/contacts/${id}`, {
    method: 'DELETE',
  }),
  
  // Dialogs
  addDialog: (contactId, dialogData) => apiRequest(`/contacts/${contactId}/dialogs`, {
    method: 'POST',
    body: JSON.stringify(dialogData),
  }),
  
  getDialogs: (contactId) => apiRequest(`/contacts/${contactId}/dialogs`),
};

// Prompt Templates API
export const promptTemplatesAPI = {
  getAll: () => apiRequest('/prompt-templates/'),
  
  getById: (id) => apiRequest(`/prompt-templates/${id}`),
  
  create: (templateData) => apiRequest('/prompt-templates/', {
    method: 'POST',
    body: JSON.stringify(templateData),
  }),
  
  update: (id, templateData) => apiRequest(`/prompt-templates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(templateData),
  }),
  
  delete: (id) => apiRequest(`/prompt-templates/${id}`, {
    method: 'DELETE',
  }),
};

export default apiRequest;