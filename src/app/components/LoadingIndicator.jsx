export default function LoadingIndicator() {
  return (
    <div style={{ padding: 16, color: '#888', fontStyle: 'italic' }}>
      Bot is typing<span className="blink">...</span>
      <style>{`
        .blink {
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink {
          to { visibility: hidden; }
        }
      `}</style>
    </div>
  );
}