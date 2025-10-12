import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useSafeArea } from '../hooks/useSafeArea';
import Card from '../components/Card';
import Button from '../components/Button';
import Header from '../components/Header';
import { SubjectService } from '../services/StorageService';

export default function SubjectsScreen() {
  const [subjects, setSubjects] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { safeAreaStyle } = useSafeArea();

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    const loadedSubjects = await SubjectService.getSubjects();
    setSubjects(loadedSubjects);
  };

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) {
      Alert.alert('Error', 'Please enter a subject name');
      return;
    }

    try {
      await SubjectService.saveSubject({ name: newSubjectName.trim() });
      setNewSubjectName('');
      setModalVisible(false);
      loadSubjects();
    } catch (error) {
      Alert.alert('Error', 'Failed to add subject');
    }
  };

  const handleDeleteSubject = (subject) => {
    Alert.alert(
      'Delete Subject',
      `Are you sure you want to delete "${subject.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await SubjectService.deleteSubject(subject.id);
              loadSubjects();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete subject');
            }
          }
        }
      ]
    );
  };

  const renderSubjectItem = ({ item }) => (
    <Card style={styles.subjectItem}>
      <View style={styles.subjectInfo}>
        <View style={[styles.colorDot, { backgroundColor: item.color || colors.primary }]} />
        <Text style={[styles.subjectName, { color: colors.text.primary }]}>
          {item.name}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteSubject(item)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </TouchableOpacity>
    </Card>
  );

  const ListHeaderComponent = () => (
    <>
      {/* Add Subject Button */}
      <View style={styles.addButtonContainer}>
        <Button
          title="Add New Subject"
          onPress={() => setModalVisible(true)}
          color="primary"
          style={styles.addButton}
        />
      </View>

      {/* Log Study Button - Always Visible */}
      <View style={styles.quickActionContainer}>
        <Button
          title="Log Study Session"
          onPress={() => navigation.navigate('LogStudy')}
          color="secondary"
          style={styles.quickActionButton}
        />
      </View>
    </>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Card style={styles.emptyState}>
        <Ionicons name="book-outline" size={60} color={colors.text.tertiary} />
        <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
          No Subjects Yet
        </Text>
        <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
          Create your first subject to start tracking your study progress
        </Text>
        <Button
          title="Create First Subject"
          onPress={() => setModalVisible(true)}
          color="primary"
          style={styles.emptyButton}
        />
      </Card>
    </View>
  );

  return (
    <View style={[styles.container, safeAreaStyle]}>
      {/* LOCAL HEADER */}
      <Header
        title="Subjects"
        subtitle="Manage your study subjects"
        showThemeToggle={true}
      />

      {/* Use FlatList instead of ScrollView + FlatList */}
      <FlatList
        data={subjects}
        renderItem={renderSubjectItem}
        keyExtractor={item => item.id}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={<View style={styles.bottomPadding} />}
      />

      {/* Add Subject Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Card style={styles.modalContent}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                Add New Subject
              </Text>

              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.glass.background,
                    borderColor: colors.glass.border,
                    color: colors.text.primary
                  }
                ]}
                placeholder="Enter subject name"
                placeholderTextColor={colors.text.tertiary}
                value={newSubjectName}
                onChangeText={setNewSubjectName}
                autoFocus={true}
              />

              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  color="error"
                  variant="outlined"
                  style={styles.modalButton}
                />
                <Button
                  title="Add Subject"
                  onPress={handleAddSubject}
                  color="success"
                  style={styles.modalButton}
                />
              </View>
            </Card>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  addButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  addButton: {
    width: '100%',
  },
  quickActionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActionButton: {
    width: '100%',
  },
  subjectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
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
    marginRight: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    width: '100%',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    width: '80%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
  },
  modalContainer: {
    maxHeight: '80%',
    justifyContent: 'center',
  },
  modalContent: {
    padding: 25,
    margin: 10,
    maxWidth: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    minWidth: 0,
  },
  bottomPadding: {
    height: 30,
  },
});