import axios from "axios";
import dotenv from "dotenv";

dotenv.config({});

const API_KEY = process.env.PRESPECTIVE_API_KEY;
const API_URL = process.env.PRESPECTIVE_API_URL + API_KEY;

export async function analyzeComment(text) {
    try {
        const response = await axios.post(API_URL, {
            comment: { text },
            languages: ["en"],
            requestedAttributes: {
                TOXICITY: {},
                SEVERE_TOXICITY: {},
                INSULT: {},
                THREAT: {},
                PROFANITY: {}
            }
        });
        return response.data.attributeScores;
    } catch (error) {
        console.error("Error analyzing comment:", error.response?.data || error.message);
        return null;
    }
}

export async function analyzeAllComments(comments) {
    let prespectiveAnalysis = [];
    for (const comment of comments) {
        const result = await analyzeComment(comment.comment);
        const toxicity = result.TOXICITY.summaryScore.value;
        const profanity = result.PROFANITY.summaryScore.value;
        const severe_toxicity = result.SEVERE_TOXICITY.summaryScore.value;
        const insult = result.INSULT.summaryScore.value;
        const threat = result.THREAT.summaryScore.value;
        prespectiveAnalysis = prespectiveAnalysis.concat({
            author_name: comment.author,
            toxicity: toxicity,
            profanity: profanity,
            severe_toxicity: severe_toxicity,
            insult: insult,
            threat: threat
        })
        // console.log(`Analysis for comment by ${comment.author}:`,`toxicity: ${toxicity}`, `profanity: ${profanity}`, `severe_toxicity: ${severe_toxicity}` , `insult: ${insult}` , `threat: ${threat}` );
    }
    return prespectiveAnalysis;
}

// analyzeAllComments();
