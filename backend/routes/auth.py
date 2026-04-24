# routes/auth.py
from flask import Blueprint, request, jsonify
from db.mongo import users_collection
import bcrypt
from utils.auth import generate_token

auth = Blueprint("auth", __name__)

def db_available():
    """تتحقق إذا MongoDB متصلة"""
    return users_collection is not None

# ─── REGISTER ─────────────────────────────────────────────────────────────────
@auth.route("/register", methods=["POST"])
def register():
    if not db_available():
        return jsonify({"error": "Database not available"}), 503

    data = request.json

    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400

    if users_collection.find_one({"email": data["email"]}):
        return jsonify({"error": "User already exists"}), 400

    hashed_pw = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())

    user = users_collection.insert_one({
        "name":     data.get("name", ""),
        "email":    data["email"],
        "password": hashed_pw,
    })

    token = generate_token(user.inserted_id, data["email"])
    return jsonify({"token": token, "email": data["email"], "name": data.get("name", "")})


# ─── LOGIN ────────────────────────────────────────────────────────────────────
@auth.route("/login", methods=["POST"])
def login():
    if not db_available():
        return jsonify({"error": "Database not available"}), 503

    data = request.json

    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400

    user = users_collection.find_one({"email": data["email"]})

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not bcrypt.checkpw(data["password"].encode(), user["password"]):
        return jsonify({"error": "Wrong password"}), 401

    token = generate_token(user["_id"], user["email"])
    return jsonify({"token": token, "email": user["email"], "name": user.get("name", "")})