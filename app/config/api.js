// Production-ready API Configuration - Updated for Database Integration
import { Platform } from 'react-native';

const getBaseURL = () => {
  if (__DEV__) {
    // Development URLs
    if (Platform.OS === 'ios') {
      return 'http://localhost:5001';
    } else {
      return 'https://kingdom-united-app.onrender.com';
    }
  } else {
    // PRODUCTION URL - UPDATE THIS WITH YOUR ACTUAL DEPLOYED URL
    // After you deploy to Render, Railway, or Heroku, replace this URL
    return 'https://kingdom-united-app.onrender.com';
    
    // Examples:
    // return 'https://prayer-app-api.onrender.com';
    // return 'https://prayer-app-api.up.railway.app';
    // return 'https://prayer-app-api.herokuapp.com';
  }
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  
  ENDPOINTS: {
    PRAYERS: '/data',
    PRAYERS_BY_USER: '/data/user',
    PRAYERS_BY_ZIP: '/data/zip',
    HEALTH: '/health',
  },
  
  // Production-optimized timeouts
  TIMEOUT: __DEV__ ? 15000 : 30000, // Longer timeout for production
  
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Retry configuration for production
  RETRY_ATTEMPTS: __DEV__ ? 1 : 3,
  RETRY_DELAY: 1000,
};

