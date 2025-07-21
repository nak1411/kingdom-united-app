// app/config/api.js - Optimized API Configuration with Better Performance
import { Platform } from 'react-native';

// Lazy-loaded validation functions to reduce initial bundle size
let validatePrayerContent, quickValidateContent;

const loadValidation = async () => {
  if (!validatePrayerContent) {
    const validationModule = await import('../utils/contentFilter.js');
    validatePrayerContent = validationModule.validatePrayerContent;
    quickValidateContent = validationModule.quickValidateContent;
  }
  return { validatePrayerContent, quickValidateContent };
};

// Memoized base URL getter
const baseURLCache = new Map();

const getBaseURL = () => {
  const key = `${__DEV__}_${Platform.OS}`;
  
  if (baseURLCache.has(key)) {
    return baseURLCache.get(key);
  }
  
  let url;
  if (__DEV__) {
    // Development URLs
    url = Platform.OS === 'ios' 
      ? 'http://localhost:5001'
      : 'https://kingdom-united-app.onrender.com';
  } else {
    // PRODUCTION URL
    url = 'https://kingdom-united-app.onrender.com';
  }
  
  baseURLCache.set(key, url);
  return url;
};

// Optimized API configuration with constants
export const API_CONFIG = Object.freeze({
  BASE_URL: getBaseURL(),
  
  ENDPOINTS: Object.freeze({
    PRAYERS: '/data',
    PRAYERS_BY_USER: '/data/user',
    PRAYERS_BY_ZIP: '/data/zip',
    HEALTH: '/health',
  }),
  
  // Production-optimized timeouts
  TIMEOUT: __DEV__ ? 15000 : 30000,
  
  DEFAULT_HEADERS: Object.freeze({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }),
  
  // Retry configuration for production
  RETRY_ATTEMPTS: __DEV__ ? 1 : 3,
  RETRY_DELAY: 1000,
});

// Request queue for better performance
const requestQueue = new Map();
const activeRequests = new Set();

// Enhanced API request function with caching and retry logic
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const requestKey = `${options.method || 'GET'}_${url}_${JSON.stringify(options.body || {})}`;
  
  // Prevent duplicate requests
  if (activeRequests.has(requestKey)) {
    if (requestQueue.has(requestKey)) {
      return requestQueue.get(requestKey);
    }
  }

  const requestPromise = executeRequest(url, options, requestKey);
  activeRequests.add(requestKey);
  requestQueue.set(requestKey, requestPromise);

  try {
    const result = await requestPromise;
    return result;
  } finally {
    activeRequests.delete(requestKey);
    requestQueue.delete(requestKey);
  }
};

