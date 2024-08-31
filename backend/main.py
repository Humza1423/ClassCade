from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
import google.generativeai as genai # Use this for the AI
import json

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the ClassCade Education Backend!"

@app.route('/create_classroom', methods=['POST'])
def create_classroom():
    data = request.json

@app.route('/edit_classroom/<str:action>', methods=['POST'])
def create_classroom():
    data = request.json

@app.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    data = request.json  # Expecting material content as input

    # Combine all material content into a single text block
    full_text = " ".join(data['material'])

    # Generate questions (placeholder for now)
    quiz_questions = generate_questions(full_text)

    return jsonify({"quiz": quiz_questions})

def generate_questions(text):
    # Placeholder function for generating questions
    # Replace this with actual API call or logic later
    return [f"Generated question from: {text}"]

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
