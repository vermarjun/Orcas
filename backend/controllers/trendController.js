import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import axios from "axios";
import { google } from "googleapis";
import pkg from "youtube-transcript";
const { getTranscript } = pkg;

const YT_API_KEY = process.env.YT_API_KEY;
const SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const VIDEO_DETAILS_URL = "https://www.googleapis.com/youtube/v3/videos";

// Create YouTube API client
const youtube = google.youtube({
    version: "v3",
    auth: YT_API_KEY,
  });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const API_KEY = process.env.YT_API_KEY;

// fetch yt trending videos
async function fetchYtTrending() {
    try {
        const params = {
            part: "snippet,statistics",
            chart: "mostPopular", // Fetch trending videos
            regionCode: "IN", // Change to desired country (e.g., "US" for the USA)
            maxResults: 10, // Get top 10 videos
            key: API_KEY
        };

        const response = await axios.get("https://www.googleapis.com/youtube/v3/videos", { params });
        const data = response.data;

        if (!data.items) {
            console.log("No trending videos found or API quota exceeded.");
            return [];
        }

        const videoList = data.items.map(video => ({
            views: video.statistics.viewCount || "N/A",
            thumbnail: video.snippet.thumbnails.high.url,
            source: "yt",
            title: video.snippet.title || "N/A", // Add title
            caption: video.snippet.description || "N/A" // Add caption (description)
        }));

        return videoList;
    } catch (error) {
        console.error("Error fetching trending videos:", error.message);
        return [];
    }
}

// fetch reddit trending topics
async function fetchReddit() {
    const USER_AGENT = "my_reddit_app"; // Reddit requires a unique User-Agent
    const INDIAN_SUBREDDITS = ["india"];
    const REDDIT_API_URL = `https://www.reddit.com/r/${INDIAN_SUBREDDITS.join("+")}/hot.json?limit=10`;

    try {
        const response = await axios.get(REDDIT_API_URL, {
            headers: {
                "User-Agent": USER_AGENT, // Reddit requires a User-Agent header
            },
        });

        const trendingTopics = response.data.data.children.map(post => ({
            views: post.data.ups + post.data.num_comments, // Approximate views as upvotes + comments
            source: "reddit",
            thumbnail: post.data.thumbnail || null, // Thumbnail of the post, if available
            title: post.data.title, // Title of the post
            url: `https://www.reddit.com${post.data.permalink}`, // URL to the post
            subreddit: post.data.subreddit // Subreddit where the post is from
        }));

        // Sort by views (most popular first)
        trendingTopics.sort((a, b) => b.views - a.views);

        return trendingTopics;
    } catch (error) {
        console.error("Error fetching data:", error.message);
        return [];
    }
}

// generate AI recommendations function
async function fetchAiRecommendations(text) {
    return new Promise((resolve, reject) => {
        // Path to the Python script
        const pythonScriptPath = join(__dirname, "AIDataAnalysis.py");

        // Spawn the Python process
        const pythonProcess = spawn("python3", [pythonScriptPath], {
            env: {
                ...process.env,
                GEMINI_API_KEY: process.env.GEMINI_API_KEY,
            },
        });

        // Send the input text to the Python process
        pythonProcess.stdin.write(JSON.stringify({ text }) + "\n");
        pythonProcess.stdin.end();

        let responseData = "";

        // Collect data from the Python process's stdout
        pythonProcess.stdout.on("data", (data) => {
            responseData += data.toString();
        });

        // Handle errors from the Python process's stderr
        let errorData = "";
        pythonProcess.stderr.on("data", (data) => {
            errorData += data.toString();
        });

        // Handle process closure
        pythonProcess.on("close", (code) => {
            if (code !== 0) {
                // If the process exits with a non-zero code, treat it as an error
                reject(new Error(`Python process exited with code ${code}. Error: ${errorData}`));
                return;
            }

            try {
                // Parse the response data as JSON
                const result = JSON.parse(responseData);
                resolve(result);
            } catch (error) {
                // If JSON parsing fails, treat it as an error
                reject(new Error(`Failed to parse Python output: ${error.message}. Output: ${responseData}`));
            }
        });
    });
}


// fetch trending topics from yt, twitter, insta, reddit
export const fetchTrendingTopics = async (req, res) => {
    const ytTopics = await fetchYtTrending();
    const redditTopics = await fetchReddit();
    res.status(200).json({
        ytTopics: ytTopics,
        redditTopics: redditTopics,
        success: true
    })
};

