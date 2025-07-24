// app/layout.js

import '../globals.css';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'Gemma Chatbot',
  description: 'Chat with Ollama Gemma 2B',
};

export default function RootLayout({ children }) {
  return (
        <div style={{ display: 'flex', height: '100vh' }}>
          <Sidebar />
          <main style={{ flex: 1, overflow: 'auto' }}>{children}</main>
        </div>
  );
}
