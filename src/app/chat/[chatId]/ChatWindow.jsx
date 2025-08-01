'use client';

import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';

const getMessages = async (chatId) => {
  try {
    const res = await fetch(`http://localhost:4000/api/chat/${chatId}`);
    if (!res.ok) throw new Error('Failed to fetch messages');
    const data = await res.json();
    return {
      messages: data?.map((msg) => ({ role: msg.role, content: msg.content })) || [],
    };
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    return { messages: [] };
  }
};

const ChatWindow = forwardRef(({ chatId, trigger }, ref) => {
  const [displayMessages, setDisplayMessages] = useState([]);
  const [animatedContent, setAnimatedContent] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);

  // Allow parent to call "addAnimatedBotMessage"
  useImperativeHandle(ref, () => ({
    addAnimatedBotMessage(botMessage) {
      animateBotMessage(botMessage);
    },
  }));

  useEffect(() => {
    if (chatId) loadAllMessages();
    return () => clearInterval(intervalRef.current);
  }, [chatId, trigger]);

  const loadAllMessages = async () => {
    clearInterval(intervalRef.current);
    const { messages } = await getMessages(chatId);

    setIsAnimating(false);
    setAnimatedContent('');

    setDisplayMessages(messages); // Show everything instantly (no animation here)
  };

  const animateBotMessage = (message) => {
    clearInterval(intervalRef.current);
    setIsAnimating(true);
    setAnimatedContent('');
    let i = 0;

    intervalRef.current = setInterval(() => {
      i++;
      setAnimatedContent(message.content.slice(0, i));

      if (i >= message.content.length) {
        clearInterval(intervalRef.current);
        setIsAnimating(false);
        setDisplayMessages((prev) => [...prev, message]);
        setAnimatedContent('');
      }
    }, 20);
  };

  return (
    <div style={{ padding: 20, height: '80vh', overflowY: 'auto' }}>
      {displayMessages.map((msg, idx) => (
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

      {isAnimating && animatedContent && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            margin: '8px 0',
          }}
        >
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
            <b>Bot:</b> {animatedContent}
          </div>
        </div>
      )}
    </div>
  );
});

export default ChatWindow;
