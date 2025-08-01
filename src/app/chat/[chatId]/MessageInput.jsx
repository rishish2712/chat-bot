'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MessageInput({
  input,
  setInput,
  chatId,
  onNewMessage,
  onUpdateLastMessage,
  setLoading,
  disabled
}) {
  const router = useRouter();
  const abortControllerRef = useRef(null);
  const [botText, setBotText] = useState('');

  const sendMessage = async () => {
    const userMessage = input?.trim();
    if (!userMessage) return;

    setInput('');
    setLoading(true);
    setBotText('');
    onNewMessage({ content: userMessage, role: 'user' });

    try {
      abortControllerRef.current = new AbortController();

      const res = await fetch(`http://localhost:4000/api/chat/${chatId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userMessage }),
        signal: abortControllerRef.current.signal,
      });

      router.push(`/chat/${chatId}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      onNewMessage({ content: '', role: 'assistant' });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setBotText(prev => {
          const updated = prev + chunk;
          onUpdateLastMessage(updated);
          return updated;
        });
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('⛔ Streaming aborted');
        onUpdateLastMessage(botText);
      } else {
        console.error('❌ Error during streaming:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const stopStreaming = () => {
    abortControllerRef.current?.abort();
    setLoading(false);
  };

  return (
    <div className="fixed  h-full w-320 ">
      <div className="p-3 flex gap-2 border-t bg-zinc-900">
        <input
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white placeholder-gray-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
            else if (e.key === 'Escape') stopStreaming();
          }}
          placeholder="Your message..."
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={disabled ? stopStreaming : sendMessage}
        >
          {disabled ? 'Stop' : 'Send'}
        </button>
      </div>
    </div>
  );
}
