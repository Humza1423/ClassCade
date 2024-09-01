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

#Gemini API key
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

# Define the effects of assessments on player stats
ASSESSMENT_EFFECTS = {
    'summative': {
        'project': {'health': 10, 'strength': 20, 'speed': 10, 'defense': 5},
        'lab': {'health': 5, 'strength': 10, 'speed': 15, 'defense': 10},
        'essay': {'health': 8, 'strength': 15, 'speed': 5, 'defense': 7},
        'test': {'health': 7, 'strength': 18, 'speed': 8, 'defense': 6},
        'exam': {'health': 12, 'strength': 25, 'speed': 9, 'defense': 8},
        'quiz': {'health': 3, 'strength': 5, 'speed': 7, 'defense': 2},
        'presentation': {'health': 10, 'strength': 10, 'speed': 10, 'defense': 10},
        'other': {'health': 5, 'strength': 5, 'speed': 5, 'defense': 5},
    },
    'formative': {
        'project': {'health': 5, 'strength': 10, 'speed': 5, 'defense': 5},
        'lab': {'health': 2, 'strength': 5, 'speed': 10, 'defense': 5},
        'essay': {'health': 4, 'strength': 8, 'speed': 3, 'defense': 4},
        'test': {'health': 3, 'strength': 9, 'speed': 4, 'defense': 3},
        'exam': {'health': 6, 'strength': 12, 'speed': 5, 'defense': 5},
        'quiz': {'health': 2, 'strength': 3, 'speed': 4, 'defense': 2},
        'presentation': {'health': 5, 'strength': 5, 'speed': 5, 'defense': 5},
        'other': {'health': 3, 'strength': 3, 'speed': 3, 'defense': 3},
    }
}

def calculate_stat_effects(assessments):
    player_stats = {'health': 0, 'strength': 0, 'speed': 0, 'defense': 0}

    for assessment in assessments:
        assessment_type = assessment['assessment_type']
        assignment_type = assessment['assignment_type']
        if assessment_type in ASSESSMENT_EFFECTS and assignment_type in ASSESSMENT_EFFECTS[assessment_type]:
            effects = ASSESSMENT_EFFECTS[assessment_type][assignment_type]
            player_stats['health'] += effects.get('health', 0)
            player_stats['strength'] += effects.get('strength', 0)
            player_stats['speed'] += effects.get('speed', 0)
            player_stats['defense'] += effects.get('defense', 0)

    return player_stats


@app.route('/update_stats', methods=['POST'])
def update_stats():
    data = request.form['stats']
    print(data)
    data = json.loads(data)
    print('DATAINJSON',data)
    updated_stats = calculate_stat_effects(data)
    return jsonify(updated_stats)




if __name__ == '__main__':
    app.run(host='192.168.2.66', port=5000, debug=True, threaded=False) # Change host to your local IP address
