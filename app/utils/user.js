// app/utils/user.js - Optimized User Management Utilities
import AsyncStorage from "@react-native-async-storage/async-storage";

// Cache for user data to reduce AsyncStorage calls
let userDataCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds

// Storage keys as constants to prevent typos and enable better minification
const STORAGE_KEYS = Object.freeze({
  USER_ID: 'userId',
  ZIP: 'zip',
  ONBOARDED: 'onboarded',
  PRAYER: 'prayer',
});

// Optimized user ID generation with better entropy
const generateUserId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const performance = typeof performance !== 'undefined' ? performance.now() : Date.now();
  return `user_${timestamp}_${random}_${Math.floor(performance)}`;
};

// Cached user ID to prevent regeneration
let cachedUserId = null;

// Get or create user ID with caching
const getUserId = async () => {
  try {
    // Return cached ID if available
    if (cachedUserId) {
      return cachedUserId;
    }

    let userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
    
    if (!userId) {
      userId = generateUserId();
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId);
      console.log('Generated new user ID:', userId);
    }
    
    cachedUserId = userId;
    return userId;
  } catch (error) {
    console.error('Failed to get/create user ID:', error);
    // Return a temporary ID as fallback but don't cache it
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }
};

// Batch AsyncStorage operations for better performance
const batchAsyncStorageGet = async (keys) => {
  try {
    const results = await AsyncStorage.multiGet(keys);
    return results.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  } catch (error) {
    console.error('Failed to batch get from AsyncStorage:', error);
    return {};
  }
};

const batchAsyncStorageSet = async (keyValuePairs) => {
  try {
    const pairs = Object.entries(keyValuePairs).map(([key, value]) => [key, String(value)]);
    await AsyncStorage.multiSet(pairs);
  } catch (error) {
    console.error('Failed to batch set to AsyncStorage:', error);
    throw error;
  }
};

// Get user data with intelligent caching
const getUserData = async () => {
  try {
    const now = Date.now();
    
    // Return cached data if still valid
    if (userDataCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return userDataCache;
    }

    const userId = await getUserId();
    
    // Batch get remaining data
    const storageData = await batchAsyncStorageGet([
      STORAGE_KEYS.ZIP,
      STORAGE_KEYS.ONBOARDED,
    ]);

    const userData = {
      userId,
      zip: storageData[STORAGE_KEYS.ZIP] || null,
      isOnboarded: storageData[STORAGE_KEYS.ONBOARDED] === "true",
    };

    // Cache the result
    userDataCache = userData;
    cacheTimestamp = now;

    return userData;
  } catch (error) {
    console.error('Failed to get user data:', error);
    // Return fallback data without caching
    return {
      userId: `temp_${Date.now()}`,
      zip: null,
      isOnboarded: false,
    };
  }
};

// Update user data with cache invalidation and batch operations
const updateUserData = async (data) => {
  try {
    const updates = {};
    
    if (data.zip !== undefined) {
      updates[STORAGE_KEYS.ZIP] = String(data.zip);
    }
    
    if (data.onboarded !== undefined) {
      updates[STORAGE_KEYS.ONBOARDED] = String(data.onboarded);
    }
    
    if (data.userId !== undefined) {
      updates[STORAGE_KEYS.USER_ID] = String(data.userId);
      cachedUserId = String(data.userId); // Update cache
    }

    if (Object.keys(updates).length > 0) {
      await batchAsyncStorageSet(updates);
      
      // Invalidate cache to force refresh on next getUserData call
      userDataCache = null;
      cacheTimestamp = 0;
      
      console.log('User data updated:', data);
    }
  } catch (error) {
    console.error('Failed to update user data:', error);
    throw error;
  }
};

// Clear all user data with proper cleanup
const clearUserData = async () => {
  try {
    const keysToRemove = [
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.ZIP,
      STORAGE_KEYS.PRAYER,
    ];

    // Use multiRemove for better performance
    await AsyncStorage.multiRemove(keysToRemove);
    
    // Reset onboarded to false instead of removing
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDED, "false");
    
    // Clear caches
    userDataCache = null;
    cacheTimestamp = 0;
    cachedUserId = null;
    
    console.log('User data cleared');
  } catch (error) {
    console.error('Failed to clear user data:', error);
    throw error;
  }
};

// Validate user data integrity
const validateUserData = (userData) => {
  if (!userData || typeof userData !== 'object') {
    return false;
  }

  // Check required fields
  if (!userData.userId || typeof userData.userId !== 'string') {
    return false;
  }

  // Validate zip code format if present
  if (userData.zip !== null && !/^\d{5}$/.test(String(userData.zip))) {
    return false;
  }

  // Validate onboarded status
  if (typeof userData.isOnboarded !== 'boolean') {
    return false;
  }

  return true;
};

// Get user preferences with defaults
const getUserPreferences = async () => {
  try {
    const prefsString = await AsyncStorage.getItem('userPreferences');
    const preferences = prefsString ? JSON.parse(prefsString) : {};
    
    // Return preferences with defaults
    return {
      notifications: true,
      darkMode: true,
      realTimeUpdates: true,
      ...preferences,
    };
  } catch (error) {
    console.error('Failed to get user preferences:', error);
    // Return defaults on error
    return {
      notifications: true,
      darkMode: true,
      realTimeUpdates: true,
    };
  }
};

// Update user preferences
const updateUserPreferences = async (preferences) => {
  try {
    const currentPrefs = await getUserPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences };
    
    await AsyncStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
    console.log('User preferences updated:', preferences);
  } catch (error) {
    console.error('Failed to update user preferences:', error);
    throw error;
  }
};

// Check if user setup is complete
const isUserSetupComplete = async () => {
  try {
    const userData = await getUserData();
    return userData.isOnboarded && userData.zip !== null;
  } catch (error) {
    console.error('Failed to check user setup:', error);
    return false;
  }
};

// Export optimized user utilities
export const userUtils = Object.freeze({
  // Core functions
  generateUserId,
  getUserId,
  getUserData,
  updateUserData,
  clearUserData,
  
  // Utility functions
  validateUserData,
  getUserPreferences,
  updateUserPreferences,
  isUserSetupComplete,
  
  // Cache management
  clearCache: () => {
    userDataCache = null;
    cacheTimestamp = 0;
    cachedUserId = null;
  },
  
  // For testing/debugging
  __testing__: __DEV__ ? {
    userDataCache,
    cacheTimestamp,
    cachedUserId,
    STORAGE_KEYS,
    CACHE_DURATION,
  } : {},
});

// Auto-cleanup on app termination (if supported)
if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('beforeunload', () => {
    userUtils.clearCache();
  });
}

export default userUtils;