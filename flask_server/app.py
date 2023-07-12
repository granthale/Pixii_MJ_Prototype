from flask import Flask, request, jsonify
from automation import main as automate_main
from flask_cors import CORS
import asyncio
import os
from dotenv import load_dotenv
import requests
import time

app = Flask(__name__)
CORS(app)  # Not secure, but allows for server requests across two local servers

load_dotenv()

# # # # # # # # # # # # # # # ## # # # # # # # # # # # # # # #

completed = {}


async def process_task(prompt):
    await automate_main(prompt)
    image_name = f"{prompt}.png"
    completed[prompt] = image_name


# Route to start the midjourney automation
@app.route("/start_task", methods=["POST"])
def start_task():
    prompt = request.json["prompt"]
    asyncio.run(process_task(prompt))
    return jsonify({"prompt": prompt})


# Route to check the task status and retrieve the image
@app.route("/task_status/<prompt>", methods=["GET"])
def task_status(prompt):
    if prompt not in completed:
        return jsonify({"status": "running"})
    return jsonify({"status": "completed", "image_path": f"{completed[prompt]}"})


# # # # # # # # # # # # # # # ## # # # # # # # # # # # # # # #

if __name__ == "__main__":
    app.run()
