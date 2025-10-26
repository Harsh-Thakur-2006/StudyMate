# StudyMate - Smart Study Progress Tracker

A cross-platform mobile application built with React Native (Expo) and Java Spring Boot backend to help students track their study progress.

![StudyMate](https://img.shields.io/badge/React%20Native-Expo-blue)
![Java](https://img.shields.io/badge/Backend-Java%20Spring%20Boot-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

- **Goal Setting** - Set study goals for different subjects
- **Progress Tracking** - Daily study session logging with analytics
- **Timetable Management** - Schedule and manage study sessions
- **Reminders & Notifications** - Get reminded about study sessions
- **Progress Analytics** - Charts and insights about your study habits
- **Offline-First with Cloud Sync** - Works offline, syncs when online

## Tech Stack

### Frontend

- **React Native** with Expo
- **React Navigation** for routing
- **AsyncStorage** for local data persistence
- **Axios** for API communication
- **React Native Vector Icons** for UI icons

### Backend

- **Java 17** with Spring Boot
- **Spring Data JPA** for database operations
- **H2 Database** (development) / **PostgreSQL** (production)
- **REST API** with full CRUD operations
- **CORS** configured for mobile app access

## Quick Start

### Prerequisites

- Node.js 16+
- Java JDK 17+
- Maven 3.6+
- Expo CLI

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Harsh-Thakur-2006/StudyMate.git
   cd StudyMate
   ```

2. **Backend Setup**

   ```bash
   cd backend
   mvn clean compile
   mvn spring-boot:run
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npx expo start
   ```
   Scan QR code with Expo Go app

## Database

- **Development:** H2 in-memory database
- **Production:** PostgreSQL on Render
- **Data Persistence:** All data persists after server restarts

### Backend API (Production)

- **URL:** https://studymate-kwso.onrender.com
- **Database:** PostgreSQL 17 with full data persistence
- **Status:** Fully operational

### Features Implemented:

- React Native frontend with dark/light themes
- Java Spring Boot backend with PostgreSQL
- Event management (Create, Read, Delete)
- Data persistence across server restarts
- CORS configured for mobile app
- Production deployment on Render

### Tested & Working:

- Event creation and retrieval
- Data persistence after server restart
- Frontend-backend connectivity
- Cross-platform compatibility (iOS/Android)

## API Endpoints

All endpoints available at `/api/`:

- `GET /hello` - Test connection
- `GET /events` - Get all events
- `POST /events` - Create event
- `DELETE /events/{id}` - Delete event
