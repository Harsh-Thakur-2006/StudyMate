import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../contexts/ThemeContext";
import { useSafeArea } from "../hooks/useSafeArea";
import Card from "../components/Card";
import { SubjectService, SessionService } from "../services/StorageService";

const screenWidth = Dimensions.get("window").width;

export default function ProgressScreen() {
  const [studyData, setStudyData] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [streak, setStreak] = useState(0);
  const { colors, gradients } = useTheme();
  const { safeAreaStyle } = useSafeArea();

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    const sessions = await SessionService.getSessions();
    const subjects = await SubjectService.getSubjects();

    // Calculate total study time
    const totalMinutes = sessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );
    setTotalStudyTime((totalMinutes / 60).toFixed(1));

    // Calculate subject progress
    const subjectStats = subjects.map((subject) => {
      const subjectSessions = sessions.filter(
        (session) => session.subjectId === subject.id
      );
      const subjectMinutes = subjectSessions.reduce(
        (sum, session) => sum + session.duration,
        0
      );
      return {
        name: subject.name,
        minutes: subjectMinutes,
        sessions: subjectSessions.length,
        color: subject.color || colors.primary,
      };
    });
    setSubjectProgress(subjectStats);

    // Calculate streak (simplified)
    setStreak(sessions.length > 0 ? Math.min(sessions.length, 7) : 0);
  };

  return (
    <LinearGradient
      colors={gradients.background}
      style={[styles.container, safeAreaStyle]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView style={styles.scrollView}>
        {/* Study Stats Overview */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {totalStudyTime}h
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Total Study
            </Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.success }]}>
              {streak}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Day Streak
            </Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>
              {subjectProgress.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Subjects
            </Text>
          </Card>
        </View>

        {/* Subject Progress */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
            Subject Progress
          </Text>
          {subjectProgress.length > 0 ? (
            subjectProgress.map((subject, index) => (
              <View key={index} style={styles.subjectProgress}>
                <View style={styles.subjectInfo}>
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: subject.color },
                    ]}
                  />
                  <Text
                    style={[styles.subjectName, { color: colors.text.primary }]}
                  >
                    {subject.name}
                  </Text>
                </View>
                <View style={styles.progressInfo}>
                  <Text
                    style={[
                      styles.progressText,
                      { color: colors.text.secondary },
                    ]}
                  >
                    {subject.minutes} min
                  </Text>
                  <Text
                    style={[
                      styles.sessionsText,
                      { color: colors.text.tertiary },
                    ]}
                  >
                    {subject.sessions} sessions
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
              Add subjects and log study sessions to see progress
            </Text>
          )}
        </Card>

        {/* Study Distribution */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
            Study Distribution
          </Text>
          {subjectProgress.length > 0 ? (
            subjectProgress.map((subject, index) => (
              <View key={index} style={styles.distributionItem}>
                <View style={styles.distributionInfo}>
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: subject.color },
                    ]}
                  />
                  <Text
                    style={[styles.subjectName, { color: colors.text.primary }]}
                  >
                    {subject.name}
                  </Text>
                </View>
                <View style={styles.distributionBar}>
                  <View
                    style={[
                      styles.distributionFill,
                      {
                        backgroundColor: subject.color,
                        width: `${
                          (subject.minutes /
                            Math.max(
                              ...subjectProgress.map((s) => s.minutes)
                            )) *
                          100
                        }%`,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.distributionTime,
                    { color: colors.text.secondary },
                  ]}
                >
                  {subject.minutes}m
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
              No data available
            </Text>
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    padding: 15,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  subjectProgress: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  subjectInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: "500",
  },
  progressInfo: {
    alignItems: "flex-end",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
  },
  sessionsText: {
    fontSize: 12,
  },
  distributionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  distributionInfo: {
    flexDirection: "row",
    alignItems: "center",
    width: "30%",
  },
  distributionBar: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  distributionFill: {
    height: "100%",
    borderRadius: 4,
  },
  distributionTime: {
    fontSize: 12,
    fontWeight: "600",
    width: "15%",
    textAlign: "right",
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    padding: 20,
  },
});
