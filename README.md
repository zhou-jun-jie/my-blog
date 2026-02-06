# My Blog Project / 我的博客项目

A personal blog application built with React (Frontend) and Node.js/Express (Backend).

一个基于 React（前端）和 Node.js/Express（后端）构建的个人博客应用。

## Project Structure / 项目结构

- `client/`: Frontend React application using Vite (前端 React 应用，使用 Vite 构建)
- `server/`: Backend Node.js Express application with Prisma and SQLite (后端 Node.js Express 应用，使用 Prisma 和 SQLite)

## Prerequisites / 前置条件

- [Node.js](https://nodejs.org/) (v16 or higher recommended / 推荐 v16 或更高版本)
- npm (usually comes with Node.js / 通常随 Node.js 一起安装)

## Getting Started / 快速开始

You need to start both the server and the client to run the full application.

您需要同时启动服务器和客户端才能运行完整的应用程序。

### 1. Backend Server / 后端服务

The backend handles API requests and database operations.

后端负责处理 API 请求和数据库操作。

1.  Navigate to the server directory:
    进入 server 目录：
    ```bash
    cd server
    ```

2.  Install dependencies:
    安装依赖：
    ```bash
    npm install
    ```

3.  Initialize the database (Prisma):
    初始化数据库 (Prisma)：
    ```bash
    npx prisma migrate dev --name init
    ```

4.  Start the development server:
    启动开发服务器：
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3001`.
    服务器将在 `http://localhost:3001` 上启动。

### 2. Frontend Client / 前端客户端

The frontend is the user interface of the blog.

前端是博客的用户界面。

1.  Open a new terminal and navigate to the client directory:
    打开一个新的终端并进入 client 目录：
    ```bash
    cd client
    ```

2.  Install dependencies:
    安装依赖：
    ```bash
    npm install
    ```

3.  Start the development server:
    启动开发服务器：
    ```bash
    npm run dev
    ```
    The client will usually start on `http://localhost:5173` (check the terminal output for the exact URL).
    客户端通常将在 `http://localhost:5173` 上启动（请检查终端输出以获取确切的 URL）。

## Features / 功能特性

- **View Logs**: Browse through blog logs.
  **查看日志**：浏览博客日志。
- **Create/Edit Logs**: Support for Markdown editing.
  **创建/编辑日志**：支持 Markdown 编辑。
- **Search**: Search logs by title or content (supports multi-keyword search).
  **搜索**：按标题或内容搜索日志（支持多关键字搜索）。
- **File Import**: Import local `.md` files to automatically populate log content.
  **文件导入**：导入本地 `.md` 文件以自动填充日志内容。
- **Delete Logs**: Remove unwanted logs (with confirmation).
  **删除日志**：删除不需要的日志（需确认）。

## Technologies / 技术栈

- **Frontend**: React, TypeScript, Vite, TailwindCSS, React Router, React Markdown
- **Backend**: Node.js, Express, TypeScript, Prisma, SQLite, Multer

## Notes / 注意事项

- The `uploads` directory in the `server` folder is used for storing uploaded files (if configured).
  `server` 文件夹中的 `uploads` 目录用于存储上传的文件（如果已配置）。
- Ensure port `3001` is free for the backend.
  确保后端端口 `3001` 未被占用。
