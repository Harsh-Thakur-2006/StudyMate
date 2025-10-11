import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function ProgressScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Progress Analytics</Text>
      <Text style={styles.subtitle}>Track your study journey</Text>
      
      <View style={styles.glassCard}>
        <Text style={styles.cardTitle}>Weekly Overview</Text>
        <Text style={styles.emptyText}>No data available yet</Text>
      </View>

      <View style={styles.glassCard}>
        <Text style={styles.cardTitle}>Subject Progress</Text>
        <Text style={styles.emptyText}>Add subjects to see progress</Text>
      </View>

      <View style={styles.glassCard}>
        <Text style={styles.cardTitle}>Study Streak</Text>
        <Text style={styles.emptyText}>Start studying to build your streak!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 30,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
});