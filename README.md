# 待办事项列表

## 进行中
1. **后端集成MQTT**
   - 后端加入MQTT支持。 （孔

## 想法


1. **前端数据获取**
   - 实现前端通过GET请求`/machines`获取数据，并展示在`machinelist`页面。
   - 实现前端通过GET请求`/machines/:id`获取数据，并展示在`detail`页面。

2. **后端集成MQTT**
   - 后端加入MQTT支持。

3. **MQTT与数据库集成**
   - 实现MQTT接收数据并写入SQL数据库。

4. **后端接口开发**
   - 后端开发接口，接收POST请求，并返回预测结果（暂时使用POST代替MQTT接收数据）。

5. **前端展示ML结果**
   - 前端接收机器学习预测结果，并进行展示。

6. **数据库数据存储**
   - SQL数据库存储相关数据。

7. **前端详情页图表展示**
   - 设计并实现前端`detail`页面的折线图展示。



## 完成
    - 后端创建SQL数据库，并实现增、改、查、删功能（孔）
    -  前端网页路径调整：已修改 machinelist 和 machinepage 路径。优化页面布局。（林）


***


# IoT 预测性维护项目部署指南

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
   - 后端API：[http://localhost:5001](http://localhost:5001)
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



## 📁 Project Structure

-   **`frontend/`** - The React frontend app, where users can draw digits and have fun! 🎨
-   **`models/`** - TensorFlow model files live here! 🧠
-   **`server/`** - FastAPI application folder, the brain of our backend! 🖥️
-   **`docker-compose.yml`** - Docker Compose configuration to build and run both frontend and backend services. 📦

## 🚀 Getting Started

### ✅ Prerequisites

-   **Docker** - To build and run the API in a container. 🐋
-   **Node.js and npm** - For building the frontend application. 📦

### 🛠️ Building and Running the Application with Docker Compose

1. **Clone the repository**:

    ```bash
    git clone https://github.com/AhmedSobhy01/digit-classifier.git
    cd digit-classifier
    ```

2. **Build and start the services**:

    ```bash
    docker-compose up --build -d
    ```

    ```bash
    docker-compose down -v
    docker-compose up --build
    ```

    This command builds the Docker images for both the React frontend and the FastAPI backend, then starts the services defined in `docker-compose.yml`.

3. **Access the services**:

    - **React Frontend**: Open `http://localhost:3000` in your browser to use the frontend app.
    - **FastAPI Backend**: The backend API will be accessible at `http://localhost:5001`.

### 🔗 API Endpoints

-   **POST /predict**: Predict the digit from an uploaded image file. 📸

    #### Example Request

    ```bash
    curl -X POST "http://localhost:5000/predict" -H "Content-Type: multipart/form-data" -F "file=@your_image_file.png"
    ```

    -   **`file`**: The image file you want to classify. 🎯

    #### Example Response

    ```json
    {
        "message": "Prediction successful",
        "prediction": 1,
        "probabilities": [2.6359641196904704e-5, 0.7292985916137695, 3.460873995209113e-5, 0.10600192844867706, 0.005066428333520889, 0.053292419761419296, 3.709441443788819e-6, 0.002449796535074711, 0.005420663394033909, 0.09840560704469681]
    }
    ```

## 🎨 Building the Frontend Web Application (Optional)

If you prefer to build and run the React frontend without Docker, follow these steps:

1. **Navigate to the `frontend` directory**:

    ```bash
    cd frontend
    ```

2. **Install the necessary dependencies**:

    ```bash
    npm install
    ```

3. **Build the frontend application**:

    ```bash
    npm run build
    ```

4. **Serve the application locally**:

    ```bash
    npm start
    ```

    The frontend app will be available at `http://localhost:3000` (port may vary).



## 🧠 Model Architecture

The neural network model used is a simple yet powerful one:

-   **Input Layer**: 784 neurons (28x28 pixels, flattened)
-   **Hidden Dropout Layer**
-   **Hidden Dense Layer**: 1 fully connected layer with ReLU activation
-   **Output Layer**: 10 neurons (one for each digit class) with softmax activation

## 🎓 Model Training

The model was trained using the MNIST dataset. Want to retrain it? Use the `models/tensorflow_nn_model.py` script.

## 📜 License

This project is licensed under the MIT License. For more details, see the [LICENSE](LICENSE) file.