async function fetchRedditData(searchQuery) {
    return new Promise((resolve, reject) => {
        // Path to the Python script
        const pythonScriptPath = join(__dirname, "fetchRedditData.py");

        // Spawn the Python process
        const pythonProcess = spawn("python3", [pythonScriptPath], {
            env: {
                ...process.env,
                REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID,
                REDDIT_CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET,
                REDDIT_USER_AGENT: process.env.REDDIT_USER_AGENT,
            },
        });

        // Send the search query as input to the Python process
        pythonProcess.stdin.write(JSON.stringify({ search_query: searchQuery }) + "\n");
        pythonProcess.stdin.end();

        let responseData = "";

        // Collect data from the Python process's stdout
        pythonProcess.stdout.on("data", (data) => {
            responseData += data.toString();
        });

        // Handle errors from the Python process's stderr
        pythonProcess.stderr.on("data", (data) => {
            console.error("Python Error:", data.toString());
            reject(new Error(data.toString()));
        });

        // Handle process closure
        pythonProcess.on("close", (code) => {
            if (code !== 0) {
                reject(new Error(`Python process exited with code ${code}`));
                return;
            }

            try {
                // Parse the response data as JSON
                const result = JSON.parse(responseData);
                resolve(result);
            } catch (error) {
                reject(new Error(`Failed to parse Python output: ${error.message}`));
            }
        });
    });
}


async function searchVideos(query, maxResults = 5) {
  const response = await youtube.search.list({
    q: query,
    part: "id,snippet",
    type: "video",
    maxResults: maxResults,
  });

  return response.data.items.map((item) => ({
    id: item.id.videoId,
  }));
}

async function getVideoTranscript(videoId) {
  try {
    const transcript = await getTranscript(videoId);
    return transcript.map((entry) => entry.text).join(" "); // Combine transcript text
  } catch (error) {
    return null; // Return null if transcript is unavailable
  }
}

async function fetchVideoTranscripts(query) {
  try {
    // Search for videos related to the query
    const videos = await searchVideos(query);

    // Fetch transcripts for each video
    const transcripts = await Promise.all(
      videos.map(async (video) => {
        const transcript = await getVideoTranscript(video.id);
        return { transcript }; // Return only the transcript field
      })
    );

    // Filter out videos with no transcript
    return transcripts.filter((item) => item.transcript !== null);
  } catch (error) {
    console.error("Error fetching video transcripts:", error);
    return []; // Return an empty array in case of error
  }
}

// fetch transcript and comments of top trending videos on x topic on all available platforms
async function fetchTrendingTopicsData( topic ) {
    const redditData = await fetchRedditData(topic);
    const ytTranscript = await fetchVideoTranscripts(topic);
    console.log(redditData)
    console.log(ytTranscript)
    const data = [...(redditData.post_titles), ytTranscript];
    return data;
}

// Fetch video tags from the YouTube API
async function fetchVideoTags(videoId) {
    try {
        const videoParams = {
            part: "snippet",
            id: videoId,
            key: YT_API_KEY,
        };

        const response = await axios.get(VIDEO_DETAILS_URL, { params: videoParams });
        const videoData = response.data.items[0];

        return videoData?.snippet?.tags || ["No tags found"];
    } catch (error) {
        console.error(`Error fetching tags for video ${videoId}:`, error.response?.data || error.message);
        return ["No tags found"];
    }
}

// Function to fetch YouTube videos and return SEO tags and thumbnail links
async function fetchYouTubeVideos(topic) {
    try {
        const searchParams = {
            part: "snippet",
            q: topic,
            key: YT_API_KEY,
            maxResults: 10, // Fetch top 10 videos
            type: "video",
        };

        const response = await axios.get(SEARCH_URL, { params: searchParams });
        const videos = response.data.items;

        if (!videos.length) {
            console.log("No results found.");
            return [[], []]; // Return empty arrays if no videos are found
        }

        const seoTagsArray = [];
        const thumbnailLinksArray = [];

        for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            const videoId = video.id.videoId;
            const thumbnailUrl = video.snippet.thumbnails.high.url;

            // Fetch and store video tags
            const tags = await fetchVideoTags(videoId);
            seoTagsArray.push(tags);

            // Store thumbnail URL
            thumbnailLinksArray.push(thumbnailUrl);
        }

        return [seoTagsArray, thumbnailLinksArray];
    } catch (error) {
        console.error("Error fetching videos:", error.response?.data || error.message);
        return [[], []]; // Return empty arrays in case of an error
    }
}

export const fetchSeoThumbnails = async(req, res) => {
    const { topic } = req.body;
    const [seoTags, thumbnailLinks] = await fetchYouTubeVideos(topic);
    res.status(200).json({
        seoTags: seoTags,
        thumbnailLinks: thumbnailLinks
    })
}

// generating AI recommendations finally
export const fetchAIAnalysis = async(req, res) => {
    const { topic } = req.body;
    const data = await fetchTrendingTopicsData(topic);
    const aIRecommendations = await fetchAiRecommendations(data);
    res.status(200).json({
        aIRecommendations: aIRecommendations
    })
}