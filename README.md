# 待办事项列表

## 进行中
- 后端创建SQL数据库，并实现增、改、查、删功能（孔）

## 想法

1. **前端网页路径调整**
   - 将`machinelist`页面展示在根路径`"/"`。
   - 将`detail`页面（当前名为`machinepage`）路径设置为`"/:id/detail"`，并优化页面布局。

2. **前端数据获取**
   - 实现前端通过GET请求`/machines`获取数据，并展示在`machinelist`页面。
   - 实现前端通过GET请求`/machines/:id`获取数据，并展示在`detail`页面。

3. **后端数据库操作**
   - 后端创建SQL数据库，并实现增、改、查、删功能。

4. **后端集成MQTT**
   - 后端加入MQTT支持。

5. **MQTT与数据库集成**
   - 实现MQTT接收数据并写入SQL数据库。

6. **后端接口开发**
   - 后端开发接口，接收POST请求，并返回预测结果（暂时使用POST代替MQTT接收数据）。

7. **前端展示ML结果**
   - 前端接收机器学习预测结果，并进行展示。

8. **数据库数据存储**
   - SQL数据库存储相关数据。

9. **前端详情页图表展示**
   - 设计并实现前端`detail`页面的折线图展示。

10. **文档规范**
    - 制定并遵循Markdown格式规范，确保文档通顺、规范。



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
   - 检查：
     - 后端服务是否运行：`docker ps`
     - API URL 是否正确
     - 查看后端日志：`docker logs project1-server-1`

## 数据来源

数据来源：[kaggle - Machine Predictive Maintenance Classification](https://www.kaggle.com/datasets/shivamb/machine-predictive-maintenance-classification)
```

这个 Markdown 文件提供了一个清晰的指南，用于部署和开发 IoT 预测性维护项目。
