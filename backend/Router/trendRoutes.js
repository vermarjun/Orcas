import express from 'express'; 
import { fetchTrendingTopics, fetchAIAnalysis, fetchSeoThumbnails} from '../controllers/trendController.js';

const router = express.Router();  

router.get("/trendingTopics", fetchTrendingTopics);
router.post("/fetchAIAnalysis", fetchAIAnalysis);
router.post("/fetchSeoThumbnails", fetchSeoThumbnails);

export default router;