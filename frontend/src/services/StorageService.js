import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventApi } from "./ApiService";

// Keys for storage
const STORAGE_KEYS = {
  SUBJECTS: "@studymate_subjects",
  STUDY_SESSIONS: "@studymate_sessions",
  GOALS: "@studymate_goals",
  TIMETABLE: "@studymate_timetable",
  BACKEND_EVENTS: "@studymate_backend_events",
  LAST_SYNC: "@studymate_last_sync",
};

// Subject operations
export const SubjectService = {
  getSubjects: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Error getting subjects:", e);
      return [];
    }
  },

  getSubjectById: async (id) => {
    try {
      const subjects = await SubjectService.getSubjects();
      return subjects.find((subject) => subject.id === id) || null;
    } catch (e) {
      console.error("Error getting subject by ID:", e);
      return null;
    }
  },

  saveSubject: async (subject) => {
    try {
      const subjects = await SubjectService.getSubjects();
      const newSubject = {
        id: Date.now().toString(),
        name: subject.name,
        color: subject.color || getRandomColor(),
        createdAt: new Date().toISOString(),
        targetHours: subject.targetHours || 0,
        completedHours: subject.completedHours || 0,
      };
      subjects.push(newSubject);
      await AsyncStorage.setItem(
        STORAGE_KEYS.SUBJECTS,
        JSON.stringify(subjects)
      );
      return newSubject;
    } catch (e) {
      console.error("Error saving subject:", e);
      throw e;
    }
  },

  deleteSubject: async (id) => {
    try {
      const subjects = await SubjectService.getSubjects();
      const filteredSubjects = subjects.filter((subject) => subject.id !== id);
      await AsyncStorage.setItem(
        STORAGE_KEYS.SUBJECTS,
        JSON.stringify(filteredSubjects)
      );
      return true;
    } catch (e) {
      console.error("Error deleting subject:", e);
      throw e;
    }
  },

  updateSubjectProgress: async (subjectId, additionalMinutes) => {
    try {
      const subjects = await SubjectService.getSubjects();
      const updatedSubjects = subjects.map((subject) => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            completedHours:
              (subject.completedHours || 0) + additionalMinutes / 60,
          };
        }
        return subject;
      });
      await AsyncStorage.setItem(
        STORAGE_KEYS.SUBJECTS,
        JSON.stringify(updatedSubjects)
      );
      return true;
    } catch (e) {
      console.error("Error updating subject progress:", e);
      throw e;
    }
  },
};

// Study session operations
export const SessionService = {
  getSessions: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.STUDY_SESSIONS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Error getting sessions:", e);
      return [];
    }
  },

  saveSession: async (session) => {
    try {
      const sessions = await SessionService.getSessions();
      const newSession = {
        id: Date.now().toString(),
        subjectId: session.subjectId,
        duration: session.duration, // in minutes
        notes: session.notes || "",
        date: new Date().toISOString(),
        subjectName: session.subjectName || "",
      };
      sessions.push(newSession);
      await AsyncStorage.setItem(
        STORAGE_KEYS.STUDY_SESSIONS,
        JSON.stringify(sessions)
      );

      // Update subject progress
      await SubjectService.updateSubjectProgress(
        session.subjectId,
        session.duration
      );

      return newSession;
    } catch (e) {
      console.error("Error saving session:", e);
      throw e;
    }
  },

  getSessionsByDateRange: async (startDate, endDate) => {
    try {
      const sessions = await SessionService.getSessions();
      return sessions.filter((session) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= startDate && sessionDate <= endDate;
      });
    } catch (e) {
      console.error("Error getting sessions by date range:", e);
      return [];
    }
  },
};

// Goal operations
export const GoalService = {
  getGoals: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.GOALS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Error getting goals:", e);
      return [];
    }
  },

  saveGoal: async (goal) => {
    try {
      const goals = await GoalService.getGoals();
      const newGoal = {
        id: Date.now().toString(),
        title: goal.title,
        description: goal.description || "",
        targetDate: goal.targetDate,
        targetHours: goal.targetHours || 0,
        completedHours: goal.completedHours || 0,
        subjectId: goal.subjectId || null,
        priority: goal.priority || 3,
        createdAt: new Date().toISOString(),
        status: "active",
      };
      goals.push(newGoal);
      await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      return newGoal;
    } catch (e) {
      console.error("Error saving goal:", e);
      throw e;
    }
  },

  updateGoalProgress: async (goalId, additionalHours) => {
    try {
      const goals = await GoalService.getGoals();
      const updatedGoals = goals.map((goal) => {
        if (goal.id === goalId) {
          const newCompletedHours =
            (goal.completedHours || 0) + additionalHours;
          const status =
            newCompletedHours >= goal.targetHours ? "completed" : "active";
          return {
            ...goal,
            completedHours: newCompletedHours,
            status: status,
            completedAt:
              status === "completed"
                ? new Date().toISOString()
                : goal.completedAt,
          };
        }
        return goal;
      });
      await AsyncStorage.setItem(
        STORAGE_KEYS.GOALS,
        JSON.stringify(updatedGoals)
      );
      return true;
    } catch (e) {
      console.error("Error updating goal progress:", e);
      throw e;
    }
  },
};

