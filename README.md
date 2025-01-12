# run system
docker-compose down -v                                    
docker-compose up --build


# 待办事项列表

# Predictive Maintenance for Industrial IoT Systems


This project implements a predictive maintenance system for industrial IoT (IIoT) applications. The system uses machine learning models to predict equipment failures, provides actionable insights, and visualizes the results through a responsive web platform.

---

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Project Structure](#project-structure)
3. [Deployment Guide](#deployment-guide)
4. [Frequently Asked Questions](#Frequently-Asked-Questions)

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

## Deployment Guide

### Prerequisites

1. Docker and Docker Compose installed on the server.
2. Python 3.8 or later installed (for standalone backend testing).
3. Node.js 16.x or later installed (for standalone frontend testing).

### Method 1: Using Docker

1. Start the project:
   ```bash
   docker-compose up --build -d
   ```
2. Access the application:
   - Frontend interface: [http://localhost:3000](http://localhost:3000)
   - Backend API:[http://localhost:5001](http://localhost:5001)
3. Stop the project:
   ```bash
   docker-compose down
   ```

### Method 2: Local Development Environment

1. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```
2. Run the frontend development server：
   ```bash
   npm run dev
   ```
3. Start the backend service in a new terminal：
   ```bash
   cd server
   docker-compose up --build -d
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

--------------------------分界线---------------------------------------------------------------

## 目录

1. [环境准备](#环境准备)
2. [项目获取](#项目获取)
3. [项目部署](#项目部署)
4. [开发指南](#开发指南)
5. [常见问题](#常见问题)

## 环境准备

### 安装 Git

1. 访问 [Git - Downloads](https://git-scm.com/downloads)
2. 下载并安装适合你系统的版本
3. 验证安装：
   ```bash
   git --version
   ```

### 安装 Docker

1. 访问 [Docker Desktop: The #1 Containerization Tool for Developers](https://www.docker.com/products/docker-desktop)
2. 下载并安装 Docker Desktop
3. 启动 Docker Desktop
4. 验证安装：
   ```bash
   docker --version
   docker-compose --version
   ```

### 安装 Node.js（可选，用于本地开发）

1. 访问 [Node.js — 在任何地方运行 JavaScript](https://nodejs.org/)
2. 下载并安装 LTS 版本
3. 验证安装：
   ```bash
   node --version
   npm --version
   ```

## 项目获取

1. 克隆项目：
   ```bash
   git clone https://github.com/yebeike/project1.git
   cd project1
   ```

## 项目部署

### 方法一：使用 Docker（推荐）

1. 启动项目：
   ```bash
   docker-compose up --build -d
   ```
2. 访问应用：
   - 前端界面：[http://localhost:3000](http://localhost:3000)
   - 后端 API：[http://localhost:5001](http://localhost:5001)
3. 停止项目：
   ```bash
   docker-compose down
   ```

### 方法二：本地开发环境

1. 安装前端依赖：
   ```bash
   cd client
   npm install
   ```
2. 运行前端开发服务器：
   ```bash
   npm run dev
   ```
3. 在新终端中启动后端服务：
   ```bash
   cd server
   docker-compose up --build -d
   ```

## 开发指南

### 项目结构

```
project1/
├── client/ # 前端代码
│ ├── src/ # React 源代码
│ │ ├── components/ # 组件
│ │ ├── pages/ # 页面
│ │ └── styles/ # 样式文件
│ └── package.json # 前端依赖配置
├── server/ # 后端代码
│ ├── trained_models/ # 机器学习模型
│ └── main.py # FastAPI 应用
  └── db.py #  数据库相关
  └── db init.py # 导入数据
  └── ai.py  #ai 模型相关
  └── mqtt receive.py #链接mqtt

└── docker-compose.yml # Docker 配置文件
```

### 修改前端代码

1. 主要文件：
   - `client/src/pages/MachinePage.tsx`：监控仪表盘页面
   - `client/src/App.tsx`：主应用组件
2. 本地开发：
   ```bash
   cd client
   npm run dev
   ```
   修改代码后会自动热重载。

### 修改后端代码

1. 主要文件：
   - `server/main.py`：API 实现
   - `server/requirements.txt`：Python 依赖
2. 重启服务：
   ```bash
   docker-compose down
   docker-compose up --build -d
   ```

## 常见问题

1. Docker 容器启动失败

   - 检查：
     - Docker Desktop 是否运行
     - 端口 3000 和 5001 是否被占用
     - 查看日志：`docker-compose logs`

2. 模型文件错误

   - 确保：
     - `server/trained_models/` 目录包含所有必要的模型文件：
       - `tensorflow_nn_model.keras`
       - `decision_tree_model.joblib`
       - `random_forest_model_optimized.joblib`

3. 前端开发服务器启动失败

   - 尝试：
     - 删除 `node_modules`：`rm -rf node_modules`
     - 重新安装：`npm install`
     - 清除缓存：`npm cache clean --force`

4. API 连接失败
   检查：
   后端服务是否运行： docker ps
   API URL 是否正确
   查看后端日志： docker logs project1-server-1
