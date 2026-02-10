# Smart Recruiter

Smart Recruiter is a modern, AI-powered recruitment platform designed to streamline the hiring process for both recruiters and candidates. It leverages advanced voice AI and generative models to conduct automated interviews, analyze candidate performance, and provide actionable insights.

![Smart Recruiter Platform](Frontend/public/smart_recruiter.png)

## Features

- 🤖 **AI Voice Interviews**: Automated, conversational interviews powered by Vapi.ai and OpenAI/Deepgram.
- 📊 **Smart Dashboards**: Dedicated dashboards for Recruiters (Job management, Analytics) and Candidates (Application tracking, Feedback).
- 📝 **Automated Feedback**: Detailed feedback and scoring on Technical, Communication, and Confidence metrics using Google GenAI.
- 🔐 **Role-Based Authentication**: Secure login and signup for Candidates and Recruiters using JWT.
- 🎨 **Modern UI**: A responsive, accessible interface built with React, Tailwind CSS v4, and Shadcn UI.
- ⚡ **Performance**: Optimized backend with PostgreSQL and Drizzle ORM.

## Tech Stack

### Frontend
- **Framework**: React, Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Shadcn UI, Lucide React
- **State Management**: Redux Toolkit, React Redux
- **AI Integration**: @vapi-ai/web
- **Forms**: React Hook Form, Zod

### Backend
- **Runtime**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon DB)
- **ORM**: Drizzle ORM
- **AI Integration**: Google GenAI (Gemini)
- **Authentication**: JWT, Bcrypt

## Prerequisites

Before you begin, ensure you have the following ready:
- [Node.js](https://nodejs.org/) (v18 or higher)
- A PostgreSQL database (we recommend [Neon DB](https://neon.tech/))
- [Vapi.ai](https://vapi.ai/) Account and Public Key
- [Google AI Studio](https://aistudio.google.com/) API Key (Gemini)

## Environment Variables

You need to set up environment variables for both the Backend and Frontend.

### Backend
Create a `.env` file in the `Backend` directory:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
REDIS_URL=redis://localhost:6379
```

### Frontend
Create a `.env` file in the `Frontend` directory:

```env
VITE_API_URL=http://localhost:3000
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Smart-Recruiter
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   
   # Generate Drizzle migrations
   npm run generate
   
   # Push schema to the database
   npm run migrate
   # OR
   npm run push
   
   # Start the development server
   npm run dev
   ```

3. **Frontend Setup**
   Open a new terminal window:
   ```bash
   cd Frontend
   npm install
   
   # Start the development server
   npm run dev
   ```

## Script Commands

### Backend
- `npm run dev`: Starts the backend in development mode with watch.
- `npm run studio`: Opens Drizzle Studio to view/edit database.
- `npm run generate`: Generates SQL migrations based on schema changes.
- `npm run migrate`: Runs migrations.

### Frontend
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the project for production.

## License

This project is licensed under the ISC License.
