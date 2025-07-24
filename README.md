# 💬 AI ChatBot Application

An interactive AI-powered chatbot built using React (Next.js), Node.js, and MongoDB, with Ollama serving as the LLM backend. This project allows users to have real-time conversations with a bot that streams its responses word-by-word, offering a ChatGPT-like experience with start/stop control.

---

## 🛠️ Tech Stack Used

- **Frontend**: React.js (Next.js 14+ with App Router), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSql
- **LLM API**: Ollama (local LLM support like gemma3:1b)
- **Styling & UX**: Tailwind CSS, responsive chat layout with streaming support

---

## 🧰 Setup Instructions

### 1. Clone the repository
#in terminal run the command
- git clone https://github.com/https://github.com/rishish2712/chat-bot
- cd your-chatbot-project


**Start the Ollama server (download ollama )**
ollama run <modelname> (it will run the model and is model doesn't exist install the model for u adn then run the model)


- **cd backend**
- **npm install**

# Create a `.env` file with the following
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>

PORT=4000

OLLAMA_URL=http://localhost:11434

- **node createTable.js**

  (to create table into database)
- **node server.js**

  (to run the backend server)

#open new terminal 
- **npm install**
- **npm run dev**

  (to run the project)
  

▶️ Local Run Instructions
Start Ollama (ollama run mistral)

**Start the backend** (npm run dev in backend/)

**Start the frontend** (npm run dev in frontend/)

**Open http://localhost:3000 and start chatting!**

📌 **Features**

Streamed responses from the bot (word-by-word typing animation)

"Stop" button to cancel generation midway (retains partially generated content)

Auto-scroll chat window

Smooth user-bot message handling

Chat history stored in MongoDB

📎 **Assumptions & Constraints**

Assumes a working local installation of Ollama with access to a supported model like mistral.

MongoDB should be running locally (mongodb://localhost:27017) unless otherwise configured.

Only single-user local chat experience for now (no login/multi-session support yet).

Streaming is simulated on frontend for display; not socket-based.

"Stop" halts frontend rendering only; backend call is still in-flight unless explicitly aborted.

📬 **Future Improvements**

Add login/authentication for multi-user chat history

Upgrade to WebSocket for true real-time streaming

Add UI themes (light/dark mode)

Host on cloud platforms (Vercel, Railway, etc.)

🙏 **Acknowledgements**

Ollama for open-source local LLMs

Next.js

Tailwind CSS
