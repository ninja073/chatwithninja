# Realtime Chat App

A full-stack real-time chat application built with **React Native (Expo)** for the frontend and **Node.js, Express, Socket.IO** for the backend. It features user authentication, one-to-one messaging, group chats, and real-time updates.

## Features

- **User Authentication**: Secure Login and Registration system using JWT.
- **Real-time Messaging**: Instant messaging powered by Socket.IO.
- **One-to-One Chats**: Private conversations between users.
- **Group Chats**: Create groups with multiple users (Backend supported, UI pending).
- **User Search**: Search for other users to start conversations.
- **Typing Indicators**: Real-time typing status (Backend supported).
- **Secure Storage**: JWT tokens stored securely on the device.

## Tech Stack

### Frontend
- **React Native**: Cross-platform mobile framework.
- **Expo**: Framework and platform for universal React applications.
- **React Navigation**: Routing and navigation for Expo apps.
- **Axios**: Promise based HTTP client for the browser and node.js.
- **Socket.IO Client**: Real-time engine for event-based communication.

### Backend
- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: NoSQL database for storing users, chats, and messages.
- **Mongoose**: Elegant mongodb object modeling for node.js.
- **Socket.IO**: Enables real-time, bidirectional and event-based communication.
- **JWT**: JSON Web Tokens for secure authentication.

## Project Structure

```
/
├── backend/                # Node.js Backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route logic (User, Chat, Message)
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose Models (User, Chat, Message)
│   ├── routes/             # API Routes
│   ├── utils/              # Helper utilities (Token generation)
│   └── server.js           # Entry point
│
└── frontend/               # React Native Frontend
    ├── components/         # Reusable components
    ├── config/             # Configuration files
    ├── context/            # Context API for global state
    ├── screens/            # Application screens (Login, Chat, etc.)
    └── App.js              # Main Component
```

## Getting Started

### Prerequisites

- **Node.js**: Make sure you have Node.js installed.
- **MongoDB**: You need a MongoDB connection string (locally installed or MongoDB Atlas).
- **Expo Go**: Install the Expo Go app on your iOS or Android device.

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd chatwithninja
   ```

2. **Backend Setup**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `backend` folder and add your configuration:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secure_random_string
     ```
   - Start the server:
     ```bash
     node server.js
     ```

3. **Frontend Setup**
   - Navigate to the frontend directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - **Important**: Update the API Endpoint.
     Open `frontend/screens/LoginScreen.js` (and other screens like `RegisterScreen.js`, `ChatListScreen.js`, `SingleChatScreen.js`) and replace `http://localhost:5000` with:
     - **For Android Emulator**: `http://10.0.2.2:5000`
     - **For iOS Simulator**: `http://localhost:5000`
     - **For Physical Device**: `http://YOUR_PC_IP_ADDRESS:5000` (Make sure your phone and PC are on the same Wi-Fi).

   - Start the application:
     ```bash
     npx expo start
     ```
   - Scan the QR code with Expo Go (Android) or use the Camera app (iOS) if you are not logged in to Expo, or simply select your device from the list.

## API Endpoints

### User
- `POST /api/user`: Register a new user.
- `POST /api/user/login`: Authenticate user and get token.
- `GET /api/user?search=keywords`: Search for users.

### Chat
- `POST /api/chat`: Create or access a one-on-one chat.
- `GET /api/chat`: Fetch all chats for the logged-in user.
- `POST /api/chat/group`: Create a group chat (requires `name` and `users` array).

### Message
- `POST /api/message`: Send a message.
- `GET /api/message/:chatId`: Fetch all messages for a specific chat.

## License

This project is open-source and available for educational purposes.
