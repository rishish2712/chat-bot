'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import axios from 'axios';
import LoadingIndicator from '@/app/components/LoadingIndicator';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

export default function ChatPage() {
  const router = useRouter();
  const { chatId } = useParams();
  const [trigger, setTrigger] = useState(0);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const chatWindowRef = useRef();

  // ✅ Define a normal function to fetch messages using axios
  async function fetchMessages(chatId) {
    try {
      if (chatId) {
        axios.get(`http://localhost:4000/api/chat/${chatId}/messages`)
          .then(res => setMessages(res.data),
            router.push(`/chat/${chatId}`) // Navigate to chat page        
          )
          .catch(() => setMessages([]));

      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      return [];
    }
  }

  // ✅ Triggers re-render in ChatWindow by updating 'trigger'
  function refreshMessages() {
    fetchMessages(chatId)
      .then(data => {
        console.log('Messages refreshed:', data);
        setTrigger(prev => prev + 1); // ChatWindow should use this as a trigger
      })
      .catch(err => {
        console.error('Error in refreshMessages:', err);
      });
  }

  return (
    <div>
      <ChatWindow chatId={chatId} trigger={trigger} />
      {loading && <LoadingIndicator />}
      <MessageInput
        input={input}
        setInput={setInput}
        chatId={chatId}
        disabled={loading}
        onNewMessage={() => refreshMessages()}
        setStreamingMessage={setStreamingMessage}
        onUpdateLastMessage={() => refreshMessages()}
        setLoading={setLoading}
        onStop={() => chatWindowRef.current?.stopTyping()}
      />
    </div>
  );
}
