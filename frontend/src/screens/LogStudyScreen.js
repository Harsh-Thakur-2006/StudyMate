import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import { SubjectService, SessionService } from '../services/StorageService';

export default function LogStudyScreen({ navigation }) {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    const loadedSubjects = await SubjectService.getSubjects();
    setSubjects(loadedSubjects);
  };

  const handleLogSession = async () => {
    if (!selectedSubject) {
      Alert.alert('Error', 'Please select a subject');
      return;
    }

    if (!duration || isNaN(duration) || parseInt(duration) <= 0) {
      Alert.alert('Error', 'Please enter a valid duration in minutes');
      return;
    }

    try {
      await SessionService.saveSession({
        subjectId: selectedSubject.id,
        duration: parseInt(duration),
        notes: notes.trim()
      });

      Alert.alert(
        'Success', 
        `Study session logged for ${selectedSubject.name}`,
        [
          { 
            text: 'OK', 
            onPress: () => {
              setSelectedSubject(null);
              setDuration('');
              setNotes('');
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to log study session');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Log Study Session</Text>
        <Text style={styles.subtitle}>Track your study time</Text>
      </View>

      {/* Subject Selection */}
      <GlassCard>
        <Text style={styles.cardTitle}>Select Subject</Text>
        {subjects.length === 0 ? (
          <Text style={styles.emptyText}>No subjects available. Add subjects first.</Text>
        ) : (
          <View style={styles.subjectsGrid}>
            {subjects.map(subject => (
              <TouchableOpacity
                key={subject.id}
                style={[
                  styles.subjectOption,
                  selectedSubject?.id === subject.id && styles.subjectSelected
                ]}
                onPress={() => setSelectedSubject(subject)}
              >
                <View style={[styles.colorDot, { backgroundColor: subject.color }]} />
                <Text style={styles.subjectOptionText}>{subject.name}</Text>
                {selectedSubject?.id === subject.id && (
                  <Ionicons name="checkmark-circle" size={20} color="#00ff88" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </GlassCard>

      {/* Duration Input */}
      <GlassCard>
        <Text style={styles.cardTitle}>Duration</Text>
        <View style={styles.durationContainer}>
          <TextInput
            style={styles.durationInput}
            placeholder="Enter minutes"
            placeholderTextColor="#888888"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />
          <Text style={styles.durationLabel}>minutes</Text>
        </View>
      </GlassCard>

      {/* Notes Input */}
      <GlassCard>
        <Text style={styles.cardTitle}>Notes (Optional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Add any notes about this session..."
          placeholderTextColor="#888888"
          value={notes}
          onChangeText={setNotes}
          multiline={true}
          numberOfLines={3}
        />
      </GlassCard>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <NeonButton 
          title="Cancel" 
          onPress={() => navigation.goBack()}
          color="#888888"
          style={styles.actionButton}
        />
        <NeonButton 
          title="Log Session" 
          onPress={handleLogSession}
          color="#00ff88"
          style={styles.actionButton}
          disabled={!selectedSubject || !duration}
        />
      </View>
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
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subjectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '48%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  subjectSelected: {
    borderColor: '#00ff88',
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  subjectOptionText: {
    fontSize: 14,
    color: '#ffffff',
    flex: 1,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 10,
  },
  durationLabel: {
    fontSize: 16,
    color: '#888888',
    width: 80,
  },
  notesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});