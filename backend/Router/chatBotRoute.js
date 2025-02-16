import express from 'express'; 
import { chatbot } from '../controllers/chatBotController.js';

const router = express.Router();  

router.post("/chat", chatbot)

export default router;