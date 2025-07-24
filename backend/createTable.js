import pool from './db.js';

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chats (
        id VARCHAR PRIMARY KEY,
        title TEXT DEFAULT 'New Chat',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        chat_id VARCHAR REFERENCES chats(id),
        role TEXT DEFAULT 'user',
        content TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
}

createTables();
