import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useSafeArea } from "../hooks/useSafeArea";
import Card from "../components/Card";
import Button from "../components/Button";
import {
  SubjectService,
  SessionService,
  GoalService,
} from "../services/StorageService";

const screenWidth = Dimensions.get("window").width;

export default function ProgressScreen() {
  const [studyData, setStudyData] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [goals, setGoals] = useState([]);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [streak, setStreak] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const { colors, gradients } = useTheme();
  const { safeAreaStyle } = useSafeArea();

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    const [sessions, subjects, loadedGoals] = await Promise.all([
      SessionService.getSessions(),
      SubjectService.getSubjects(),
      GoalService.getGoals(),
    ]);

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
      const progress =
        subject.targetHours > 0
          ? (subject.completedHours / subject.targetHours) * 100
          : 0;

      return {
        name: subject.name,
        minutes: subjectMinutes,
        hours: (subjectMinutes / 60).toFixed(1),
        sessions: subjectSessions.length,
        color: subject.color || colors.primary,
        progress: progress,
        targetHours: subject.targetHours || 0,
        completedHours: subject.completedHours || 0,
      };
    });
    setSubjectProgress(subjectStats);
    setGoals(loadedGoals);

    // Calculate streak (simplified)
    const today = new Date().toDateString();
    const uniqueDates = [
      ...new Set(sessions.map((s) => new Date(s.date).toDateString())),
    ];
    setStreak(uniqueDates.length);
  };

  const getWeeklyData = () => {
    return [
      { day: "Mon", hours: 2.5 },
      { day: "Tue", hours: 3.0 },
      { day: "Wed", hours: 1.5 },
      { day: "Thu", hours: 2.0 },
      { day: "Fri", hours: 4.0 },
      { day: "Sat", hours: 1.0 },
      { day: "Sun", hours: 2.5 },
    ];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "subjects":
        return renderSubjectsTab();
      case "goals":
        return renderGoalsTab();
      default:
        return renderOverviewTab();
    }
  };

  const renderOverviewTab = () => (
    <View>
      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Ionicons name="time-outline" size={24} color={colors.primary} />
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {totalStudyTime}h
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
            Total Study
          </Text>
        </Card>

        <Card style={styles.statCard}>
          <Ionicons name="flame-outline" size={24} color={colors.success} />
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {streak}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
            Day Streak
          </Text>
        </Card>

        <Card style={styles.statCard}>
          <Ionicons name="book-outline" size={24} color={colors.accent} />
          <Text style={[styles.statNumber, { color: colors.accent }]}>
            {subjectProgress.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
            Subjects
          </Text>
        </Card>
      </View>

      {/* Weekly Study Chart */}
      <Card>
        <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
          Weekly Study Hours
        </Text>
        <View style={styles.chartContainer}>
          {getWeeklyData().map((day, index) => (
            <View key={index} style={styles.chartBarContainer}>
              <View style={styles.chartBarWrapper}>
                <View
                  style={[
                    styles.chartBar,
                    {
                      height: `${(day.hours / 4) * 100}%`,
                      backgroundColor: colors.primary,
                      maxHeight: 120,
                    },
                  ]}
                />
              </View>
              <Text
                style={[styles.chartLabel, { color: colors.text.secondary }]}
              >
                {day.day}
              </Text>
              <Text style={[styles.chartValue, { color: colors.text.primary }]}>
                {day.hours}h
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );

  const renderSubjectsTab = () => (
    <View>
      <Card>
        <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
          Subject Progress
        </Text>
        {subjectProgress.length > 0 ? (
          subjectProgress.map((subject, index) => (
            <View key={index} style={styles.subjectProgressItem}>
              <View style={styles.subjectInfo}>
                <View
                  style={[styles.colorDot, { backgroundColor: subject.color }]}
                />
                <View style={styles.subjectDetails}>
                  <Text
                    style={[styles.subjectName, { color: colors.text.primary }]}
                  >
                    {subject.name}
                  </Text>
                  <Text
                    style={[
                      styles.subjectStats,
                      { color: colors.text.secondary },
                    ]}
                  >
                    {subject.sessions} sessions • {subject.hours}h
                  </Text>
                </View>
              </View>
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: colors.glass.border },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(subject.progress, 100)}%`,
                        backgroundColor:
                          subject.progress >= 100
                            ? colors.success
                            : colors.primary,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.progressText,
                    { color: colors.text.secondary },
                  ]}
                >
                  {subject.progress.toFixed(0)}%
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
            No study data available
          </Text>
        )}
      </Card>
    </View>
  );

  const renderGoalsTab = () => (
    <View>
      <Card>
        <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
          Goals Progress
        </Text>
        {goals.length > 0 ? (
          goals.map((goal) => {
            const progress =
              goal.targetHours > 0
                ? (goal.completedHours / goal.targetHours) * 100
                : 0;
            return (
              <View key={goal.id} style={styles.goalProgressItem}>
                <View style={styles.goalInfo}>
                  <Text
                    style={[styles.goalName, { color: colors.text.primary }]}
                  >
                    {goal.title}
                  </Text>
                  <Text
                    style={[
                      styles.goalProgressText,
                      { color: colors.text.secondary },
                    ]}
                  >
                    {goal.completedHours.toFixed(1)}h / {goal.targetHours}h
                  </Text>
                </View>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: colors.glass.border },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor:
                          progress >= 100 ? colors.success : colors.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })
        ) : (
          <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
            No goals set yet
          </Text>
        )}
      </Card>
    </View>
  );

  return (
    <LinearGradient
      colors={gradients.background}
      style={[styles.container, safeAreaStyle]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView style={styles.scrollView}>
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "overview" && styles.activeTab,
              { borderColor: colors.primary },
            ]}
            onPress={() => setActiveTab("overview")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "overview"
                      ? colors.primary
                      : colors.text.secondary,
                },
              ]}
            >
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "subjects" && styles.activeTab,
              { borderColor: colors.primary },
            ]}
            onPress={() => setActiveTab("subjects")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "subjects"
                      ? colors.primary
                      : colors.text.secondary,
                },
              ]}
            >
              Subjects
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "goals" && styles.activeTab,
              { borderColor: colors.primary },
            ]}
            onPress={() => setActiveTab("goals")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "goals"
                      ? colors.primary
                      : colors.text.secondary,
                },
              ]}
            >
              Goals
            </Text>
          </TouchableOpacity>
        </View>

        {renderTabContent()}

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
    padding: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
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
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 160,
    paddingHorizontal: 10,
  },
  chartBarContainer: {
    alignItems: "center",
    flex: 1,
  },
  chartBarWrapper: {
    height: 120,
    justifyContent: "flex-end",
    marginBottom: 5,
  },
  chartBar: {
    width: 20,
    borderRadius: 10,
    minHeight: 10,
  },
  chartLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 10,
    fontWeight: "600",
  },
  subjectProgressItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
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
    marginRight: 12,
  },
  subjectDetails: {
    flex: 1,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  subjectStats: {
    fontSize: 12,
  },
  progressContainer: {
    alignItems: "flex-end",
    width: 80,
  },
  progressBar: {
    height: 6,
    width: "100%",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
  },
  goalProgressItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  goalInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  goalName: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  goalProgressText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    padding: 20,
  },
  bottomPadding: {
    height: 30,
  },
});
