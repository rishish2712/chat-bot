'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import ChatWindow from './chat/[chatId]/ChatWindow';
import MessageInput from './chat/[chatId]/MessageInput';
import LoadingIndicator from './components/LoadingIndicator';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [trigger, setTrigger] = useState(0);

  const bottomRef = useRef(null);
  const chatWindowRef = useRef(null); // Added for stop typing

  const refreshMessages = () => {
    setTrigger(prev => prev + 1);
  };

  // Handle new messages (refresh chat)
  const handleNewMessage = () => {
    setTimeout(() => {
      refreshMessages();
    }, 0);
  };




  // Fetch all chats once on load
  useEffect(() => {
    axios.get('http://localhost:4000/api/chats')
      .then(res => {
        setChatList(res.data);
      })
      .catch(() => setChatList([]));
  }, []);

  // If no chat is selected but chatList is available, select the top-most chat
  useEffect(() => {
    if (!currentChatId && chatList.length > 0) {
      const firstChatId = chatList[0]?.id;
      setCurrentChatId(firstChatId);
      router.push(`/chat/${firstChatId}`);
    }
  }, [chatList, currentChatId]);

  // Fetch messages for the current chat
  useEffect(() => {
    if (currentChatId) {
      axios.get(`http://localhost:4000/api/chat/${currentChatId}/message`)
        .then(res => {
          setMessages(res.data);
        })
        .catch(() => {
          setMessages([]);
        });
    }
  }, [currentChatId]);

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // Create new chat
  const newChat = async () => {
    try {
      const res = await axios.post('http://localhost:4000/api/chat');
      const newChatId = res.data.chatId;
      setCurrentChatId(newChatId);
      setMessages([]);
      router.push(`/chat/${newChatId}`);
    } catch (err) {
      console.error("Failed to create new chat:", err);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        chatList={chatList}
        currentChatId={currentChatId}
        onNewChat={newChat}
        onSelectChat={(id) => {
          setCurrentChatId(id);
          router.push(`/chat/${id}`);
        }}
      />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <>
          <ChatWindow messages={messages} />
          {loading && <LoadingIndicator />}
          <MessageInput
            input={input}
            setInput={setInput}
            chatId={currentChatId} // ✅ FIXED
            disabled={loading}
            onNewMessage={handleNewMessage}
            onUpdateLastMessage={handleNewMessage}
            setLoading={setLoading}
            setStreamingMessage={setStreamingMessage}
            onStop={() => chatWindowRef.current?.stopTyping()}
          />
        </>
        <div ref={bottomRef}></div>
      </main>
    </div>
  );
}
