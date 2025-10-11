import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  FlatList,
  TouchableOpacity,
  Modal,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import { SubjectService } from '../services/StorageService';

export default function SubjectsScreen() {
  const [subjects, setSubjects] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const navigation = useNavigation(); // Add this line

  // Load subjects when screen loads
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
      loadSubjects(); // Reload the list
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
    <GlassCard style={styles.subjectItem}>
      <View style={styles.subjectInfo}>
        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
        <Text style={styles.subjectName}>{item.name}</Text>
      </View>
      <TouchableOpacity 
        onPress={() => handleDeleteSubject(item)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={20} color="#ff4444" />
      </TouchableOpacity>
    </GlassCard>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Subjects</Text>
        <Text style={styles.subtitle}>Manage your study subjects</Text>
      </View>

      {/* Add Subject Button */}
      <View style={styles.addButtonContainer}>
        <NeonButton 
          title="Add New Subject" 
          onPress={() => setModalVisible(true)}
          color="#00ffff"
          style={styles.addButton}
        />
      </View>

      {/* Log Study Button - Always Visible */}
      <View style={styles.quickActionContainer}>
        <NeonButton 
          title="Log Study Session" 
          onPress={() => navigation.navigate('LogStudy')}
          color="#00ff88"
          style={styles.quickActionButton}
        />
      </View>

      {/* Subjects List */}
      {subjects.length > 0 ? (
        <FlatList
          data={subjects}
          renderItem={renderSubjectItem}
          keyExtractor={item => item.id}
          style={styles.subjectsList}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <GlassCard style={styles.emptyState}>
          <Ionicons name="book-outline" size={50} color="#888888" />
          <Text style={styles.emptyText}>No subjects added yet</Text>
          <Text style={styles.emptySubtext}>
            Tap "Add New Subject" to create your first subject
          </Text>
        </GlassCard>
      )}

      {/* Add Subject Modal */}
<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <GlassCard style={styles.modalContent}>
        <Text style={styles.modalTitle}>Add New Subject</Text>
        
        <TextInput
          style={styles.textInput}
          placeholder="Enter subject name"
          placeholderTextColor="#888888"
          value={newSubjectName}
          onChangeText={setNewSubjectName}
          autoFocus={true}
        />

        <View style={styles.modalButtons}>
          <NeonButton 
            title="Cancel" 
            onPress={() => setModalVisible(false)}
            color="#888888"
            style={styles.modalButton}
          />
          <NeonButton 
            title="Add Subject" 
            onPress={handleAddSubject}
            color="#00ff88"
            style={styles.modalButton}
          />
        </View>
      </GlassCard>
    </View>
  </View>
</Modal>
    </View>
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
  addButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  addButton: {
    width: '100%',
  },
  quickActionContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  quickActionButton: {
    width: '100%',
  },
  subjectsList: {
    flex: 1,
  },
  listContent: {
    padding: 15,
  },
  subjectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    color: '#ffffff',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 5,
  },
  emptyState: {
    margin: 20,
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#888888',
    marginTop: 10,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker background for better contrast
  padding: 20,
},
modalContainer: {
  maxHeight: '80%', // Prevent overflow
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 1)',
},
modalContent: {
  padding: 25,
  margin: 10, // Add some margin
  maxWidth: '100%', // Ensure it doesn't overflow horizontally
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#ffffff',
  marginBottom: 20,
  textAlign: 'center',
},
textInput: {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 10,
  padding: 15,
  color: '#ffffff',
  fontSize: 16,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.2)',
  marginBottom: 20,
  width: '100%', // Ensure full width
},
modalButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%', // Ensure full width
},
modalButton: {
  flex: 1,
  marginHorizontal: 5,
  minWidth: 0, // Allow buttons to shrink properly
},
});