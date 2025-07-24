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

  const bottomRef = useRef(null);

  console.log('typeof setMessage:', typeof setMessages);

  useEffect(() => {
    axios.get('http://localhost:4000/api/chats')
      .then(res => {
        setChatList(res.data);
      })
      .catch(() => setChatList([]));
  }, []);

  useEffect(() => {
    if (!currentChatId && chatList.length > 0) {
      setCurrentChatId(chatList[0].id);
      router.push(`/chat/${chatList[0].id}`);
    }
  }, [chatList, currentChatId]);

  console.log('Current Chat ID:', currentChatId);

  useEffect(() => {
    if (currentChatId) {
      axios.get(`http://localhost:4000/api/chat/${currentChatId}/message`)
        .then(res => {
          setMessages(res.data);
          router.push(`/chat/${currentChatId}`);


        })
        .catch(() => {
          setMessages([]);
        });


    }
  }, [currentChatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  const newChat = async () => {
    const res = await axios.post('http://localhost:4000/api/chat');
    setCurrentChatId(res.data.chatId);
    setMessages([]);
  };

  const onNewMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };
  const onUpdateLastMessage = (chunk) => {
    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1].content += chunk;
      return updated;
    });
  };


  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        chatList={chatList}
        currentChatId={currentChatId}
        onNewChat={newChat}
        onSelectChat={setCurrentChatId}
      />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatWindow messages={messages} />
        {loading && <LoadingIndicator />}
        <MessageInput
          input={input}
          setInput={setInput}
          chatId={currentChatId}
          disabled={loading}
          onNewMessage={onNewMessage}
          setStreamingMessage={setStreamingMessage}
          onUpdateLastMessage={onUpdateLastMessage}
          setLoading={setLoading}
        />
      </main>
    </div>
  );
}
