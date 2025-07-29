# Gemini Chatbot - MERN Stack

A full-stack chatbot application built with MERN stack and Google Gemini AI.

## Features

- 🔐 User authentication (email/password)
- 💬 Real-time chat with Google Gemini AI
- 📚 Chat history management
- 🌓 Light/Dark mode toggle
- ⚙️ User settings and preferences
- 📱 Responsive design
- 🎨 Markdown formatting for AI responses

## Tech Stack

- **Frontend:** React.js, Context API, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **AI:** Google Gemini AI API

## Project Structure

```
gemini-chatbot/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context providers
│   │   ├── services/    # API services
│   │   └── styles/      # Global styles
│   └── package.json
├── server/          # Express backend
│   ├── config/      # Database config
│   ├── controllers/ # Route controllers
│   ├── middleware/  # Custom middleware
│   ├── models/      # MongoDB models
│   ├── routes/      # API routes
│   ├── .env         # Environment variables
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or MongoDB with provided docker compose file
- Google Gemini AI API key

### Backend Setup

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add `.env` file with your credentials:
   ```
   PORT=5001
   MONGODB_URI=your_mongodb_atlas_url
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the client:
   ```bash
   npm start
   ```

## Running the Application

1. Start the backend server from the `server` directory:
   ```bash
   cd server && npm run dev
   ```

2. In a new terminal, start the frontend from the `client` directory:
   ```bash
   cd client && npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## License

This project is licensed under the MIT License.