// Sync service for backend integration
export const SyncService = {
  // Test backend connection
  testBackendConnection: async () => {
    try {
      const result = await EventApi.testBackendConnection();
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_SYNC,
        new Date().toISOString()
      );
      return {
        connected: true,
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Get last sync timestamp
  getLastSync: async () => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    } catch (e) {
      return null;
    }
  },

  // Sync study sessions to backend as events
  syncSessionsToBackend: async () => {
    try {
      const sessions = await SessionService.getSessions();
      const subjects = await SubjectService.getSubjects();

      console.log(`Syncing ${sessions.length} sessions to backend...`);

      let syncedCount = 0;

      for (const session of sessions) {
        const subject = subjects.find((s) => s.id === session.subjectId);

        // Format the date properly for backend
        const sessionDate = new Date(session.date);

        const eventData = {
          name: `Study: ${subject?.name || "Unknown Subject"}`,
          eventDate: sessionDate.toISOString(), // Ensure proper ISO format
          description: session.notes || `Studied ${session.duration} minutes`,
          subject: subject?.name || "General",
          eventType: "STUDY",
          duration: session.duration,
          priority: 2,
        };

        try {
          await EventApi.createEvent(eventData);
          console.log(`Synced session: ${eventData.name}`);
          syncedCount++;
        } catch (error) {
          console.error(`Failed to sync session: ${error.message}`);
          // Continue with other sessions even if one fails
        }
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_SYNC,
        new Date().toISOString()
      );
      return { success: true, synced: syncedCount };
    } catch (error) {
      console.error("Error syncing sessions to backend:", error);
      throw error;
    }
  },

  // Get events from backend and merge with local data
  syncEventsFromBackend: async () => {
    try {
      const backendEvents = await EventApi.getAllEvents();
      console.log("Fetched events from backend:", backendEvents.length);

      // Store backend events in local storage for offline access
      await AsyncStorage.setItem(
        STORAGE_KEYS.BACKEND_EVENTS,
        JSON.stringify(backendEvents)
      );

      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_SYNC,
        new Date().toISOString()
      );
      return backendEvents;
    } catch (error) {
      console.error("Error syncing events from backend:", error.message);
      // Fallback to local storage if backend is unavailable
      const localEvents = await AsyncStorage.getItem(
        STORAGE_KEYS.BACKEND_EVENTS
      );
      return localEvents ? JSON.parse(localEvents) : [];
    }
  },

  // Create event in backend
  createEventInBackend: async (eventData) => {
    try {
      const backendEvent = await EventApi.createEvent(eventData);
      console.log("Created event in backend:", backendEvent);

      // Update local cache
      const currentEvents = await SyncService.syncEventsFromBackend().catch(
        () => []
      );
      return backendEvent;
    } catch (error) {
      console.error("Error creating event in backend:", error);
      throw error;
    }
  },

  // Full sync - both directions
  fullSync: async () => {
    try {
      console.log("Starting full sync...");

      // Sync local sessions to backend
      const syncResult = await SyncService.syncSessionsToBackend();

      // Sync events from backend
      const backendEvents = await SyncService.syncEventsFromBackend();

      console.log("Full sync completed");
      return {
        success: true,
        sessionsSynced: syncResult.synced,
        eventsReceived: backendEvents.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Full sync failed:", error);
      throw error;
    }
  },
};

// Helper function for random colors
const getRandomColor = () => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
    "#F8C471",
    "#82E0AA",
    "#F1948A",
    "#85C1E9",
    "#D7BDE2",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Clear all data (for development)
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    console.log("All data cleared");
  } catch (e) {
    console.error("Error clearing data:", e);
  }
};

// Export all services
export default {
  SubjectService,
  SessionService,
  GoalService,
  SyncService,
  clearAllData,
};
