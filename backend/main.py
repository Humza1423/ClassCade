from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
import google.generativeai as genai # Use this for the AI
import json
import requests
import subprocess
import os

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

@app.route('/create_classroom', methods=['POST'])
def create_classroom():
    data = request.json

@app.route('/edit_classroom/<string:action>', methods=['POST'])
def edit_classroom():
    data = request.json

@app.route('/run_game', methods=['GET', 'POST'])
def launch_game():
    script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'game', 'main2.py'))
    result = subprocess.run(['python', script_path], capture_output=True, text=True)
    return f"Script output:\n{result.stdout}"


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
