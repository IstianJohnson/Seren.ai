from flask import Flask, render_template, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

# Configure the API key
genai.configure(api_key="AIzaSyAc3ANk0hxq67c6gy6ZAapVTnFglqexTLA")

# Set up the generation configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Create the generative model instance
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

# Start a chat session
chat_session = model.start_chat(history=[])


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/send-message', methods=['POST'])
def send_message():
    user_message = request.json['message'].lower()  # Convert message to lowercase for easier comparison

    # Check for questions related to identity
    if "who are you" in user_message or "what is your name" in user_message:
        return jsonify({'reply': "I am Seren."})

    # Check for questions about ownership
    elif "who is your owner" in user_message or "who made you" in user_message:
        return jsonify({'reply': "I was created by Gog, Alice, Bob, and Charlie."})

    # Check for farewell messages
    elif "bye" in user_message or "see you" in user_message or "goodbye" in user_message:
        return jsonify({'reply': "Bye!", 'refresh': True})

    # Get the chatbot's response from the Generative AI for other questions
    response = chat_session.send_message(user_message)
    
    # Send back the chatbot's response to the front-end
    return jsonify({'reply': response.text})


if __name__ == '__main__':
    app.run(debug=True)
