'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const getChats = async () => {
  try {
    const res = await fetch('http://localhost:4000/api/chats', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch chats');
    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return []; // fallback to empty array
  }
};

const createChat = async () => {
  try {
    const res = await fetch('http://localhost:4000/api/chat', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to create chat');
    const data = await res.json();
    return data.id;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function Sidebar({ refreshTrigger }) {
  const [chats, setChats] = useState([]);
  const router = useRouter();

  const loadChats = async () => {
    const data = await getChats();
    setChats(data);
  };

  useEffect(() => {
    loadChats();
  }, [refreshTrigger]); // re-fetch on trigger change

  const handleNewChat = async () => {
    const chatId = await createChat();
    if (chatId) {
      await loadChats(); // refresh sidebar
      router.push(`/chat/${chatId}`);
    }
  };

  return (
    <aside style={{ width: 250, padding: 20, background: '#f0f0f0' }}>
      <button onClick={handleNewChat}>+ New Chat</button>
      <div>
        {chats.map(chat => (
          <div
            key={chat.id}
            onClick={() => router.push(`/chat/${chat.id}`)}
            style={{ cursor: 'pointer', marginTop: 10 }}
          >
            {chat.title}
          </div>
        ))}
      </div>
    </aside>
  );
}
