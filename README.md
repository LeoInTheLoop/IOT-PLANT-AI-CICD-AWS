# Predictive Maintenance for Industrial IoT Systems

This project implements a predictive maintenance system for industrial IoT (IIoT) applications. The system uses machine learning models to predict equipment failures, provides actionable insights, and visualizes the results through a responsive web platform.

---

## Table of Contents

1. [Deployment Guide](#deployment-guide)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Frequently Asked Questions](#Frequently-Asked-Questions)

---

## Deployment Guide

### Prerequisites

1. Docker and Docker Compose installed on the server.
2. Python 3.8 or later installed (for standalone backend testing).
3. Node.js 16.x or later installed (for standalone frontend testing).

### How to run the system

Method 1: Using Docker

1. Start the project:
   ```bash
   docker-compose down -v // no necessary
   docker-compose up --build -d
   ```
2. Directly access the application:
   - Frontend interface: [http://localhost:3000](http://localhost:3000)
   - Backend API:[http://localhost:5001](http://localhost:5001)
3. Stop the project:
   ```bash
   docker-compose down -v
   ```

Method 2: Local Development Environment

1. Install frontend dependencies:
   ```bash
   npm install
   cd client // Move to the client folder
   ```
2. Run the frontend development server：
   ```bash
   npm run dev // Open the default front-end URL
   ```
3. Start the backend service in a new terminal：
   ```bash
   cd server
   docker-compose up --build -d
   ```

---

## Technologies Used

### Backend

- Python
- Flask/FastAPI
- PostgreSQL
- MQTT
- Docker

### Frontend

- React
- Recharts
- Tailwind CSS

### Machine learning models

- Random Forest

---

## Project Structure

### Frontend (Client)

```
client/
├── src/
│   ├── assets/
│   │   ├── nav-icon.png
│   ├── components/
│   │   ├── Layout/            # The components of page layout
│   │   │   ├── MainLayout.tsx
│   │   ├── MoreInfo/          # The components of Details (More info) page
│   │   │   ├── Details.tsx
│   │   │   ├── MachineChart.tsx
│   │   ├── Navigation/        # The components of top-title
│   │   │   ├── TopBar.tsx
│   │   ├── Overview/          # The components of Dashboard (Overview) page
│   │   │   ├── DashBoard.tsx
│   │   │   ├── Filters.tsx
│   │   │   ├── MachineCard.tsx
│   │   │   ├── MachineList.tsx
│   │   ├── SideMenu/         # The components of side-menu
│   │   │   ├── Selection.tsx
│   │   │   ├── SideMenu.tsx
│   ├── pages/
│   │   ├── MoreInfo.tsx       # Details (More information) page
│   │   ├── Overview.tsx       # Dashboard (Overview) page
│   ├── styles/                # CSS and style files
│   │   ├── index.css
│   │   ├── MachineCard.css
│   ├── App.tsx                # Entry point of the React app
│   ├── main.tsx               # React DOM renderer
├── Dockerfile                 # Frontend Docker configuration
└── docker-compose.yml         # Docker Compose configuration
```

### Backend (Server)

```
server/
├── trained_models/        # Machine learning models
│   ├── decision_tree_model.joblib
│   ├── neural_network_model.keras
│   ├── random_forest_model_optimized.joblib
│   ├── tensorflow_nn_model.keras
├── main.py                # FastAPI application
├── db.py                  # Database-related scripts
├── init_dbData.py         # Data initialization scripts
├── ai.py                  # Model-related logic
├── mqttReceive.py         # MQTT data handling
├── Dockerfile             # Backend Docker configuration
├── requirements.txt       # Python dependencies
└── docker-compose.yml     # Docker Compose configuration
```

---

## Frequently Asked Questions

1. Docker container failed to start

   - Check:
     - Ensure Docker Desktop is running.
     - Verify that ports 3000 and 5001 are not already in use.
     - View logs using:`docker-compose logs`

2. Model file errors

   - Ensure that:
     - `server/trained_models/` directory contains all required model files:
       - `tensorflow_nn_model.keras`
       - `decision_tree_model.joblib`
       - `random_forest_model_optimized.joblib`

3. Frontend development server failed to start

   - Try the following steps:
     - Remove `node_modules`：`rm -rf node_modules`
     - Reinstall dependencies: `npm install`
     - Clear the cache: `npm cache clean --force`

4. API connection failed
   - Check:
     - Ensure the backend service is running: `docker ps`
     - Verify the API URL is correct.
     - View backend logs:`docker logs project1-server-1`

---
