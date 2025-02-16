import axios from "axios";

// Enter your new YouTube API Key here
const API_KEY = process.env.YT_API_KEY; // Replace with your new API Key

let quotaUsed = 0;

// Get Channel ID from Username or Custom Handle (@username)
async function getChannelId(username) {
    quotaUsed += 1;
    // console.log(`Quota used: ${quotaUsed}`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${username}&key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        if (response.data.items.length > 0) {
            return response.data.items[0].snippet.channelId;
        }
        return null;
    } catch (error) {
        console.error("Error fetching channel ID:", error.response?.data || error.message);
        return null;
    }
}

// Get Video IDs from Channel
async function getVideoIds(channelId, maxResults = 10) { // Reduced to 3 videos for testing
    quotaUsed += 1;
    // console.log(`Quota used: ${quotaUsed}`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        return response.data.items.map(item => item.id.videoId);
    } catch (error) {
        console.error("Error fetching videos:", error.response?.data || error.message);
        return [];
    }
}

// Get Video Statistics and Thumbnail
async function getVideoDetails(videoId) {
    quotaUsed += 1;
    // console.log(`Quota used: ${quotaUsed}`);
    const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        const video = response.data.items[0];
        return {
            statistics: video.statistics,
            thumbnails: video.snippet.thumbnails
        };
    } catch (error) {
        console.error(`Error fetching details for video ${videoId}:`, error.response?.data || error.message);
        return null;
    }
}

// Get Comments from a Video
async function getComments(videoId, maxResults = 5) {
    quotaUsed += 1;
    // console.log(`Quota used: ${quotaUsed}`);
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        return response.data.items.map(item => ({
            author: item.snippet.topLevelComment.snippet.authorDisplayName,
            comment: item.snippet.topLevelComment.snippet.textDisplay
        }));
    } catch (error) {
        console.error(`Error fetching comments for video ${videoId}:`, error.response?.data || error.message);
        return [];
    }
}

// Main Function
export async function main(username) {
    if (!username) {
        console.log("Username cannot be empty.");
        return null; // Return null if username is empty
    }

    // console.log(`Fetching data for channel: ${username}...`);
    const channelId = await getChannelId(username);
    if (!channelId) {
        console.log("Channel not found.");
        return null; // Return null if channel is not found
    }

    const videoIds = await getVideoIds(channelId, 10); // Fetch only 3 videos for testing
    if (!videoIds.length) {
        console.log("No videos found.");
        return null; // Return null if no videos are found
    }

    let data = {
        channel: username,
        total_videos: videoIds.length,
        videos: []
    };

    for (let videoId of videoIds) {
        // console.log(`Fetching data for video: ${videoId}...`);
        const videoDetails = await getVideoDetails(videoId);
        const comments = await getComments(videoId);

        if (videoDetails) {
            data.videos.push({
                video_id: videoId,
                likes: videoDetails.statistics ? videoDetails.statistics.likeCount : "N/A",
                comments_count: videoDetails.statistics ? videoDetails.statistics.commentCount : "N/A",
                views: videoDetails.statistics ? videoDetails.statistics.viewCount : "N/A",
                thumbnails: videoDetails.thumbnails, // Add thumbnails to the response
                top_comments: comments
            });
        }
    }

    // Return the data as a JSON string
    return JSON.stringify(data, null, 4);
}