// Enhanced API request function with retry logic for production
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  if (__DEV__) {
    console.log(`[API] Making request to: ${url}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  const config = {
    ...options,
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
    signal: controller.signal,
  };

  let lastError;
  
  // Retry logic for production
  for (let attempt = 1; attempt <= API_CONFIG.RETRY_ATTEMPTS; attempt++) {
    try {
      if (__DEV__ && attempt > 1) {
        console.log(`[API] Retry attempt ${attempt} for ${endpoint}`);
      }
      
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      if (__DEV__) {
        console.log(`[API] Response status: ${response.status}`);
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (__DEV__) {
        console.log(`[API] Success response:`, data);
      }
      
      // Return data in consistent format
      return {
        data: Array.isArray(data) ? data : [data],
        success: true,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      lastError = error;
      
      if (__DEV__) {
        console.error(`[API] Attempt ${attempt} failed:`, error);
      }
      
      // Don't retry on certain errors
      if (error.name === 'AbortError' || 
          error.message.includes('400') || 
          error.message.includes('401') || 
          error.message.includes('404')) {
        break;
      }
      
      // Wait before retrying (except on last attempt)
      if (attempt < API_CONFIG.RETRY_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempt));
      }
    }
  }
  
  clearTimeout(timeoutId);
  
  // Enhanced error handling
  if (lastError.name === 'AbortError') {
    throw new Error('Request timed out. Please check your connection and try again.');
  } else if (lastError.message.includes('Network request failed')) {
    throw new Error('Unable to connect to server. Please check your internet connection.');
  } else {
    throw lastError;
  }
};

// Production health check with detailed info
export const testConnection = async () => {
  try {
    const startTime = Date.now();
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      headers: API_CONFIG.DEFAULT_HEADERS,
      timeout: 10000,
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (response.ok) {
      const data = await response.json();
      return { 
        success: true, 
        data,
        responseTime,
        url: `${API_CONFIG.BASE_URL}/health`,
        environment: __DEV__ ? 'development' : 'production'
      };
    } else {
      return { 
        success: false, 
        error: `Server error: ${response.status}`,
        responseTime,
        url: `${API_CONFIG.BASE_URL}/health`
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message.includes('Network request failed') 
        ? 'Cannot reach server. Server may be down or URL incorrect.'
        : error.message,
      url: `${API_CONFIG.BASE_URL}/health`,
      environment: __DEV__ ? 'development' : 'production'
    };
  }
};

// Production-ready Prayer API - Updated for your database schema
export const prayerAPI = {
  testConnection,
  
  submit: async (prayerData) => {
    // Pre-flight connection test for critical operations in production
    if (!__DEV__) {
      const connectionTest = await testConnection();
      if (!connectionTest.success) {
        throw new Error(`Service unavailable: ${connectionTest.error}`);
      }
    }
    
    // Map frontend fields to backend fields
    const backendData = {
      userId: prayerData.userId,
      zip: parseInt(prayerData.zip), // Ensure zip is integer
      prayerText: prayerData.prayerText,
    };
    
    console.log('[API] Submitting prayer data:', backendData);
    
    return apiRequest(API_CONFIG.ENDPOINTS.PRAYERS, {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  },
  
  getAll: async () => {
    console.log('[API] Fetching all prayers');
    return apiRequest(API_CONFIG.ENDPOINTS.PRAYERS);
  },
  
  getByUser: async (userId) => {
    console.log(`[API] Fetching prayers for user: ${userId}`);
    return apiRequest(`${API_CONFIG.ENDPOINTS.PRAYERS_BY_USER}/${userId}`);
  },
  
  getByZip: async (zipCode) => {
    console.log(`[API] Fetching prayers for zip: ${zipCode}`);
    const result = await apiRequest(`${API_CONFIG.ENDPOINTS.PRAYERS_BY_ZIP}/${zipCode}`);
    
    // Ensure we return the data in the expected format
    if (result && Array.isArray(result)) {
      return { data: result };
    } else if (result && result.data) {
      return result;
    } else {
      return { data: [] };
    }
  },
  
  getById: async (id) => {
    console.log(`[API] Fetching prayer by ID: ${id}`);
    return apiRequest(`${API_CONFIG.ENDPOINTS.PRAYERS}/${id}`);
  },
  
  update: async (id, updateData) => {
    console.log(`[API] Updating prayer ${id}:`, updateData);
    return apiRequest(`${API_CONFIG.ENDPOINTS.PRAYERS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },
  
  delete: async (id) => {
    console.log(`[API] Deleting prayer ${id}`);
    return apiRequest(`${API_CONFIG.ENDPOINTS.PRAYERS}/${id}`, {
      method: 'DELETE',
    });
  },
};

// Enhanced validation for production
export const validation = {
  validateZipCode: (zip) => {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(String(zip));
  },
  
  validatePrayerText: (text, minLength = 10, maxLength = 500) => {
    const trimmed = String(text).trim();
    
    // Additional production validations
    if (trimmed.includes('<script>') || trimmed.includes('</script>')) {
      return { isValid: false, error: 'Invalid content detected' };
    }
    
    return {
      isValid: trimmed.length >= minLength && trimmed.length <= maxLength,
      length: trimmed.length,
      minLength,
      maxLength,
    };
  },
  
  validateUserId: (userId) => {
    return userId && String(userId).trim().length > 0;
  },
};

// Production error handling
export const errorHandler = {
  getErrorMessage: (error) => {
    if (__DEV__) {
      console.log('[ErrorHandler] Processing error:', error);
    }
    
    if (error.message.includes('Service unavailable')) {
      return "Service is temporarily unavailable. Please try again in a few moments.";
    } else if (error.message.includes('Network request failed')) {
      return "Unable to connect to server. Please check your internet connection.";
    } else if (error.message.includes('timeout') || error.message.includes('timed out')) {
      return "Request timed out. Please try again.";
    } else if (error.message.includes('400')) {
      return "Invalid request. Please check your input and try again.";
    } else if (error.message.includes('404')) {
      return "Service not found. Please try again later.";
    } else if (error.message.includes('500')) {
      return "Server error. Please try again later.";
    } else {
      return error.message || "An unexpected error occurred. Please try again.";
    }
  },
  
  isNetworkError: (error) => {
    return error.message.includes('Network request failed') || 
           error.message.includes('Service unavailable');
  },
  
  isTimeoutError: (error) => {
    return error.message.includes('timeout') || error.message.includes('timed out');
  },
};

// Debug function (only works in development)
export const debugConnection = async () => {
  if (!__DEV__) {
    return { success: false, error: 'Debug mode only available in development' };
  }
  
  console.log('\n=== DEBUGGING CONNECTION ===');
  console.log(`Platform: ${Platform.OS}`);
  console.log(`Environment: ${__DEV__ ? 'development' : 'production'}`);
  console.log(`Base URL: ${API_CONFIG.BASE_URL}`);
  console.log(`Full health check URL: ${API_CONFIG.BASE_URL}/health`);
  
  try {
    // Test health endpoint
    const healthResult = await testConnection();
    console.log('Health check result:', healthResult);
    
    // Test fetching all prayers
    console.log('\n=== TESTING PRAYERS ENDPOINT ===');
    const prayersResult = await prayerAPI.getAll();
    console.log('All prayers result:', prayersResult);
    
    // Test fetching by zip if we have data
    if (prayersResult.data && prayersResult.data.length > 0) {
      const sampleZip = prayersResult.data[0].zip;
      console.log(`\n=== TESTING ZIP ENDPOINT (${sampleZip}) ===`);
      const zipResult = await prayerAPI.getByZip(sampleZip);
      console.log('Zip prayers result:', zipResult);
    }
    
    return { 
      success: true, 
      healthCheck: healthResult,
      prayersTest: prayersResult,
      message: 'All tests completed successfully'
    };
  } catch (error) {
    console.error('Debug connection failed:', error);
    return { success: false, error: error.message };
  }
};