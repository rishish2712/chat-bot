'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

const getMessages = async (chatId) => {
  try {
    const res = await fetch(`http://localhost:4000/api/chat/${chatId}`);
    if (!res.ok) throw new Error('Failed to fetch messages');
    const data = await res.json();
    return {
      messages: data ? data.map(msg => ({ role: msg.role, content: msg.content })) : [],
    };
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    return { messages: [] };
  }
};

// Using forwardRef to control ChatWindow from parent
const ChatWindow = forwardRef(({ chatId, trigger }, ref) => {
  const [messages, setMessages] = useState([]);
  const [animatedBotMessage, setAnimatedBotMessage] = useState('');
  const typingInterval = useRef(null); // hold animation interval

  useImperativeHandle(ref, () => ({
    stopTyping: () => {
      if (typingInterval.current) {
        clearInterval(typingInterval.current);
        typingInterval.current = null;
      }
    },
  }));

  useEffect(() => {
    if (chatId) loadMessages();
  }, [chatId, trigger]);

  async function loadMessages() {
    const data = await getMessages(chatId);

    const botMessages = data.messages.filter(msg => msg.role === 'bot');
    const latestBot = botMessages.length ? botMessages[botMessages.length - 1] : null;
    const messagesExcludingLastBot = latestBot
      ? data.messages.slice(0, data.messages.lastIndexOf(latestBot))
      : data.messages;

    setMessages(messagesExcludingLastBot);
    setAnimatedBotMessage('');

    if (latestBot) animateTyping(latestBot.content);
  }

  function animateTyping(content) {
    let index = 0;
    setAnimatedBotMessage('');
    clearInterval(typingInterval.current); // clear previous animation if any

    typingInterval.current = setInterval(() => {
      if (index <= content.length) {
        setAnimatedBotMessage(content.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval.current);
        typingInterval.current = null;
      }
    }, 20); // Adjust speed here
  }

  return (
    <div style={{ padding: 20, height: '80vh', overflowY: 'auto' }}>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            margin: '8px 0',
          }}
        >
          <div
            style={{
              background: msg.role === 'user' ? '#DCF8C6' : '#F1F0F0',
              color: 'black',
              padding: '10px 14px',
              borderRadius: '12px',
              maxWidth: '70%',
              whiteSpace: 'pre-wrap',
            }}
          >
            <b>{msg.role === 'user' ? 'You' : 'Bot'}:</b> {msg.content}
          </div>
        </div>
      ))}

      {animatedBotMessage && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '8px 0' }}>
          <div
            style={{
              background: '#F1F0F0',
              color: 'black',
              padding: '10px 14px',
              borderRadius: '12px',
              maxWidth: '70%',
              whiteSpace: 'pre-wrap',
            }}
          >
            <b>Bot:</b> {animatedBotMessage}
          </div>
        </div>
      )}
    </div>
  );
});

export default ChatWindow;
