import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useSafeArea } from "../hooks/useSafeArea";
import { LinearGradient } from "expo-linear-gradient";
import { Alert } from "react-native";
import Card from "../components/Card";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import {
  SubjectService,
  SessionService,
  SyncService,
} from "../services/StorageService";

export default function TimetableScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { colors, gradients } = useTheme();
  const { safeAreaStyle } = useSafeArea();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const backendEvents = await SyncService.syncEventsFromBackend();
      setEvents(backendEvents);
    } catch (error) {
      console.error("Error loading events:", error);
    }
    setLoading(false);
  };

  const createSampleEvent = async () => {
    try {
      const eventData = {
        name: "Math Study Session",
        eventDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        description: "Chapter 5 - Calculus",
        subject: "Mathematics",
        eventType: "STUDY",
        duration: 120,
        priority: 2,
      };

      await SyncService.createEventInBackend(eventData);
      Alert.alert("Success", "Sample event created!");
      loadEvents();
    } catch (error) {
      Alert.alert("Error", `Failed to create event: ${error.message}`);
    }
  };

  const groupEventsByDate = (events) => {
    const grouped = {};
    events.forEach((event) => {
      const date = new Date(event.eventDate).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate(events);

  return (
    <LinearGradient
      colors={gradients.background}
      style={[styles.container, safeAreaStyle]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView style={styles.scrollView}>
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
            Study Timetable
          </Text>

          <View style={styles.actionsContainer}>
            <Button
              title="Refresh Events"
              onPress={loadEvents}
              color="primary"
              style={styles.actionButton}
              loading={loading}
            />
            <Button
              title="Add Sample Event"
              onPress={createSampleEvent}
              color="secondary"
              style={styles.actionButton}
            />
          </View>

          {events.length > 0 ? (
            Object.entries(groupedEvents).map(([date, dayEvents]) => (
              <View key={date} style={styles.daySection}>
                <Text style={[styles.dateHeader, { color: colors.primary }]}>
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                {dayEvents.map((event) => (
                  <View key={event.id} style={styles.eventItem}>
                    <View style={styles.eventTime}>
                      <Text
                        style={[
                          styles.eventTimeText,
                          { color: colors.text.primary },
                        ]}
                      >
                        {new Date(event.eventDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                    <View style={styles.eventDetails}>
                      <Text
                        style={[
                          styles.eventName,
                          { color: colors.text.primary },
                        ]}
                      >
                        {event.name}
                      </Text>
                      <Text
                        style={[
                          styles.eventDescription,
                          { color: colors.text.secondary },
                        ]}
                      >
                        {event.description}
                      </Text>
                      <View style={styles.eventMeta}>
                        {event.subject && (
                          <Text
                            style={[
                              styles.eventMetaText,
                              { color: colors.accent },
                            ]}
                          >
                            {event.subject}
                          </Text>
                        )}
                        {event.duration && (
                          <Text
                            style={[
                              styles.eventMetaText,
                              { color: colors.text.tertiary },
                            ]}
                          >
                            {event.duration} min
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="calendar-outline"
                size={60}
                color={colors.text.tertiary}
              />
              <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                No Events Scheduled
              </Text>
              <Text
                style={[styles.emptyText, { color: colors.text.secondary }]}
              >
                {loading
                  ? "Loading events..."
                  : "Create events to see them in your timetable"}
              </Text>
              <Button
                title="Add Sample Event"
                onPress={createSampleEvent}
                color="primary"
                style={styles.emptyButton}
              />
            </View>
          )}
        </Card>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  daySection: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  eventItem: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  eventTime: {
    width: 60,
    marginRight: 15,
  },
  eventTimeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  eventDetails: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventMetaText: {
    fontSize: 12,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  emptyButton: {
    width: "80%",
  },
});
