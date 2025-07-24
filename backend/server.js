import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes.js'; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Register chat routes
app.use('/', chatRoutes); 

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});