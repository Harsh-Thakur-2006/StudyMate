import axios from "axios";

// Render URL
const API_BASE_URL = "https://studymate-kwso.onrender.com/api";

console.log("Using Production API URL:", API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Response Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    // Error messages for mobile
    if (error.code === "ECONNABORTED") {
      error.message = "Request timeout. Please check your connection.";
    } else if (!error.response) {
      error.message = "Network error. Please check your internet connection.";
    } else if (error.response.status >= 500) {
      error.message = "Server error. Please try again later.";
    } else if (error.response.status === 400) {
      // Show backend validation errors if available
      const backendError = error.response.data;
      if (backendError && typeof backendError === "object") {
        const errorMsg = Object.values(backendError).join(", ");
        error.message = `Validation error: ${errorMsg}`;
      } else {
        error.message = "Invalid data sent to server.";
      }
    }

    return Promise.reject(error);
  }
);

// Event API calls
export const EventApi = {
  // Test backend connection
  testBackendConnection: async () => {
    try {
      const response = await api.get("/hello");
      console.log("Backend connection successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Backend connection failed:", error.message);
      throw new Error(`Backend connection failed: ${error.message}`);
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  },

  // Get all events
  getAllEvents: async () => {
    try {
      const response = await api.get("/events");
      return response.data;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },

  // Get event by ID
  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  },

  // Create new event
  createEvent: async (eventData) => {
    try {
      // Transform and validate data for backend
      const transformedData = {
        name: eventData.name || "Untitled Event",
        eventDate: eventData.eventDate || new Date().toISOString(),
        description: eventData.description || "",
        subject: eventData.subject || "General",
        eventType: eventData.eventType || "STUDY",
        duration: eventData.duration || 60,
        priority: eventData.priority || 3,
      };

      console.log("Sending event data:", transformedData);

      const response = await api.post("/events", transformedData);
      return response.data;
    } catch (error) {
      console.error(
        "Error creating event:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Update event
  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },

  // Get upcoming events
  getUpcomingEvents: async () => {
    try {
      const response = await api.get("/events/upcoming");
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      throw error;
    }
  },

  // Get today's events
  getTodayEvents: async () => {
    try {
      const response = await api.get("/events/today");
      return response.data;
    } catch (error) {
      console.error("Error fetching today events:", error);
      throw error;
    }
  },

  // Get this week's events
  getThisWeekEvents: async () => {
    try {
      const response = await api.get("/events/week");
      return response.data;
    } catch (error) {
      console.error("Error fetching week events:", error);
      throw error;
    }
  },
};

export default EventApi;
