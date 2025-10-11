import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventApi } from './ApiService';

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

// Sync service for backend integration
export const SyncService = {
  // Sync local subjects to backend (when user logs in)
  syncSubjectsToBackend: async () => {
    try {
      const localSubjects = await SubjectService.getSubjects();
      console.log('Syncing subjects to backend:', localSubjects.length);
      // In a real app, you would send subjects to backend here
      return localSubjects;
    } catch (error) {
      console.error('Error syncing subjects:', error);
      throw error;
    }
  },

  // Sync study sessions to backend
  syncSessionsToBackend: async () => {
    try {
      const localSessions = await SessionService.getSessions();
      console.log('Syncing sessions to backend:', localSessions.length);
      // In a real app, you would send sessions to backend here
      return localSessions;
    } catch (error) {
      console.error('Error syncing sessions:', error);
      throw error;
    }
  },

  // Get events from backend and merge with local data
  syncEventsFromBackend: async () => {
    try {
      const backendEvents = await EventApi.getAllEvents();
      console.log('Fetched events from backend:', backendEvents.length);
      
      // Store backend events in local storage for offline access
      await AsyncStorage.setItem('@studymate_backend_events', JSON.stringify(backendEvents));
      
      return backendEvents;
    } catch (error) {
      console.error('Error syncing events from backend:', error);
      // Fallback to local storage if backend is unavailable
      const localEvents = await AsyncStorage.getItem('@studymate_backend_events');
      return localEvents ? JSON.parse(localEvents) : [];
    }
  },

  // Create event in backend
  createEventInBackend: async (eventData) => {
    try {
      const backendEvent = await EventApi.createEvent(eventData);
      console.log('Created event in backend:', backendEvent);
      return backendEvent;
    } catch (error) {
      console.error('Error creating event in backend:', error);
      throw error;
    }
  },

  // Test backend connection - FIXED: Use EventApi.testBackendConnection
  testBackendConnection: async () => {
    try {
      const result = await EventApi.testBackendConnection();
      return { connected: true, data: result };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  },
};