import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ padding: 30 }}>Select a chat to begin</div>
    </div>
  );
}
