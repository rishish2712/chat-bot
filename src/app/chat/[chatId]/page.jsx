'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import LoadingIndicator from '@/app/components/LoadingIndicator';

export default function ChatPage() {
  const router = useRouter();
  const { chatId } = useParams();
  const [trigger, setTrigger] = useState(0);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const chatWindowRef = useRef();

  const refreshMessages = () => {
    setTimeout(() => {
      setTrigger(prev => prev + 1);
    }, 0);
  };

  return (
    <div>
      <div>
        <ChatWindow chatId={chatId} trigger={trigger} ref={chatWindowRef} />
        {loading && <LoadingIndicator />}
      </div>
      <MessageInput
        input={input}
        setInput={setInput}
        chatId={chatId}
        disabled={loading}
        onNewMessage={refreshMessages}
        onUpdateLastMessage={refreshMessages}
        setLoading={setLoading}
        setStreamingMessage={setStreamingMessage}
        onStop={() => chatWindowRef.current?.stopTyping()}
      />
    </div>
  );
}