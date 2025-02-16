import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getBotResponse(text, lang = "auto") {
    return new Promise((resolve, reject) => {
        const chatbotPath = join(__dirname, "chatbot.py");
        const pythonProcess = spawn("python3", [chatbotPath], {
            env: { ...process.env,   GROQ_API_KEY: process.env.GROQ_API_KEY }
        });

        pythonProcess.stdin.write(JSON.stringify({ text, lang }) + "\n");
        pythonProcess.stdin.end();

        let responseData = "";

        pythonProcess.stdout.on("data", (data) => {
            responseData += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error("Python Error:", data.toString());
        });

        pythonProcess.on("close", (code) => {
            try {
                const result = JSON.parse(responseData);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    });
}

export const chatbot = async (req, res) => {

    const message = req.body.message.text;
    const language = req.body.language.name;

    // console.log(message, " ", language)
    try {
        const botAns = await getBotResponse(message, language);
        // console.log(botAns);
        return res.status(201).json({ 
            message: botAns, 
            success: true,
        });
    } catch (error){
        console.error("Error fetching chatbot response:", error.message); // Log the error
        return res.status(500).json({ 
            message: "Error Fetching Chatpot Response, please try again later", 
            success: false, 
            error: error.message 
        });
    }
};