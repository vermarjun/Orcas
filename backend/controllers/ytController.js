import axios from "axios"
import { analyzeAllComments, analyzeComment } from "../PrespectiveAnalysis.js";
import { main } from "./channelAnalysis.js";

async function fetchComments(videoId, maxResults = 10) {
    const API_KEY = process.env.YT_API_KEY;
    let comments = [];
    let nextPageToken = null;
  
    do {
      const commentsUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY}&maxResults=${maxResults}&pageToken=${nextPageToken || ""}`;
  
      try {
        const response = await axios.get(commentsUrl);
        const commentsData = response.data;
  
        comments = comments.concat(
          commentsData.items.map(item => {
            const snippet = item.snippet.topLevelComment.snippet;
            return {
              author: snippet.authorDisplayName,
              comment: snippet.textDisplay,
              videoId: videoId,
            };
          })
        );
  
        nextPageToken = commentsData.nextPageToken;
      } catch (error) {
        console.error("Error fetching comments:", error.message);
        break;
      }
    } while (nextPageToken && comments.length < maxResults);
    return comments;
  }

function getYouTubeVideoId(url) {
    try {
      // Create a URL object
      const urlObj = new URL(url);

      const videoId = urlObj.searchParams.get('v');
  
      return videoId;
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  }

export const ytVideoAnalysis = async (req, res) => {
    try {
        const { ytVideoLink } = req.body;
        
        // Check for missing fields
        if (!ytVideoLink) {
            return res.status(400).json({ 
                message: "Video Link to bhej bsdk", 
                success: false 
            });
        }
        
        const videoId = getYouTubeVideoId(ytVideoLink);
        
        if (!videoId){
            return res.status(400).json({ 
                message: "Video id nahi nikal ri", 
                success: false 
            });
        }
        const comments = await fetchComments(videoId);

        const prespectiveAnalysis = await analyzeAllComments(comments);

        return res.status(201).json({ 
            message: "Comments Fetched Successfully!", 
            success: true,
            comments: comments,
            prespectiveAnalysis: prespectiveAnalysis
        });
    } catch (error) {
        console.error("Error in registerUser:", error.message); // Log the error
        return res.status(500).json({ 
            message: "Server error. Please try again later.", 
            success: false, 
            error: error.message 
        });
    }
};

export const channelAnalysis = async (req, res) => {
  const {username} = req.body;
  const data = JSON.parse(await main(username));
  for (const video of data.videos) {
    for (const comment of video.top_comments) {
        try {
            const result = await analyzeComment(comment.comment);
            comment.toxicity = result.TOXICITY.summaryScore.value;
            comment.profanity = result.PROFANITY.summaryScore.value;
            comment.severe_toxicity = result.SEVERE_TOXICITY.summaryScore.value;
            comment.insult = result.INSULT.summaryScore.value;
            comment.threat = result.THREAT.summaryScore.value;
        } catch (error) {
            console.error("Error analyzing comment:", error);
        }
    }
}
  return res.status(200).json({data:data})
}