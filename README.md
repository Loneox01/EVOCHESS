# **08/23/2025 - Version 2.1**

Chess content effectively finished. Gamebot prototype available but still incomplete. 

## **PROJECT SETUP:**

### **Frontend/EvoChess:**

There is no domain for the website, however you can locally setup the project with the following instructions:

- In /EvoChess_Frontend
- In the downloaded projects root directory, bash: python3 -m http.server
  - Server is typically set to 8000 by default. Backended is hardcoded for such.  
  - If not, either:  
    - Adjust manually
    - OR
    - Adjust allow_origins in /EvoChess_API/main.py
- You should see:
  - Serving HTTP on :: port 8000 (http://[::]:8000/) ...
- Open a browser and go to http://localhost:8000.  

Game should work now. Gamebot will not crash the server, but will also not function until setup below.

### **Backend/Gamebot:**

- In a second window, in /EvoChess_API
- Create a virtual environment (.venv)
- Install the dependencies in /requirements.txt into venv
  - pip install -r requirements.txt

**Uvicorn**
- Back in /EvoChess_API
- Activate venv
  - source .venv/bin/activate (or whatever venv is named)
- Run:
  - uvicorn main:app --reload --host 0.0.0.0 --port 8001
- You should see:
  - INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)

**Ollama**
- Download and setup ollama app
  - You should see a llama icon somewhere (i.e. on Menu bar for Mac)
- In a third window, in /EvoChess_API
- Run:
  - ollama run llama3:instruct (or a different model, see payload object in runOnce() in /main.py)
- This will install (if not cached) and run the gamebot model

Return to http://localhost:8000 in browser and gamebot should be functional.


## **PROJECT DETAILS:**  

### **EvoChess:**

The EvoChess project is a website to play PVP and PVE games of EvoChess, a unique spin on chess.  
In EvoChess, standard chess pieces (Pawn, King, etc.) can be evolved, granting them additional abilities.  

The project has a PVE storyline where players can play against a basic hand-coded bot in custom levels.  

These custom levels have the standard board setup for white (player) and a unique setup for black (bot), fitting the theme of the level.  
The progression of the story focuses on each individual piece evolution, following the order of: 
- Pawn 
- Knight
- Bishop
- Rook
- Queen
- King  

Each piece evolution gets a PVE level associated/catered towards it, after which said evolution is 'unlocked' for futher levels.  
The finale is a standard board setup where the player chooses 2 evolutions while the bot receives every evolution.  
The project has PVP setups where players alternate turns moving for black/white.  

Some of the PVE levels were adapted to be balanced for PVP.  
The primary PVP game mode (EvoChess) has the standard board setup, with players being able to additionally choose 2 evolved pieces.  
Slight 'rule' changes from standard chess include the following:  

- Game is won/lost when one side has no leftover Kings, a draw is declared if both sides have no leftover Kings on the same turn.  
- Pawns can promote to Kings (For funsies).  
- You are able to move into check/move pinned pieces (most standard 'illegal moves' are legal).  
- You cannot castle in check (King attacked), through check (King moves past attacked square), however you can castle into check (King ends up on attacked square).  
- Evolved pieces exist.   

### **GameBot:**

EvoMartin, the EvoChess Game Chatbot, is a locally hosted NLP model with customized inputs.  
EvoMartin is designed to be specifically for EvoChess.  

EvoMartin is instructed to make tool calls where appropriate to handle dynamic and specific data. 

**For more details visit the webpage or see the project files.**