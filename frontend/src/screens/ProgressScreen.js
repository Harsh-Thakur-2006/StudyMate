import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useSafeArea } from '../hooks/useSafeArea';
import Card from '../components/Card';
import { SubjectService, SessionService } from '../services/StorageService';
import { LineChart, BarChart, ProgressChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function ProgressScreen() {
  const [studyData, setStudyData] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [streak, setStreak] = useState(0);
  const { colors } = useTheme();
  const { safeAreaStyle } = useSafeArea();

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    const sessions = await SessionService.getSessions();
    const subjects = await SubjectService.getSubjects();

    // Calculate total study time
    const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
    setTotalStudyTime((totalMinutes / 60).toFixed(1));

    // Calculate subject progress
    const subjectStats = await Promise.all(
      subjects.map(async (subject) => {
        const subjectSessions = sessions.filter(session => session.subjectId === subject.id);
        const subjectMinutes = subjectSessions.reduce((sum, session) => sum + session.duration, 0);
        return {
          name: subject.name,
          minutes: subjectMinutes,
          sessions: subjectSessions.length,
          color: subject.color || colors.primary,
        };
      })
    );
    setSubjectProgress(subjectStats);

    // Calculate weekly data (simplified)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    }).reverse();

    const weeklyData = last7Days.map(day => {
      const daySessions = sessions.filter(session =>
        new Date(session.date).toDateString() === day
      );
      return daySessions.reduce((sum, session) => sum + session.duration, 0) / 60; // Convert to hours
    });

    setStudyData(weeklyData);

    // Calculate streak (simplified)
    setStreak(calculateStreak(sessions));
  };

  const calculateStreak = (sessions) => {
    // Simple streak calculation - in real app, use proper date logic
    return sessions.length > 0 ? Math.min(sessions.length, 7) : 0;
  };

  const chartConfig = {
    backgroundColor: colors.glass.background,
    backgroundGradientFrom: colors.glass.background,
    backgroundGradientTo: colors.glass.background,
    decimalPlaces: 1,
    color: (opacity = 1) => colors.primary,
    labelColor: (opacity = 1) => colors.text.primary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.accent,
    },
  };

  return (
    <ScrollView style={[styles.container, safeAreaStyle]}>
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

      {/* Weekly Study Chart */}
      <Card>
        <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
          Weekly Study Hours
        </Text>
        {studyData.length > 0 ? (
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{ data: studyData }],
            }}
            width={screenWidth - 80}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        ) : (
          <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
            No study data available yet
          </Text>
        )}
      </Card>

      {/* Subject Progress */}
      <Card>
        <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
          Subject Progress
        </Text>
        {subjectProgress.length > 0 ? (
          subjectProgress.map((subject, index) => (
            <View key={index} style={styles.subjectProgress}>
              <View style={styles.subjectInfo}>
                <View style={[styles.colorDot, { backgroundColor: subject.color }]} />
                <Text style={[styles.subjectName, { color: colors.text.primary }]}>
                  {subject.name}
                </Text>
              </View>
              <View style={styles.progressInfo}>
                <Text style={[styles.progressText, { color: colors.text.secondary }]}>
                  {subject.minutes} min
                </Text>
                <Text style={[styles.sessionsText, { color: colors.text.tertiary }]}>
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
          <BarChart
            data={{
              labels: subjectProgress.map(subject =>
                subject.name.substring(0, 3)
              ),
              datasets: [{
                data: subjectProgress.map(subject => subject.minutes / 60)
              }]
            }}
            width={screenWidth - 80}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        ) : (
          <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
            No data available
          </Text>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    padding: 15,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  subjectProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '500',
  },
  progressInfo: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sessionsText: {
    fontSize: 12,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});