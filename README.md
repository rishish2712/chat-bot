# 💬 AI ChatBot Application

An interactive AI-powered chatbot built using React (Next.js), Node.js, and MongoDB, with Ollama serving as the LLM backend. This project allows users to have real-time conversations with a bot that streams its responses word-by-word, offering a ChatGPT-like experience with start/stop control.

---

## 🛠️ Tech Stack Used

- **Frontend**: React.js (Next.js 14+ with App Router), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **LLM API**: Ollama (local LLM support like LLaMA2, Mistral, etc.)
- **Styling & UX**: Tailwind CSS, responsive chat layout with streaming support

---

## 🧰 Setup Instructions

### 1. Clone the repository
#in terminal run the command
- git clone https://github.com/https://github.com/rishish2712/chat-bot
- cd <your-chatbot-project >


**Start the Ollama server (download ollama )**
ollama run <modelname> (it will run the model and is model doesn't exist install the model for u adn then run the model)


**cd backend
npm install**

# Create a `.env` file with the following
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>
PORT=4000
OLLAMA_URL=http://localhost:11434

**node createTable.js**(to create table into database)
**node server.js**(to run the backend server)

#open new terminal 
**npm install**
**npm run dev**(to run next.js)

