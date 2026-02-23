🚀 Career Recommender

An AI-powered career recommendation and resume-building platform that helps users discover suitable career paths based on their interests, skills, and goals.

Built with modern full-stack technologies and secure authentication.

🌟 Live Demo

🔗 https://career-recommender-blond.vercel.app

📌 Features

🔐 Secure Authentication using Clerk

🤖 AI-powered career recommendations

🧠 Smart resume builder

📄 Dynamic content generation

🗂 Industry-based onboarding system

💾 Database integration with PostgreSQL

⚡ Fast and optimized Next.js App Router setup

🌍 Fully deployed on Vercel

🛠 Tech Stack
🖥 Frontend

Next.js (App Router)

React

TypeScript

Tailwind CSS

⚙ Backend

Next.js Server Components

Server Actions

Prisma ORM

🗄 Database

PostgreSQL (Neon Database)

Connection pooling enabled

SSL secured connection

🔐 Authentication

Clerk Authentication

Protected routes

Middleware-based auth handling

🤖 AI Integration

Gemini API (for AI-based career recommendations & content generation)

☁ Deployment

Vercel (Production hosting)

Environment variables configured securely

📂 Project Structure
/app
/actions
/components
/lib
/prisma
/data

/actions → Server actions for database & business logic

/lib → Prisma client setup

/prisma → Schema & migrations

/components → Reusable UI components

🔑 Environment Variables Required
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
GEMINI_API_KEY=
⚡ Getting Started (Run Locally)
git clone https://github.com/Sudeepsahu20/Career-Recommender.git
cd Career-Recommender
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

App will run on:

http://localhost:3000

