// app/config/api.js - Production hardening updates
import { Platform, Constants } from 'react-native';

// Add environment detection
const isProduction = !__DEV__;
const isStaging = process.env.NODE_ENV === 'staging';

// Production API URLs (update with your actual production URLs)
const getBaseURL = () => {
  if (isProduction) {
    return 'https://kingdom-united-api.onrender.com'; // Your production API
  } else if (isStaging) {
    return 'https://kingdom-united-staging.onrender.com'; // Staging API
  } else {
    // Development URLs
    return Platform.OS === 'ios' 
      ? 'http://localhost:5001'
      : 'https://kingdom-united-app.onrender.com';
  }
};

// Production-optimized configuration
export const API_CONFIG = Object.freeze({
  BASE_URL: getBaseURL(),
  
  ENDPOINTS: Object.freeze({
    PRAYERS: '/data',
    PRAYERS_BY_USER: '/data/user',
    PRAYERS_BY_ZIP: '/data/zip',
    HEALTH: '/health',
  }),
  
  // Production-optimized timeouts
  TIMEOUT: isProduction ? 30000 : 15000,
  
  DEFAULT_HEADERS: Object.freeze({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': `KingdomUnited/${'1.0.0'}`,
  }),
  
  // Enhanced retry for production
  RETRY_ATTEMPTS: isProduction ? 3 : 1,
  RETRY_DELAY: 2000,
  
  // Rate limiting
  MAX_REQUESTS_PER_MINUTE: 60,
  CACHE_TTL: isProduction ? 300000 : 30000, // 5 min prod, 30 sec dev
});

// Add request rate limiting
const requestTracker = new Map();
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of requestTracker) {
    if (now - timestamp > 60000) { // 1 minute
      requestTracker.delete(key);
    }
  }
}, 30000); // Clean up every 30 seconds

// Enhanced request function with rate limiting
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const requestKey = `${options.method || 'GET'}_${endpoint}`;
  
  // Rate limiting check
  const now = Date.now();
  const recentRequests = Array.from(requestTracker.values())
    .filter(timestamp => now - timestamp < 60000);
  
  if (recentRequests.length >= API_CONFIG.MAX_REQUESTS_PER_MINUTE) {
    throw new Error('Rate limit exceeded. Please wait before making more requests.');
  }
  
  requestTracker.set(`${requestKey}_${now}`, now);
  
  // Rest of your existing apiRequest code...
  return executeRequest(url, options, requestKey);
};
