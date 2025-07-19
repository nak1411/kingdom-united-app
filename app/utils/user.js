import AsyncStorage from "@react-native-async-storage/async-storage";

// User management utilities
export const userUtils = {
  // Generate a unique user ID
  generateUserId: () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `user_${timestamp}_${random}`;
  },

  // Get or create user ID
  getUserId: async () => {
    try {
      let userId = await AsyncStorage.getItem("userId");
      
      if (!userId) {
        userId = userUtils.generateUserId();
        await AsyncStorage.setItem("userId", userId);
        console.log('Generated new user ID:', userId);
      }
      
      return userId;
    } catch (error) {
      console.error('Failed to get/create user ID:', error);
      // Return a temporary ID as fallback
      return `temp_${Date.now()}`;
    }
  },

  // Get user data (zip, userId, etc.)
  getUserData: async () => {
    try {
      const [userId, zip, onboarded] = await Promise.all([
        userUtils.getUserId(),
        AsyncStorage.getItem("zip"),
        AsyncStorage.getItem("onboarded"),
      ]);

      return {
        userId,
        zip: zip || null,
        isOnboarded: onboarded === "true",
      };
    } catch (error) {
      console.error('Failed to get user data:', error);
      return {
        userId: `temp_${Date.now()}`,
        zip: null,
        isOnboarded: false,
      };
    }
  },

  // Update user data
  updateUserData: async (data) => {
    try {
      const updates = [];
      
      if (data.zip !== undefined) {
        updates.push(AsyncStorage.setItem("zip", String(data.zip)));
      }
      
      if (data.onboarded !== undefined) {
        updates.push(AsyncStorage.setItem("onboarded", String(data.onboarded)));
      }
      
      if (data.userId !== undefined) {
        updates.push(AsyncStorage.setItem("userId", String(data.userId)));
      }

      await Promise.all(updates);
      console.log('User data updated:', data);
    } catch (error) {
      console.error('Failed to update user data:', error);
      throw error;
    }
  },

  // Clear all user data (for logout/reset)
  clearUserData: async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem("userId"),
        AsyncStorage.removeItem("zip"),
        AsyncStorage.removeItem("prayer"),
        AsyncStorage.setItem("onboarded", "false"),
      ]);
      console.log('User data cleared');
    } catch (error) {
      console.error('Failed to clear user data:', error);
      throw error;
    }
  },
};