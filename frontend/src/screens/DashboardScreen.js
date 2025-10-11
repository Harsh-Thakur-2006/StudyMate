import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import StatCard from '../components/StatCard';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>StudyMate</Text>
        <Text style={styles.headerSubtitle}>Your smart study companion</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <StatCard number="0" label="Today's Hours" color="#00ffff" />
        <StatCard number="0" label="Subjects" color="#ff00ff" />
        <StatCard number="0%" label="Progress" color="#00ff88" />
      </View>

      {/* Quick Actions */}
      <GlassCard>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.buttonRow}>
          <NeonButton title="Add Subject" color="#00ffff" />
          <NeonButton title="Log Study" color="#ff00ff" />
        </View>
        <View style={styles.buttonRow}>
          <NeonButton title="Schedule" color="#00ff88" />
          <NeonButton title="Set Goal" color="#ffaa00" />
        </View>
      </GlassCard>

      {/* Recent Activity */}
      <GlassCard>
        <Text style={styles.cardTitle}>Recent Activity</Text>
        <Text style={styles.emptyText}>No recent study sessions</Text>
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
});