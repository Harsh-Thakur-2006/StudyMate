import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/ThemeContext";
import { useSafeArea } from "../hooks/useSafeArea";
import { LinearGradient } from "expo-linear-gradient";

// Import updated components
import Card from "../components/Card";
import Button from "../components/Button";
import StatCard from "../components/StatCard";
import { SubjectService, SessionService } from "../services/StorageService";

export default function DashboardScreen() {
  const [subjectsCount, setSubjectsCount] = useState(0);
  const [todayHours, setTodayHours] = useState(0);
  const [progress, setProgress] = useState(0);
  const [recentSessions, setRecentSessions] = useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { safeAreaStyle } = useSafeArea();
  const { colors, gradients } = useTheme();

  useEffect(() => {
    if (isFocused) {
      loadDashboardData();
    }
  }, [isFocused]);

  const loadDashboardData = async () => {
    const subjects = await SubjectService.getSubjects();
    const sessions = await SessionService.getSessions();

    setSubjectsCount(subjects.length);

    // Calculate today's study hours
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(
      (session) => new Date(session.date).toDateString() === today
    );
    const totalMinutes = todaySessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );
    setTodayHours((totalMinutes / 60).toFixed(1));

    // Simple progress calculation
    setProgress(subjects.length > 0 ? Math.min(subjects.length * 10, 100) : 0);

    // Get recent sessions with subject names
    const sortedSessions = sessions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const recentSessionsWithSubjects = await Promise.all(
      sortedSessions.slice(0, 3).map(async (session) => {
        const subject = await SubjectService.getSubjectById(session.subjectId);
        return {
          ...session,
          subjectName: subject ? subject.name : "Unknown Subject",
        };
      })
    );
    setRecentSessions(recentSessionsWithSubjects);
  };

  const handleLogStudy = () => {
    navigation.navigate("Subjects", { screen: "LogStudy" });
  };

  const handleAddSubject = () => {
    navigation.navigate("Subjects");
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
        {/* Header is now handled by App.js */}

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <StatCard number={todayHours} label="Today's Hours" color="accent" />
          <StatCard number={subjectsCount} label="Subjects" color="secondary" />
          <StatCard number={`${progress}%`} label="Progress" color="success" />
        </View>

        {/* Quick Actions */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
            Quick Actions
          </Text>
          <View style={styles.buttonRow}>
            <Button
              title="Add Subject"
              onPress={handleAddSubject}
              color="primary"
              style={styles.flexButton}
            />
            <Button
              title="Log Study"
              onPress={handleLogStudy}
              color="secondary"
              style={styles.flexButton}
            />
          </View>
          <View style={styles.buttonRow}>
            <Button
              title="Schedule"
              onPress={() => navigation.navigate("Timetable")}
              color="accent"
              style={styles.flexButton}
            />
            <Button
              title="View Progress"
              onPress={() => navigation.navigate("Progress")}
              color="success"
              style={styles.flexButton}
            />
          </View>
        </Card>

        {/* Recent Activity */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
            Recent Activity
          </Text>
          {recentSessions.length > 0 ? (
            recentSessions.map((session) => (
              <View key={session.id} style={styles.sessionItem}>
                <View style={styles.sessionInfo}>
                  <Text
                    style={[
                      styles.sessionSubject,
                      { color: colors.text.primary },
                    ]}
                  >
                    {session.subjectName}
                  </Text>
                  <Text
                    style={[
                      styles.sessionNotes,
                      { color: colors.text.secondary },
                    ]}
                  >
                    {session.notes || "No notes"}
                  </Text>
                  <Text
                    style={[
                      styles.sessionDate,
                      { color: colors.text.tertiary },
                    ]}
                  >
                    {new Date(session.date).toLocaleDateString()} at{" "}
                    {new Date(session.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
                <Text
                  style={[styles.sessionDuration, { color: colors.success }]}
                >
                  {session.duration} min
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
              No recent study sessions. Start studying to see your activity
              here!
            </Text>
          )}
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
            Upcoming Sessions
          </Text>
          <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
            No upcoming sessions scheduled
          </Text>
        </Card>

        {/* Add bottom padding */}
        <View style={styles.bottomPadding} />
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
  },
  scrollContent: {
    paddingBottom: 30,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    padding: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  flexButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  sessionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  sessionInfo: {
    flex: 1,
    marginRight: 10,
  },
  sessionSubject: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  sessionNotes: {
    fontSize: 12,
    marginBottom: 2,
  },
  sessionDate: {
    fontSize: 11,
  },
  sessionDuration: {
    fontSize: 14,
    fontWeight: "bold",
    minWidth: 60,
    textAlign: "right",
  },
  bottomPadding: {
    height: 30,
  },
});
