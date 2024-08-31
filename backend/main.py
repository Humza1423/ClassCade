from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the ClassCade Education Backend!"

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
    app.run(debug=True)
