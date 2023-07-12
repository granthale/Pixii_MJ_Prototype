from flask import Flask, request, jsonify
from automation import main as automate_main
from flask_cors import CORS
import asyncio
import os
from dotenv import load_dotenv

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

from midjourney_api import TNL

image_urls_from_tnl = []


# TNL Solution
@app.route("/generate_image/<prompt>", methods=["GET"])
def generate_image(prompt):
    tnl = TNL(os.getenv("TNL_API_KEY"))
    response = tnl.imagine(prompt)
    return response


# Need internet-accessible webhook to receive images from TNL
    # This has currently been tested locally with ngrok-generated urls
@app.route("/webhook", methods=["POST"])
def webhook():
    data = request.get_json()
    print(data)
    #  TODO
        # Download URLs into static 
        # get prompt
        # update completed with {prompt}.png

        # Display multiple images correctly in React


if __name__ == "__main__":
    app.run()
