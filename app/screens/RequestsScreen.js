import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
  ScrollView,
  AppState,
} from "react-native";
import { useState, useEffect, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import backgroundimage from "../../assets/image_33.jpg";
import { prayerAPI, errorHandler } from "../config/api.js";
import { userUtils } from "../utils/user.js";

export default function RequestsScreen({ navigation }) {
  const [prayers, setPrayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userZip, setUserZip] = useState("");
  const [error, setError] = useState("");
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [newPrayersCount, setNewPrayersCount] = useState(0);
  const [isRealTimeActive, setIsRealTimeActive] = useState(true);

  // Refs for managing intervals and app state
  const pollIntervalRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const lastFetchTimeRef = useRef(null);
  const mountedRef = useRef(true);

  // Real-time polling configuration
  const POLL_INTERVAL = 15000; // Poll every 15 seconds
  const BACKGROUND_POLL_INTERVAL = 60000; // Poll every minute in background
  const MAX_RETRIES = 3;

  // Fetch prayers from database with real-time capabilities
  const fetchPrayersFromDatabase = async (showLoading = true, isBackgroundFetch = false) => {
    try {
      if (showLoading && !isBackgroundFetch) setIsLoading(true);
      if (!isBackgroundFetch) setError("");

      console.log(`[RealTime] Fetching prayers - Background: ${isBackgroundFetch}`);

      // Get user's zip code
      const userData = await userUtils.getUserData();
      
      if (!userData.zip) {
        if (!isBackgroundFetch) {
          setError("Please set your zip code in Settings to view local prayers");
        }
        return;
      }

      setUserZip(userData.zip);

      // Fetch prayers from database by zip code
      console.log(`[RealTime] Fetching prayers for zip: ${userData.zip}`);
      const response = await prayerAPI.getByZip(userData.zip);
      
      console.log(`[RealTime] API Response:`, response);
      
      // Handle the response data properly
      let prayersData = [];
      if (Array.isArray(response)) {
        prayersData = response;
      } else if (response.data && Array.isArray(response.data)) {
        prayersData = response.data;
      } else if (response && typeof response === 'object') {
        prayersData = [response];
      }
      
      if (prayersData.length > 0) {
        const currentTime = new Date().toISOString();
        
        // Sort prayers by timestamp (newest first) - using your database field names
        const sortedPrayers = prayersData.sort((a, b) => {
          const timeA = new Date(a.createdAt || a.created_at || 0);
          const timeB = new Date(b.createdAt || b.created_at || 0);
          return timeB - timeA; // Newest first
        });

        // Check for new prayers since last fetch
        if (lastFetchTimeRef.current && isRealTimeActive) {
          const newPrayers = sortedPrayers.filter(prayer => {
            const prayerTime = new Date(prayer.createdAt || prayer.created_at);
            return prayerTime > new Date(lastFetchTimeRef.current);
          });
          
          if (newPrayers.length > 0 && !isBackgroundFetch) {
            setNewPrayersCount(prev => prev + newPrayers.length);
            console.log(`[RealTime] Found ${newPrayers.length} new prayers`);
          }
        }

        // Only update if component is still mounted
        if (mountedRef.current) {
          setPrayers(sortedPrayers);
          setLastUpdateTime(currentTime);
          lastFetchTimeRef.current = currentTime;
        }

        console.log(`[RealTime] Loaded ${sortedPrayers.length} prayers for zip ${userData.zip}`);
        console.log(`[RealTime] Sample prayer:`, sortedPrayers[0]);
      } else {
        if (mountedRef.current) {
          setPrayers([]);
        }
        console.log(`[RealTime] No prayers found for zip ${userData.zip}`);
      }
    } catch (error) {
      console.error('[RealTime] Failed to fetch prayers:', error);
      
      if (!isBackgroundFetch && mountedRef.current) {
        setError(errorHandler.getErrorMessage(error));
        setPrayers([]);
      }
    } finally {
      if (!isBackgroundFetch && mountedRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  };

  // Setup real-time polling
  const startRealTimePolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    const interval = appStateRef.current === 'active' ? POLL_INTERVAL : BACKGROUND_POLL_INTERVAL;
    
    pollIntervalRef.current = setInterval(() => {
      if (mountedRef.current && isRealTimeActive) {
        const isBackground = appStateRef.current !== 'active';
        fetchPrayersFromDatabase(false, isBackground);
      }
    }, interval);

    console.log(`[RealTime] Started polling every ${interval/1000} seconds`);
  }, [isRealTimeActive]);

  // Stop real-time polling
  const stopRealTimePolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
      console.log('[RealTime] Stopped polling');
    }
  }, []);

  // Handle app state changes (background/foreground)
  const handleAppStateChange = useCallback((nextAppState) => {
    console.log(`[RealTime] App state changed: ${appStateRef.current} -> ${nextAppState}`);
    
    if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
      // App came to foreground - fetch immediately and restart polling
      console.log('[RealTime] App came to foreground - refreshing data');
      fetchPrayersFromDatabase(false, false);
      if (isRealTimeActive) {
        startRealTimePolling();
      }
    }
    
    appStateRef.current = nextAppState;
    
    // Restart polling with appropriate interval
    if (isRealTimeActive) {
      startRealTimePolling();
    }
  }, [startRealTimePolling, isRealTimeActive]);

  // Handle manual refresh with real-time reset
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setNewPrayersCount(0);
    fetchPrayersFromDatabase(false, false);
  }, []);

  // Toggle real-time updates
  const toggleRealTimeUpdates = useCallback(() => {
    setIsRealTimeActive(prev => {
      const newState = !prev;
      if (newState) {
        startRealTimePolling();
      } else {
        stopRealTimePolling();
      }
      return newState;
    });
  }, [startRealTimePolling, stopRealTimePolling]);

  // Format timestamp for display with real-time awareness
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Recently";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  // Truncate long prayer text for feed display
  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Handle prayer item press
  const handlePrayerPress = (prayer) => {
    setSelectedPrayer(prayer);
    setModalVisible(true);
    
    // Mark as viewed (could be sent to analytics)
    console.log(`[RealTime] Prayer viewed: ${prayer.id || 'unknown'}`);
  };

  // Clear new prayers notification
  const clearNewPrayersNotification = useCallback(() => {
    setNewPrayersCount(0);
  }, []);

  // Render real-time status indicator
  const renderRealTimeStatus = () => (
    <View style={styles.realTimeStatus}>
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusDot, 
          { backgroundColor: isRealTimeActive ? '#4CAF50' : '#999' }
        ]} />
        <Text style={styles.statusText}>
          {isRealTimeActive ? 'Live updates' : 'Manual refresh'}
        </Text>
        {lastUpdateTime && (
          <Text style={styles.lastUpdateText}>
            Last: {formatTimestamp(lastUpdateTime)}
          </Text>
        )}
      </View>
      
      {newPrayersCount > 0 && (
        <TouchableOpacity 
          style={styles.newPrayersNotification}
          onPress={clearNewPrayersNotification}
        >
          <Text style={styles.newPrayersText}>
            {newPrayersCount} new prayer{newPrayersCount !== 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Render individual prayer item with real-time indicators - Updated for database fields
  const renderPrayerItem = ({ item, index }) => {
    const isRecent = lastFetchTimeRef.current && 
      new Date(item.createdAt || item.created_at) > 
      new Date(Date.now() - 5 * 60 * 1000); // Less than 5 minutes old

    // Extract prayer text from your database field names
    const prayerText = item.prayerText || item.prayer || item.text || "Prayer request";
    const timestamp = item.createdAt || item.created_at;

    return (
      <TouchableOpacity 
        style={[
          styles.prayerItem,
          isRecent && styles.recentPrayerItem
        ]} 
        onPress={() => handlePrayerPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.prayerHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>🙏</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Community Member</Text>
              <Text style={styles.timestamp}>
                {formatTimestamp(timestamp)} • Zip {item.zip || userZip}
              </Text>
            </View>
          </View>
          <View style={styles.badges}>
            {isRecent && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
            <View style={styles.prayerBadge}>
              <Text style={styles.prayerBadgeText}>Prayer Request</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.prayerContent}>
          <Text style={styles.prayerText}>
            {truncateText(prayerText, 150)}
          </Text>
          {prayerText.length > 150 && (
            <Text style={styles.readMore}>Read more...</Text>
          )}
        </View>
        
        <View style={styles.prayerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>🤲 Pray</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>💙 Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>🔗 Share</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🙏</Text>
      <Text style={styles.emptyStateTitle}>No Prayer Requests Yet</Text>
      <Text style={styles.emptyStateText}>
        {userZip 
          ? `Be the first to share a prayer request in the ${userZip} area, or check back later for community updates.`
          : "Set your zip code in Settings to view and connect with local prayer requests."
        }
      </Text>
      {!userZip && (
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={styles.settingsButtonText}>Go to Settings</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Render error state
  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorStateIcon}>⚠️</Text>
      <Text style={styles.errorStateTitle}>Unable to Load Prayers</Text>
      <Text style={styles.errorStateText}>{error}</Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={() => fetchPrayersFromDatabase(true, false)}
      >
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  // Back button handler
  const backPressed = () => {
    navigation.navigate("Home");
  };

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      stopRealTimePolling();
    };
  }, [stopRealTimePolling]);

  // Setup app state listener
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [handleAppStateChange]);

  // Initial load and start real-time updates
  useEffect(() => {
    // Initial fetch
    fetchPrayersFromDatabase(true, false);
    
    // Start real-time polling after initial load
    const startPollingTimer = setTimeout(() => {
      if (mountedRef.current && isRealTimeActive) {
        startRealTimePolling();
      }
    }, 2000); // Wait 2 seconds after initial load

    return () => clearTimeout(startPollingTimer);
  }, [startRealTimePolling, isRealTimeActive]);

  // Handle navigation focus/blur for real-time updates
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      console.log('[RealTime] Screen focused - starting updates');
      setIsRealTimeActive(true);
      fetchPrayersFromDatabase(false, false);
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      console.log('[RealTime] Screen blurred - stopping updates');
      setIsRealTimeActive(false);
      stopRealTimePolling();
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation, stopRealTimePolling]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgroundimage}
        resizeMode="stretch"
        style={styles.backgroundimage}
      >
        <StatusBar style="light" />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Local Prayer Requests</Text>
            {userZip && (
              <Text style={styles.subtitle}>Community prayers in {userZip}</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.realTimeToggle}
            onPress={toggleRealTimeUpdates}
          >
            <Text style={styles.realTimeToggleText}>
              {isRealTimeActive ? '🔴 LIVE' : '⚫ MANUAL'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Real-time Status */}
        {renderRealTimeStatus()}

        {/* Content */}
        <View style={styles.content}>
          {isLoading && !isRefreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Loading prayers from database...</Text>
            </View>
          ) : error && prayers.length === 0 ? (
            renderErrorState()
          ) : prayers.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={prayers}
              renderItem={renderPrayerItem}
              keyExtractor={(item, index) => `${item.id || item._id || index}-${item.timestamp || index}`}
              contentContainerStyle={styles.feedContainer}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  colors={['#fff']}
                  tintColor="#fff"
                />
              }
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              onScrollBeginDrag={clearNewPrayersNotification}
            />
          )}
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={backPressed}
          >
            <Text style={styles.backButtonText}>BACK TO HOME</Text>
          </TouchableOpacity>
        </View>

        {/* Prayer Detail Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Prayer Request</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              {selectedPrayer && (
                <ScrollView style={styles.modalBody}>
                  <View style={styles.modalPrayerHeader}>
                    <Text style={styles.modalTimestamp}>
                      {formatTimestamp(selectedPrayer.createdAt || selectedPrayer.created_at)}
                    </Text>
                    <Text style={styles.modalPrayerId}>
                      Prayer ID: {selectedPrayer.id}
                    </Text>
                  </View>
                  
                  <Text style={styles.modalPrayerText}>
                    {selectedPrayer.prayerText || selectedPrayer.prayer || selectedPrayer.text || "Prayer request"}
                  </Text>
                  
                  <View style={styles.modalActions}>
                    <TouchableOpacity style={styles.modalActionButton}>
                      <Text style={styles.modalActionText}>🤲 I'm Praying</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalActionButton}>
                      <Text style={styles.modalActionText}>💙 Send Support</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#3e3e3e",
    paddingTop: StatusBar.currentHeight || 0,
  },
  backgroundimage: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 2,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  realTimeToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  realTimeToggleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  realTimeStatus: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    marginRight: 10,
  },
  lastUpdateText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
  },
  newPrayersNotification: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newPrayersText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  feedContainer: {
    paddingBottom: 20,
  },
  prayerItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recentPrayerItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  },
  prayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 18,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  badges: {
    alignItems: 'flex-end',
  },
  newBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  prayerBadge: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  prayerBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  prayerContent: {
    marginBottom: 12,
  },
  prayerText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  readMore: {
    color: '#007AFF',
    fontSize: 14,
    marginTop: 5,
    fontWeight: '500',
  },
  prayerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  emptyStateTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  emptyStateText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  settingsButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  settingsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorStateIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  errorStateTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  errorStateText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSection: {
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  backButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles remain the same...
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    maxHeight: '80%',
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  modalBody: {
    padding: 20,
  },
  modalPrayerHeader: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTimestamp: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  modalPrayerId: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  modalPrayerText: {
    fontSize: 18,
    lineHeight: 26,
    color: '#333',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modalActionButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  modalActionText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
  },
};