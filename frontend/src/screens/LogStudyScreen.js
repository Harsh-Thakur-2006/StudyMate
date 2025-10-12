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
import { useTheme } from '../contexts/ThemeContext';
import { useSafeArea } from '../hooks/useSafeArea';
import Card from '../components/Card';
import Button from '../components/Button';
import Header from '../components/Header'; // Import Header component
import { SubjectService, SessionService } from '../services/StorageService';

export default function LogStudyScreen({ navigation }) {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const { colors } = useTheme();
  const { safeAreaStyle } = useSafeArea();

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
    <View style={[styles.container, safeAreaStyle]}>
      {/* LOCAL HEADER WITH BACK BUTTON */}
      <Header
        title="Log Study Session"
        subtitle="Track your study time"
        showThemeToggle={true}
        showBackButton={true}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subject Selection */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
            Select Subject
          </Text>
          {subjects.length === 0 ? (
            <View style={styles.emptySubjects}>
              <Ionicons name="book-outline" size={40} color={colors.text.tertiary} />
              <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
                No subjects available
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.text.secondary }]}>
                Add subjects first to log study sessions
              </Text>
              <Button
                title="Add Subjects"
                onPress={() => navigation.navigate('SubjectsMain')}
                color="primary"
                style={styles.addSubjectsButton}
              />
            </View>
          ) : (
            <View style={styles.subjectsGrid}>
              {subjects.map(subject => (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.subjectOption,
                    {
                      backgroundColor: colors.glass.background,
                      borderColor: colors.glass.border,
                    },
                    selectedSubject?.id === subject.id && [
                      styles.subjectSelected,
                      {
                        borderColor: colors.success,
                        backgroundColor: `${colors.success}20`,
                      }
                    ]
                  ]}
                  onPress={() => setSelectedSubject(subject)}
                >
                  <View style={[styles.colorDot, { backgroundColor: subject.color || colors.primary }]} />
                  <Text style={[styles.subjectOptionText, { color: colors.text.primary }]}>
                    {subject.name}
                  </Text>
                  {selectedSubject?.id === subject.id && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Card>

        {/* Duration Input - Only show if subjects exist */}
        {subjects.length > 0 && (
          <Card>
            <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
              Duration
            </Text>
            <View style={styles.durationContainer}>
              <TextInput
                style={[
                  styles.durationInput,
                  {
                    backgroundColor: colors.glass.background,
                    borderColor: colors.glass.border,
                    color: colors.text.primary
                  }
                ]}
                placeholder="Enter minutes"
                placeholderTextColor={colors.text.tertiary}
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
              />
              <Text style={[styles.durationLabel, { color: colors.text.secondary }]}>
                minutes
              </Text>
            </View>
          </Card>
        )}

        {/* Notes Input - Only show if subjects exist */}
        {subjects.length > 0 && (
          <Card>
            <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
              Notes (Optional)
            </Text>
            <TextInput
              style={[
                styles.notesInput,
                {
                  backgroundColor: colors.glass.background,
                  borderColor: colors.glass.border,
                  color: colors.text.primary
                }
              ]}
              placeholder="Add any notes about this session..."
              placeholderTextColor={colors.text.tertiary}
              value={notes}
              onChangeText={setNotes}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            color="error"
            variant="outlined"
            style={styles.actionButton}
          />
          {subjects.length > 0 && (
            <Button
              title="Log Session"
              onPress={handleLogSession}
              color="success"
              style={styles.actionButton}
              disabled={!selectedSubject || !duration}
            />
          )}
        </View>

        {/* Selected Subject Preview */}
        {selectedSubject && (
          <Card style={styles.previewCard}>
            <Text style={[styles.previewTitle, { color: colors.primary }]}>
              Session Preview
            </Text>
            <View style={styles.previewItem}>
              <Text style={[styles.previewLabel, { color: colors.text.secondary }]}>
                Subject:
              </Text>
              <View style={styles.subjectPreview}>
                <View style={[styles.colorDot, { backgroundColor: selectedSubject.color || colors.primary }]} />
                <Text style={[styles.previewValue, { color: colors.text.primary }]}>
                  {selectedSubject.name}
                </Text>
              </View>
            </View>
            {duration && (
              <View style={styles.previewItem}>
                <Text style={[styles.previewLabel, { color: colors.text.secondary }]}>
                  Duration:
                </Text>
                <Text style={[styles.previewValue, { color: colors.text.primary }]}>
                  {duration} minutes
                </Text>
              </View>
            )}
            {notes && (
              <View style={styles.previewItem}>
                <Text style={[styles.previewLabel, { color: colors.text.secondary }]}>
                  Notes:
                </Text>
                <Text style={[styles.previewValue, { color: colors.text.primary }]}>
                  {notes}
                </Text>
              </View>
            )}
          </Card>
        )}

        {/* Add bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
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
    padding: 20,
    paddingBottom: 30,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  emptySubjects: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  addSubjectsButton: {
    width: '80%',
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subjectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '48%',
    borderWidth: 1,
  },
  subjectSelected: {
    borderWidth: 2,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  subjectOptionText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationInput: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    marginRight: 10,
  },
  durationLabel: {
    fontSize: 16,
    width: 80,
  },
  notesInput: {
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  previewCard: {
    marginTop: 10,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  previewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  previewLabel: {
    fontSize: 14,
    width: '30%',
  },
  previewValue: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  subjectPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomPadding: {
    height: 30,
  },
});