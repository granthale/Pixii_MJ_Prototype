# This is a working prototype of a Dall-E and Midjourney image generator.

# In order to run website
0. Download dependencies
1. Create .env file in flask_server - create five variables
    - DISCORD_USERNAME, DISCORD_PASSWORD, TNL_API_KEY, DISCORD_SERVER_ID, DISCORD_CHANNEL_ID
    - Input information accordingly
2. Replace API key variables
    - In react/src/Components/Dalle.tsx, input OpenAI api_key
    - In react/src/Components/Midjourney.tsx input TNL api_key
3. cd into react - run npm run dev
4. In a separate terminal, cd into flask_server, run python -m flask run
5. Open react link
5. Happy generating!
