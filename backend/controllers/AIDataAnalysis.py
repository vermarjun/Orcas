import os
import sys
import json
import logging
import google.generativeai as genai

# Suppress all logs
logging.basicConfig(level=logging.CRITICAL)

# Configure the API key using environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Create the model with configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config=generation_config,
    system_instruction="You are an AI assistant. Respond helpfully.",
)

def chat_with_gemini(data):
    user_input = f"I have attached data of all the posts on trending topics across various platforms, based on this data I am going to create a new post. Respond with a JSON object with valid fields as below based on the context provided. Only use this context, don't hallucinate and be creative. You have to make an eye-catching title and a script for my new post. You are really great and can write something really beautiful. Example JSON output: 'recommended_title': 'xyz', 'recommended_script': 'xyz'. This is the provided context, use this to make up your answer: {data}"
    try:
        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(user_input)
        return response.text.strip()
    except Exception as e:
        return json.dumps({"error": str(e)})

def main():
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        data = json.loads(input_data).get("text", "")

        if not data:
            print(json.dumps({"error": "No input data provided"}))
            sys.stdout.flush()
            return

        bot_response = chat_with_gemini(data)

        # Return JSON response
        print(json.dumps({"response": bot_response}))
        sys.stdout.flush()

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.stdout.flush()

if __name__ == "__main__":
    main()