import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storage
const STORAGE_KEYS = {
  SUBJECTS: '@studymate_subjects',
  STUDY_SESSIONS: '@studymate_sessions',
  GOALS: '@studymate_goals',
  TIMETABLE: '@studymate_timetable',
};

// Subject operations
export const SubjectService = {
  // Get all subjects
  getSubjects: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error getting subjects:', e);
      return [];
    }
  },

  // Save a subject
  saveSubject: async (subject) => {
    try {
      const subjects = await SubjectService.getSubjects();
      const newSubject = {
        id: Date.now().toString(),
        name: subject.name,
        color: subject.color || '#00ffff',
        createdAt: new Date().toISOString(),
      };
      subjects.push(newSubject);
      await AsyncStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
      return newSubject;
    } catch (e) {
      console.error('Error saving subject:', e);
      throw e;
    }
  },

  // Delete a subject
  deleteSubject: async (id) => {
    try {
      const subjects = await SubjectService.getSubjects();
      const filteredSubjects = subjects.filter(subject => subject.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(filteredSubjects));
      return true;
    } catch (e) {
      console.error('Error deleting subject:', e);
      throw e;
    }
  },
};

// Study session operations
export const SessionService = {
  // Get all study sessions
  getSessions: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.STUDY_SESSIONS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error getting sessions:', e);
      return [];
    }
  },

  // Save a study session
  saveSession: async (session) => {
    try {
      const sessions = await SessionService.getSessions();
      const newSession = {
        id: Date.now().toString(),
        subjectId: session.subjectId,
        duration: session.duration, // in minutes
        notes: session.notes || '',
        date: new Date().toISOString(),
      };
      sessions.push(newSession);
      await AsyncStorage.setItem(STORAGE_KEYS.STUDY_SESSIONS, JSON.stringify(sessions));
      return newSession;
    } catch (e) {
      console.error('Error saving session:', e);
      throw e;
    }
  },
};

// Clear all data (for development)
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    console.log('All data cleared');
  } catch (e) {
    console.error('Error clearing data:', e);
  }
};