import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Create a new chat
router.post('/api/chat', async (req, res) => {
  try {
    const chatId = `chat-${Date.now()}`;
    const title = req.body?.title || 'New Chat';
    await pool.query('INSERT INTO chats (id, title) VALUES ($1, $2)', [chatId, title]);
    res.status(201).json({ id: chatId });
  } catch (err) {
    console.error('Create Chat Error:', err);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Get all chats
router.get('/api/chats', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM chats ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch Chats Error:', err);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Get messages for a chat
router.get('/api/chat/:chatId', async (req, res) => {
  const chatId = req.params.chatId;
  try {
    const result = await pool.query(
      'SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC',
      [chatId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch Messages Error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/api/chat/:chatId/message', async (req, res) => {
  let chatId = req.params.chatId;
  const { content } = req.body || {};

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Message content cannot be empty' });
  }

  try {
    const chatResult = await pool.query('SELECT * FROM chats WHERE id = $1', [chatId]);

    if (chatResult.rows.length === 0) {
      chatId = `chat-${Date.now()}`;
      await pool.query('INSERT INTO chats (id, title) VALUES ($1, $2)', [chatId, content]);
    } else if (chatResult.rows[0]?.title === 'New Chat') {
      await pool.query('UPDATE chats SET title = $1 WHERE id = $2', [content, chatId]);
    }

    await pool.query(
      'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)',
      [chatId, 'user', content]
    );

    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma3:1b',
        prompt: content,
        stream: false
      })
    });

    const ollamaData = await ollamaRes.json();
    const botReply = ollamaData.response?.trim() || 'No response';

    await pool.query(
      'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)',
      [chatId, 'bot', botReply]
    );

    res.status(200).json({ chatId });
  } catch (err) {
    console.error('Send Message Error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
