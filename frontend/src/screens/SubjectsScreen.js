import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SubjectsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subjects</Text>
      <Text style={styles.subtitle}>Manage your study subjects</Text>
      <View style={styles.glassCard}>
        <Text style={styles.emptyText}>No subjects added yet</Text>
      </View>
    </View>
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
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
    fontStyle: 'italic',
  },
});