import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import StatCard from '../components/StatCard';
import { SubjectService, SessionService } from '../services/StorageService';

export default function DashboardScreen() {
  const [subjectsCount, setSubjectsCount] = useState(0);
  const [todayHours, setTodayHours] = useState(0);
  const [progress, setProgress] = useState(0);
  const [recentSessions, setRecentSessions] = useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

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
    const todaySessions = sessions.filter(session => 
      new Date(session.date).toDateString() === today
    );
    const totalMinutes = todaySessions.reduce((sum, session) => sum + session.duration, 0);
    setTodayHours((totalMinutes / 60).toFixed(1));
    
    // Simple progress calculation
    setProgress(subjects.length > 0 ? Math.min(subjects.length * 10, 100) : 0);

    // Get recent sessions (last 3)
    const sortedSessions = sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
    setRecentSessions(sortedSessions.slice(0, 3));
  };

  const handleLogStudy = () => {
    navigation.navigate('Subjects', { screen: 'LogStudy' });
  };

  const handleAddSubject = () => {
    navigation.navigate('Subjects');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>StudyMate</Text>
        <Text style={styles.headerSubtitle}>Your smart study companion</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <StatCard number={todayHours} label="Today's Hours" color="#00ffff" />
        <StatCard number={subjectsCount} label="Subjects" color="#ff00ff" />
        <StatCard number={`${progress}%`} label="Progress" color="#00ff88" />
      </View>

      {/* Quick Actions */}
      <GlassCard>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.buttonRow}>
          <NeonButton 
            title="Add Subject" 
            onPress={handleAddSubject}
            color="#00ffff" 
          />
          <NeonButton 
            title="Log Study" 
            onPress={handleLogStudy}
            color="#ff00ff" 
          />
        </View>
        <View style={styles.buttonRow}>
          <NeonButton title="Schedule" color="#00ff88" />
          <NeonButton title="Set Goal" color="#ffaa00" />
        </View>
      </GlassCard>

      {/* Recent Activity */}
      <GlassCard>
        <Text style={styles.cardTitle}>Recent Activity</Text>
        {recentSessions.length > 0 ? (
          recentSessions.map(session => (
            <View key={session.id} style={styles.sessionItem}>
              <Text style={styles.sessionSubject}>Subject #{session.subjectId}</Text>
              <Text style={styles.sessionDuration}>{session.duration} min</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No recent study sessions</Text>
        )}
      </GlassCard>

      {/* Upcoming Sessions */}
      <GlassCard>
        <Text style={styles.cardTitle}>Upcoming Sessions</Text>
        <Text style={styles.emptyText}>No upcoming sessions scheduled</Text>
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888888',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sessionSubject: {
    fontSize: 14,
    color: '#ffffff',
  },
  sessionDuration: {
    fontSize: 14,
    color: '#00ff88',
    fontWeight: 'bold',
  },
});