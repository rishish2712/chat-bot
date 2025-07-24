import express from 'express';
import pool from '../db.js'; 

// Adjust the path as necessary

const router = express.Router();


// Create a new chat
router.post('/api/chat', async (req, res) => {
  try {
    const chatId = `chat-${Date.now()}`;
    const title = req.body || 'New Chat';
    await pool.query('INSERT INTO chats (id,title) VALUES ($1,$2)', [chatId, title]);
    res.status(201).json({ id: chatId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create chat'});
  }
});

// Get all chats
router.get('/api/chats', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM chats ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chats' + err.message });
  }
});

// Get messages for a chat
router.get('/api/chat/:chatId', async (req, res) => {
  const chatId  = req.params.chatId;
  //console.log('Fetching messages for chatId:', chatId);
  try {
    const result = await pool.query('SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC', [chatId]);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch messages'  + err.message });
  }
});

// Send a message
router.post('/api/chat/:chatId/message', async (req, res) => {
  let chatId = req.params.chatId;
  const { content } = req.body;

  try {
    // 1. Check if chat exists
    const chatResult = await pool.query('SELECT * FROM chats WHERE id = $1', [chatId]);

    // 2. If not, create it using content as the title
    if (chatResult.rows.length === 0) {
      chatId = `chat-${Date.now()}`;
      await pool.query(
        'INSERT INTO chats (id, title) VALUES ($1, $2)', [chatId, content]
      );
    }

    // 3. Update title if it's still 'New Chat'
    if (chatResult.rows[0]?.title === 'New Chat') {
      await pool.query('UPDATE chats SET title = $1 WHERE id = $2', [content, chatId]);
    }

    // 4. Insert user message
    await pool.query(
      'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)',
      [chatId, 'user', content]
    );

    // 5. 🔥 Call Ollama for bot response
    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma:2b',
        prompt: content,
        stream: false
      })
    });

    const ollamaData = await ollamaRes.json();
    const botReply = ollamaData.response?.trim() || 'No response';

    // 6. Save bot message
    await pool.query(
      'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)',
      [chatId, 'bot', botReply]
    );

    // 7. Respond with the chatId
    res.status(200).json({ chatId: chatId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message: ' + err.message });
  }
});


export default router;