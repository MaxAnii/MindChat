# 🧠 MindChat - Real-Time Chat Application

A modern, feature-rich real-time messaging platform built with **React**,
**Node.js**, **Express**, and **WebSocket** technology. MindChat enables
seamless communication with advanced authentication, intelligent messaging, and
scalable infrastructure.

---

## 🚀 Main Feature: **AI-Powered Semantic Search**

> **Intelligent message discovery powered by Vector Embeddings & Pinecone**

MindChat's **flagship feature** is its advanced semantic search capability that
goes beyond simple keyword matching. Using cutting-edge AI technology:

- 🤖 **Vector-Based Intelligence** - Messages are automatically converted into
  semantic embeddings using transformers
- 🔍 **Intelligent Retrieval** - Find messages by meaning, not just keywords.
  Search "happy moments" and get all positive conversations
- ⚡ **Pinecone Integration** - Lightning-fast vector similarity search across
  millions of messages
- 💡 **Context-Aware Results** - Understand the intent behind your search query
- 🎯 **Smart Recommendations** - Get personalized message suggestions based on
  conversation patterns

### How It Works:

1. Every message sent is automatically indexed with semantic embeddings
2. Search queries are converted to the same vector space
3. Pinecone computes similarity scores to find the most relevant messages
4. Results are ranked by semantic relevance, not just text matching

---

## ✨ Key Features

### 🔐 **Authentication & Security**

- ✅ **Magic Link Authentication** - Secure passwordless login via email
- ✅ **Google OAuth Integration** - Quick sign-up with Google accounts
- ✅ **JWT-Based Sessions** - Secure token management with refresh tokens
- ✅ **Email Verification** - Verification tokens for account validation
- ✅ **Rate Limiting** - Protection against brute force and abuse

### 💬 **Real-Time Messaging**

- ✅ **WebSocket Communication** - Instant message delivery using Socket.IO
- ✅ **Live Direct Messaging** - One-on-one private conversations
- ✅ **Contact Management** - Add and manage contacts easily
- ✅ **Message History** - Persistent message storage in PostgreSQL
- ✅ **Real-time Status Updates** - See when users are online/offline

### 🤖 **Intelligent Features** ⭐ **PRIMARY**

- ✅ **AI-Powered Semantic Search** - ⭐ **CORE FEATURE** - Vector-based
  intelligent search using Pinecone and AI embeddings
- ✅ **Message Indexing** - Automatic conversion of messages to semantic
  embeddings
- ✅ **Meaning-Based Retrieval** - Find messages by context and intent, not just
  keywords
- ✅ **Smart Recommendations** - Contextual suggestions based on messaging
  patterns and conversation semantics
- ✅ **User Search** - Find and connect with other users using semantic
  understanding

### 🏗️ **Architecture & Scalability**

- ✅ **Kafka Message Queue** - Asynchronous message processing with Apache Kafka
- ✅ **Redis Caching** - High-performance caching layer for sessions and data
- ✅ **PostgreSQL Database** - Reliable and scalable relational database
- ✅ **Docker Support** - Containerized deployment for easy scaling
- ✅ **Prisma ORM** - Type-safe database operations

### 🎨 **User Interface**

- ✅ **Modern React UI** - Built with Vite for fast development
- ✅ **Shadcn/UI Components** - Beautiful, accessible UI components
- ✅ **Responsive Design** - Works seamlessly on desktop and mobile
- ✅ **Tailwind CSS** - Utility-first styling framework
- ✅ **Dark Mode Support** - Eye-friendly interface themes

### 📧 **Communication**

- ✅ **Email Notifications** - Send emails via Resend/Nodemailer
- ✅ **Magic Link Emails** - Beautiful HTML email templates
- ✅ **Real-time Email Updates** - Instant notification delivery

---

## 🛠️ Tech Stack

### **Backend**

| Technology            | Purpose                             |
| --------------------- | ----------------------------------- |
| **Node.js**           | Runtime environment                 |
| **Express.js**        | Web framework                       |
| **TypeScript**        | Type-safe JavaScript                |
| **PostgreSQL**        | Primary database                    |
| **Prisma**            | ORM & database management           |
| **Socket.IO**         | Real-time WebSocket communication   |
| **Apache Kafka**      | Message queue & event streaming     |
| **Redis**             | Caching & session storage           |
| **Pinecone**          | Vector database for semantic search |
| **Nodemailer/Resend** | Email service                       |
| **JWT**               | Token-based authentication          |

### **Frontend**

| Technology           | Purpose                 |
| -------------------- | ----------------------- |
| **React 18+**        | UI framework            |
| **TypeScript**       | Type-safe development   |
| **Vite**             | Build tool & dev server |
| **Tailwind CSS**     | Styling                 |
| **Shadcn/UI**        | Component library       |
| **Socket.IO Client** | Real-time communication |
| **Axios**            | HTTP client             |
| **React Query**      | Data fetching & caching |
| **React Hook Form**  | Form management         |
| **Google OAuth**     | Social authentication   |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18+)
- **npm** or **bun** (v1.0+)
- **PostgreSQL** (v14+)
- **Redis** (v6+)
- **Apache Kafka** (optional, for message queue features)
- **Docker** (optional, for containerized setup)
- **Git**

### Environment Requirements

- **Pinecone API Key** - For vector search capabilities
- **Google OAuth Credentials** - For social authentication
- **SMTP/Email Service** - For sending emails
- **JWT Secret Key** - For token generation

---

