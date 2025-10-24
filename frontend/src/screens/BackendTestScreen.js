import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import GlassCard from "../components/Card";
import NeonButton from "../components/Button";
import { useTheme } from "../contexts/ThemeContext";
import { useSafeArea } from "../hooks/useSafeArea";
import { SyncService } from "../services/StorageService";
import { LinearGradient } from "expo-linear-gradient";

// Add this function to test network connectivity
const testNetworkConnectivity = async () => {
  const testUrls = [
    "http://localhost:8080/api/hello",
    "http://10.0.2.2:8080/api/hello", // Android emulator
    `http://${YOUR_ACTUAL_IP}:8080/api/hello`, // Your computer IP
  ];

  for (const url of testUrls) {
    try {
      console.log(`Testing: ${url}`);
      const response = await fetch(url);
      const data = await response.json();
      console.log(`✅ Success with: ${url}`, data);
      return url.replace("/hello", ""); // Return base URL
    } catch (error) {
      console.log(`❌ Failed with: ${url}`, error.message);
    }
  }
  throw new Error("No working URL found");
};

export default function BackendTestScreen() {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [backendEvents, setBackendEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { colors, gradients } = useTheme();
  const { safeAreaStyle } = useSafeArea();

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setLoading(true);
    try {
      const result = await SyncService.testBackendConnection();
      setConnectionStatus(result);
      if (result.connected) {
        await loadBackendEvents();
      }
    } catch (error) {
      setConnectionStatus({ connected: false, error: error.message });
    }
    setLoading(false);
  };

  const loadBackendEvents = async () => {
    try {
      const events = await SyncService.syncEventsFromBackend();
      setBackendEvents(events);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  const createTestEvent = async () => {
    setLoading(true);
    try {
      const eventData = {
        name: "Test Study Session",
        eventDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        description: "Automated test event from React Native app",
      };

      await SyncService.createEventInBackend(eventData);
      Alert.alert("Success", "Test event created in backend!");
      await loadBackendEvents();
    } catch (error) {
      Alert.alert("Error", `Failed to create event: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <LinearGradient
      colors={gradients.background}
      style={[styles.container, safeAreaStyle]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Connection Status */}
        <GlassCard>
          <Text style={styles.cardTitle}>Connection Status</Text>
          {connectionStatus ? (
            <View
              style={[
                styles.statusContainer,
                connectionStatus.connected
                  ? styles.statusConnected
                  : styles.statusError,
              ]}
            >
              <Text style={styles.statusText}>
                {connectionStatus.connected
                  ? "✅ Connected"
                  : "❌ Disconnected"}
              </Text>
              {connectionStatus.data && (
                <Text style={styles.statusMessage}>
                  {connectionStatus.data.message}
                </Text>
              )}
              {connectionStatus.error && (
                <Text style={styles.statusErrorText}>
                  Error: {connectionStatus.error}
                </Text>
              )}
            </View>
          ) : (
            <Text style={styles.loadingText}>Testing connection...</Text>
          )}
        </GlassCard>

        {/* Test Actions */}
        <GlassCard>
          <Text style={styles.cardTitle}>Test Actions</Text>
          <NeonButton
            title="Test Connection"
            onPress={testConnection}
            color="#00ffff"
            style={styles.testButton}
            disabled={loading}
          />
          <NeonButton
            title="Create Test Event"
            onPress={createTestEvent}
            color="#00ff88"
            style={styles.testButton}
            disabled={loading || !connectionStatus?.connected}
          />
          <NeonButton
            title="Refresh Events"
            onPress={loadBackendEvents}
            color="#ffaa00"
            style={styles.testButton}
            disabled={loading || !connectionStatus?.connected}
          />
        </GlassCard>

        {/* Backend Events */}
        <GlassCard>
          <Text style={styles.cardTitle}>
            Backend Events ({backendEvents.length})
          </Text>
          {backendEvents.length > 0 ? (
            backendEvents.map((event) => (
              <View key={event.id} style={styles.eventItem}>
                <Text style={styles.eventName}>{event.name}</Text>
                <Text style={styles.eventDate}>
                  {new Date(event.eventDate).toLocaleDateString()}
                </Text>
                <Text style={styles.eventDescription}>{event.description}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No events in backend</Text>
          )}
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 30,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#888888",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#424242ff",
    marginBottom: 15,
  },
  statusContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  statusConnected: {
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderColor: "#00ff88",
    borderWidth: 1,
  },
  statusError: {
    backgroundColor: "rgba(255, 68, 68, 0.1)",
    borderColor: "#ff4444",
    borderWidth: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4e4e4eff",
    marginBottom: 5,
  },
  statusMessage: {
    fontSize: 14,
    color: "#cccccc",
  },
  statusErrorText: {
    fontSize: 14,
    color: "#ff8888",
  },
  loadingText: {
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
    padding: 20,
  },
  testButton: {
    marginBottom: 10,
  },
  eventItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 10,
  },
  eventName: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: "#00ff88",
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 12,
    color: "#888888",
  },
  emptyText: {
    fontSize: 14,
    color: "#888888",
    fontStyle: "italic",
    textAlign: "center",
    padding: 20,
  },
});
