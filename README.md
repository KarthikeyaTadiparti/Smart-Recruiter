# Smart Recruiter

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Cache-FF3E00?logo=redis&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini-AI-8E75C2?logo=googlegemini&logoColor=white)
![Vapi AI](https://img.shields.io/badge/Vapi_AI-Voice-7000FF?logo=waves&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)

Smart Recruiter is an **AI-powered voice interview platform** that automates candidate screening through conversational interviews, intelligent feedback generation, and recruiter analytics.

Built with **React, Node.js, PostgreSQL, Redis, Gemini, and Vapi AI**, it streamlines the hiring process for both recruiters and candidates by reducing manual effort and enabling data-driven hiring decisions.

![Smart Recruiter Platform](Design/Home.png)


## Screenshots

### Candidate Interface

#### Candidate Dashboard
![Candidate Dashboard](Design/Candidate_Dashboard.png)

#### Job Search & Explore
![Candidate Explore](Design/Candidate_Explore.png)

#### Job Details
![Candidate Job Details](Design/Candidate_JobDetails.png)


#### AI Voice Interview Session
![Candidate Interview](Design/Candidate_Interview.png)

### Recruiter Interface

#### Recruiter Dashboard
![Recruiter Dashboard](Design/Recruiter_Dashboard.png)

#### Create Interview
![Recruiter Create Interview](Design/Recruiter_CreateInterview.png)

#### Configure Interview Questions
![Recruiter Interview Question](Design/Recruiter_InterviewQuestion.png)

#### Manage Reports
![Recruiter Manage Reports](Design/Recruiter_ManageReports.png)

### Analytics & Reports

#### Report Overview
![Interview Report Overview](Design/InterviewReport-1.png)

![Interview Report Metrics](Design/InterviewReport-2.png)


## ✨ Features

### Recruiter Features

* 🤖 Create and manage AI-powered interview sessions.
* 📝 Generate role-specific interview questions.
* 📊 Review candidate performance reports and analytics.
* 🔍 Monitor candidate integrity through suspicious activity tracking.
* ✅ Accept or reject candidates based on evaluation insights.

### Candidate Features

* 🔎 Explore available interview opportunities.
* 🎙️ Participate in real-time AI voice interviews.
* 📈 Track interview progress and application history.
* 📝 Receive detailed interview feedback and transcripts.
* 📊 View technical, communication, and confidence scores.

### Platform Features

* 🔐 Secure JWT-based authentication with role-based access control.
* 🎨 Modern and responsive UI built using Tailwind CSS and Shadcn UI.
* ⚡ High-performance backend powered by PostgreSQL and Drizzle ORM.
* 🧠 AI-driven evaluation and feedback generation using Google Gemini.

---

## 🛠️ Tech Stack

### Frontend

* **Framework:** React, Vite
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4, Shadcn UI, Lucide React
* **State Management:** Redux Toolkit, React Redux
* **AI Integration:** @vapi-ai/web
* **Forms:** React Hook Form, Zod

### Backend

* **Runtime:** Node.js, Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL (Neon DB)
* **ORM:** Drizzle ORM
* **AI Integration:** Google GenAI (Gemini)
* **Authentication:** JWT, Bcrypt

---

## 📋 Prerequisites

Before you begin, ensure you have the following ready:

* Node.js (v18 or higher)
* A PostgreSQL database (recommended: Neon DB)
* A Vapi AI account and Public Key
* A Google AI Studio API Key (Gemini)

---

## 🔑 Environment Variables

You need to configure environment variables for both the Backend and Frontend.

### Backend (`Backend/.env`)

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
REDIS_URL=redis://localhost:6379
```

### Frontend (`Frontend/.env`)

```env
VITE_API_URL=http://localhost:3000
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Smart-Recruiter
```

### 2. Backend Setup

```bash
cd Backend

npm install

# Generate Drizzle migrations
npm run generate

# Push schema to the database
npm run migrate
# OR
npm run push

# Start the backend server
npm run dev
```

### 3. Frontend Setup

Open a new terminal window:

```bash
cd Frontend

npm install

# Start the frontend server
npm run dev
```

---

## 📜 Available Scripts

### Backend

| Command            | Description                           |
| ------------------ | ------------------------------------- |
| `npm run dev`      | Starts the backend development server |
| `npm run studio`   | Opens Drizzle Studio                  |
| `npm run generate` | Generates SQL migrations              |
| `npm run migrate`  | Runs database migrations              |
| `npm run push`     | Pushes schema changes directly        |

### Frontend

| Command         | Description                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Starts the Vite development server    |
| `npm run build` | Builds the application for production |

---

## 📄 License

This project is licensed under the ISC License.