## 🚀 Getting Started

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/mindchat.git
cd MindChat
```

### Step 2: Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

#### Install Dependencies

```bash
npm install
# or
bun install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Get these from Google Cloud Console
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend URL
BACKEND_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/mindchat

# JWT Configuration
JWT_SECRET=your-secret-key-here

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# Node Environment
NODE_ENV=development

# Server Port
PORT=3000

```

#### Setup Database

```bash
# Create database and run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

#### Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# or build and start production
npm run build
npm start
```

The backend server will run on `http://localhost:5000`

#### Start Kafka Consumer (Optional)

In a separate terminal:

```bash
npm run consumer
```

---

### Step 3: Frontend Setup

In a new terminal, navigate to the frontend directory:

```bash
cd frontend
```

#### Install Dependencies

```bash
npm install
# or
bun install
```

#### Configure Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id


# API Configuration
VITE_BACKEND_URL="http://localhost:3000"
```

#### Start Frontend Development Server

```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`

---

## 📦 Docker Setup (Optional)

For a containerized setup using Docker Compose:

```bash
# From the project root
docker-compose up -d
```

This will start:

- PostgreSQL database
- Redis cache
- Backend API server
- Frontend development server

---

## 🔧 Available Scripts

### Backend Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run consumer     # Start Kafka consumer
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio (database GUI)
```

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run lint         # Run ESLint
npm run preview      # Preview production build locally
```

---

## 📁 Project Structure

```
MindChat/
├── backend/                 # Backend application
│   ├── controllers/             # Route controllers
│   ├── lib/                     # Utilities & services
│   │   ├── kafka.ts            # Kafka producer
│   │   ├── kafkaConsumer.ts    # Kafka consumer
│   │   ├── pinecone.ts         # Vector search
│   │   ├── socket.ts           # WebSocket setup
│   │   ├── mailer.ts           # Email service
│   │   └── prisma.ts           # Database client
│   ├── middleware/              # Express middleware
│   ├── routes/                  # API routes
│   ├── prisma/                  # Database schema
│   ├── utils/                   # Helper functions
│   ├── consumer.ts              # Kafka consumer script
│   ├── index.ts                 # Server entry point
|   ├── package.json
│   └── docker-compose.yml           # Docker configuration
│
├── frontend/                 # Frontend application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── auth/           # Auth components
│   │   │   ├── chat/           # Chat components
│   │   │   ├── DirectMessage/  # DM components
│   │   │   └── ui/             # Shadcn UI components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utilities
│   │   ├── contextAPI/         # Context providers
│   │   └── main.tsx            # App entry point
│   ├── public/                  # Static assets
│   ├── tailwind.config.ts       # Tailwind configuration
│   ├── vite.config.ts           # Vite configuration
│   └── package.json
│
└── README.md                    # Project documentation
```

---

## 🔌 API Endpoints

### Authentication

- `POST /auth/magic-link` - Request magic link
- `POST /auth/verify-token` - Verify magic link token
- `POST /auth/google` - Google OAuth authentication
- `POST /auth/logout` - Logout user

### Users

- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /user/search` - Search users
- `GET /user/:id` - Get user by ID

### Contacts

- `GET /contacts` - Get user contacts
- `POST /contacts` - Add contact
- `DELETE /contacts/:id` - Remove contact

### Messages

- `GET /messages/:contactId` - Get message history
- `POST /messages` - Send message
- `GET /messages/search` - **Semantic search across messages** - Main feature
  for finding messages by meaning

---

## 🔌 Real-Time Events (Socket.IO)

### Client → Server

- `send_message` - Send a new message
- `typing` - User is typing
- `user_online` - User comes online
- `user_offline` - User goes offline

### Server → Client

- `receive_message` - New message received
- `user_typing` - User typing notification
- `user_online` - User came online
- `user_offline` - User went offline

---

### Kafka Issues

- Ensure Kafka broker is running on configured host:port
- Check Kafka topic exists:
  `kafka-topics --list --bootstrap-server localhost:9092`

---

## 📚 Documentation

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Socket.IO Docs](https://socket.io/docs/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:



---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for
details.

---

## 💬 Support

For support, open an issue on GitHub.

---

## 🙏 Acknowledgments

- **Shadcn/UI** - Beautiful component library
- **Prisma** - Amazing ORM
- **Socket.IO** - Real-time communication
- **Pinecone** - Vector search platform

---

## 📊 Performance Considerations

- Redis caching reduces database queries
- Kafka decouples message processing
- **Vector embeddings enable semantic search** - Core intelligence layer using
  Pinecone
- WebSocket reduces HTTP overhead
- Prisma query optimization with indexes

---

## 🔬 Semantic Search Deep Dive

### Architecture

```
Message Input → @xenova/transformers → Vector Embedding → Pinecone Index → Similarity Search → Ranked Results
```

### Key Technologies:

| Component           | Technology           | Purpose                               |
| ------------------- | -------------------- | ------------------------------------- |
| **Embedding Model** | @xenova/transformers | Converts text to semantic vectors     |
| **Vector DB**       | Pinecone             | Stores and searches embeddings        |
| **Processing**      | Kafka                | Async message embedding pipeline      |
| **Caching**         | Redis                | Caches frequently searched embeddings |



## 🔮 Future Enhancements

- [ ] Group chat support
- [ ] Voice/Video calling integration
- [ ] File sharing and media upload
- [ ] Message encryption
- [ ] Mobile app (React Native)
- [ ] Message reactions and emojis
- [ ] Read receipts and typing indicators
- [ ] User presence status
- [ ] Channel-based communication

---

**Built with ❤️ by the MindChat Team**
