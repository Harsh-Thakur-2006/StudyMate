import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.glassCard}>
        <Text style={styles.cardTitle}>Account</Text>
        <Text style={styles.settingItem}>Sync with cloud</Text>
        <Text style={styles.settingItem}>Backup data</Text>
      </View>

      <View style={styles.glassCard}>
        <Text style={styles.cardTitle}>Notifications</Text>
        <Text style={styles.settingItem}>Study reminders</Text>
        <Text style={styles.settingItem}>Progress updates</Text>
      </View>

      <View style={styles.glassCard}>
        <Text style={styles.cardTitle}>Appearance</Text>
        <Text style={styles.settingItem}>Dark theme</Text>
        <Text style={styles.settingItem}>Accent color</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: 'rgba(15, 15, 15, 0.8)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ffff',
    marginBottom: 15,
  },
  settingItem: {
    fontSize: 16,
    color: '#ffffff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
});