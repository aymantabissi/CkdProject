# routes/chat.py
from flask import Blueprint, request, jsonify # <--- Had l-import drouri t-zidu hna
from groq import Groq

# Create Blueprint
chat_bp = Blueprint('chat', __name__)

# API Key dyalk
client = Groq(api_key="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")

@chat_bp.route('/chat', methods=['POST'])
def chat_with_groq():
    try:
        data = request.json
        user_message = data.get("message")

        if not user_message:
            return jsonify({"error": "Message vide"}), 400

        completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "Tu es NephroAI, un assistant médical expert en maladie rénale chronique. Réponds en français, arabe ou anglais selon la langue de l'utilisateur."
                },
                {"role": "user", "content": user_message}
            ],
            model="llama-3.1-70b-versatile"
        )
        return jsonify({"reply": completion.choices[0].message.content})
    except Exception as e:
        print(f"DEBUG CHATBOT ERROR: {str(e)}")
        return jsonify({"error": str(e)}), 500