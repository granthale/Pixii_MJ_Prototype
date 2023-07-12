# This is a working prototype of an OpenAI and Midjourney image generator for Pixii.ai

# In order to run with The Next Leg API Midjourney implementation
0. Download dependencies
1. Replace API key variables
    - In react/src/Components/Dalle.tsx, input OpenAI api_key
    - In react/src/Components/Midjourney.tsx input TNL api_key
2. cd into react - run npm run dev
3. Open react link
4. Happy generating

# In order to run with Python/Discord automated solution
0. Uncomment "Python/Discord automated solution" section in Midjourney.tsx & comment out "The Next Leg (TNL) Solution"
1. Download dependencies
2. Create .env file in flask_server - create five variables
    - DISCORD_USERNAME, DISCORD_PASSWORD, TNL_API_KEY, DISCORD_SERVER_ID, DISCORD_CHANNEL_ID
    - Input information accordingly
3. Replace API key variables
    - In react/src/Components/Dalle.tsx, input OpenAI api_key
    - In react/src/Components/Midjourney.tsx input TNL api_key
4. cd into react - run npm run dev
5. In a separate terminal, cd into flask_server, run python -m flask run
6. Open react link
7. Happy generating!
