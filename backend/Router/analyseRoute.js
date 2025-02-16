import express from 'express'; 
import { ytVideoAnalysis, channelAnalysis } from '../controllers/ytController.js';

const router = express.Router();  

// Register route
router.post('/yt', ytVideoAnalysis);
router.post("/channelAnalysis", channelAnalysis);

export default router;