// Extracted request execution logic for better maintainability
const executeRequest = async (url, options, requestKey) => {
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
        console.log(`[API] Retry attempt ${attempt} for ${url}`);
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

// Cached health check results
let healthCheckCache = null;
let healthCheckTime = 0;
const HEALTH_CHECK_CACHE_DURATION = 30000; // 30 seconds

// Production health check with caching
export const testConnection = async (forceRefresh = false) => {
  const now = Date.now();
  
  // Return cached result if still valid
  if (!forceRefresh && 
      healthCheckCache && 
      (now - healthCheckTime) < HEALTH_CHECK_CACHE_DURATION) {
    return healthCheckCache;
  }

  try {
    const startTime = Date.now();
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      headers: API_CONFIG.DEFAULT_HEADERS,
      timeout: 10000,
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const result = {
      success: response.ok,
      responseTime,
      url: `${API_CONFIG.BASE_URL}/health`,
      environment: __DEV__ ? 'development' : 'production'
    };

    if (response.ok) {
      const data = await response.json();
      result.data = data;
    } else {
      result.error = `Server error: ${response.status}`;
    }

    // Cache successful results
    if (response.ok) {
      healthCheckCache = result;
      healthCheckTime = now;
    }

    return result;
  } catch (error) {
    const result = { 
      success: false, 
      error: error.message.includes('Network request failed') 
        ? 'Cannot reach server. Server may be down or URL incorrect.'
        : error.message,
      url: `${API_CONFIG.BASE_URL}/health`,
      environment: __DEV__ ? 'development' : 'production'
    };

    return result;
  }
};

// Optimized Prayer API with better error handling and caching
export const prayerAPI = Object.freeze({
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
      zip: parseInt(prayerData.zip, 10), // Ensure zip is integer with radix
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
});

// Validation cache for performance
const validationCache = new Map();
const VALIDATION_CACHE_SIZE = 100;

// Enhanced validation with caching
export const validation = Object.freeze({
  validateZipCode: (zip) => {
    const zipStr = String(zip || '');
    const cacheKey = `zip_${zipStr}`;
    
    if (validationCache.has(cacheKey)) {
      return validationCache.get(cacheKey);
    }
    
    const isValid = /^\d{5}$/.test(zipStr);
    
    // Manage cache size
    if (validationCache.size >= VALIDATION_CACHE_SIZE) {
      const firstKey = validationCache.keys().next().value;
      validationCache.delete(firstKey);
    }
    
    validationCache.set(cacheKey, isValid);
    return isValid;
  },
  
  validatePrayerText: async (text, minLength = 10, maxLength = 500) => {
    try {
      const trimmed = String(text || '').trim();
      
      // First check basic length requirements
      if (trimmed.length < minLength) {
        return { 
          isValid: false, 
          error: `Prayer request must be at least ${minLength} characters`,
          length: trimmed.length,
          minLength,
          maxLength,
          suggestions: [],
          hasInappropriateContent: false
        };
      }
      
      if (trimmed.length > maxLength) {
        return { 
          isValid: false, 
          error: `Prayer request must be no more than ${maxLength} characters`,
          length: trimmed.length,
          minLength,
          maxLength,
          suggestions: [],
          hasInappropriateContent: false
        };
      }
      
      // Check for basic security issues
      if (trimmed.includes('<script>') || trimmed.includes('</script>')) {
        return { 
          isValid: false, 
          error: 'Invalid content detected',
          suggestions: [],
          hasInappropriateContent: false
        };
      }
      
      // Lazy-load content filter validation
      try {
        const { validatePrayerContent } = await loadValidation();
        const contentResult = validatePrayerContent(trimmed);
        if (contentResult && !contentResult.isValid) {
          return {
            isValid: false,
            error: contentResult.error || 'Content not appropriate',
            suggestions: Array.isArray(contentResult.suggestions) ? contentResult.suggestions : [],
            length: trimmed.length,
            minLength,
            maxLength,
            hasInappropriateContent: Boolean(contentResult.hasInappropriateContent)
          };
        }
      } catch (contentError) {
        console.error('Content filter error:', contentError);
        // Continue without content filtering if it fails
      }
      
      return {
        isValid: true,
        length: trimmed.length,
        minLength,
        maxLength,
        suggestions: [],
        hasInappropriateContent: false
      };
      
    } catch (error) {
      console.error('Prayer text validation error:', error);
      return {
        isValid: false,
        error: 'Validation error occurred',
        length: 0,
        minLength,
        maxLength,
        suggestions: [],
        hasInappropriateContent: false
      };
    }
  },
  
  // Quick validation for real-time input feedback with caching
  quickValidatePrayerText: async (text) => {
    try {
      if (!text || typeof text !== 'string') {
        return { isValid: true, error: null };
      }
      
      const trimmed = text.trim();
      if (trimmed.length === 0) {
        return { isValid: true, error: null };
      }

      const cacheKey = `quick_${trimmed.slice(0, 50)}`; // Cache by first 50 chars
      
      if (validationCache.has(cacheKey)) {
        return validationCache.get(cacheKey);
      }
      
      try {
        const { quickValidateContent } = await loadValidation();
        const quickResult = quickValidateContent(trimmed);
        const result = {
          isValid: Boolean(quickResult && quickResult.isValid !== false),
          error: (quickResult && quickResult.message) || null
        };
        
        // Manage cache size
        if (validationCache.size >= VALIDATION_CACHE_SIZE) {
          const firstKey = validationCache.keys().next().value;
          validationCache.delete(firstKey);
        }
        
        validationCache.set(cacheKey, result);
        return result;
      } catch (quickError) {
        console.error('Quick validation error:', quickError);
        return { isValid: true, error: null };
      }
      
    } catch (error) {
      console.error('Quick prayer validation error:', error);
      return { isValid: true, error: null };
    }
  },
  
  validateUserId: (userId) => {
    return userId && String(userId).trim().length > 0;
  },
});

// Optimized error handling with error categorization
const ERROR_CATEGORIES = Object.freeze({
  NETWORK: 'network',
  TIMEOUT: 'timeout',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown'
});

const categorizeError = (error) => {
  const message = error.message.toLowerCase();
  
  if (message.includes('network request failed') || 
      message.includes('service unavailable')) {
    return ERROR_CATEGORIES.NETWORK;
  }
  
  if (message.includes('timeout') || message.includes('timed out')) {
    return ERROR_CATEGORIES.TIMEOUT;
  }
  
  if (message.includes('500') || message.includes('502') || 
      message.includes('503') || message.includes('504')) {
    return ERROR_CATEGORIES.SERVER;
  }
  
  if (message.includes('400') || message.includes('401') || 
      message.includes('403') || message.includes('404')) {
    return ERROR_CATEGORIES.CLIENT;
  }
  
  return ERROR_CATEGORIES.UNKNOWN;
};

// Production error handling with categorization
export const errorHandler = Object.freeze({
  getErrorMessage: (error) => {
    if (__DEV__) {
      console.log('[ErrorHandler] Processing error:', error);
    }
    
    const category = categorizeError(error);
    
    switch (category) {
      case ERROR_CATEGORIES.NETWORK:
        return "Unable to connect to server. Please check your internet connection.";
      case ERROR_CATEGORIES.TIMEOUT:
        return "Request timed out. Please try again.";
      case ERROR_CATEGORIES.SERVER:
        return "Server error. Please try again later.";
      case ERROR_CATEGORIES.CLIENT:
        if (error.message.includes('400')) {
          return "Invalid request. Please check your input and try again.";
        }
        if (error.message.includes('404')) {
          return "Service not found. Please try again later.";
        }
        return "Request error. Please try again.";
      default:
        return error.message || "An unexpected error occurred. Please try again.";
    }
  },
  
  isNetworkError: (error) => {
    return categorizeError(error) === ERROR_CATEGORIES.NETWORK;
  },
  
  isTimeoutError: (error) => {
    return categorizeError(error) === ERROR_CATEGORIES.TIMEOUT;
  },
  
  getErrorCategory: (error) => {
    return categorizeError(error);
  },
});

// Debug function (only works in development) - optimized
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
    const healthResult = await testConnection(true); // Force refresh
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

// Cleanup function for cache management
export const clearCache = () => {
  baseURLCache.clear();
  validationCache.clear();
  requestQueue.clear();
  activeRequests.clear();
  healthCheckCache = null;
  healthCheckTime = 0;
};

// Export for testing purposes
export const __testing__ = __DEV__ ? {
  baseURLCache,
  validationCache,
  requestQueue,
  activeRequests,
  categorizeError,
  ERROR_CATEGORIES,
} : {};

export default {
  API_CONFIG,
  apiRequest,
  testConnection,
  prayerAPI,
  validation,
  errorHandler,
  debugConnection,
  clearCache,
};