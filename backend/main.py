from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Replace this with your actual Gemini API key
GEMINI_API_KEY = 'AIzaSyDExY3rKgqPGwxZRrWWXn_qVBoZ38vdmv4'

def generate_questions_from_gemini(text):
    url = "https://gemini.googleapis.com/v1/documents:generateQuestions"  # Example API endpoint
    headers = {
        "Authorization": f"Bearer {GEMINI_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "documentText": text,  # Assuming the API takes the full text and generates questions
        "questionType": "multipleChoice"  # Adjust as needed
    }
    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        return response.json().get('questions', [])
    else:
        return ["Failed to generate questions."]  # Handle errors appropriately

@app.route('/')
def home():
    return "Welcome to the ClassCade Backend!"

@app.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    data = request.json  # Expecting material content as input

    if not data or 'material' not in data:
        return jsonify({"error": "No material provided"}), 400

    # Combine all material content into a single text block
    full_text = " ".join(data['material'])

    # Generate questions using the Gemini API
    quiz_questions = generate_questions_from_gemini(full_text)

    return jsonify({"quiz": quiz_questions})

if __name__ == '__main__':
    app.run(debug=True)
