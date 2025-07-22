tools = [
    {
        "name": "getCurrentLevel",
        "description": "Returns the file name string of the current level. Returns null if no level is selected.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "getCurrentTurn",
        "description": "Returns whose turn it is currently. Returns 'white', 'black' or null if no game is in progress. ",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "getCurrentSelectedPiece",
        "description": "Returns the currently selected piece by the player as a JSON object. Returns null if no piece is selected.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "getCurrentBoard",
        "description": "Returns the current chess board as an 8x8 array. Each element is either null (empty square) or a JSON object representing a piece with its attributes. Returns null if no game is in session.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "getLevelDescriptions",
        "description": "Returns a String description of the input level.",
        "parameters": {
            "type": "object",
            "properties": {
                "levelName": { 
                    "type": "string", 
                    "description": "File name of the level (ex. bishopLevel.js, main.js)" 
                }
            },
            "required": ["levelName"]
        }
    },
    {
        "name": "getPieceDescriptions",
        "description": "Returns a String description of the input piece.",
        "parameters": {
            "type": "object",
            "properties": {
                "pieceName": { 
                    "type": "string", 
                    "description": "Name of the piece (ex. EvoQueen, King)" 
                }
            },
            "required": ["pieceName"]
        }
    },
    {
        "name": "listLevelNames",
        "description": "Returns a list of String level names.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    }
]

# TOOL FUNCTIONS 
currentGameState = {
    "board": None,
    "turn": None,
    "selectedPiece": None,
    "level": None
}

from StaticData.LevelNames import levelNames
from StaticData.LevelDescriptions import levelDescriptions
from StaticData.PieceDescriptions import pieceDescriptions

def getCurrentLevel(params=None):
    print(currentGameState.get("level"))
    # Returns file name string or None
    return currentGameState.get("level")

def getCurrentTurn(params=None):
    # Returns 'white', 'black', or None
    return currentGameState.get("turn")

def getCurrentSelectedPiece(params=None):
    # Returns JSON object of selected piece or None
    return currentGameState.get("selectedPiece")

def getCurrentBoard(params=None):
    # Returns 8x8 array or None
    return currentGameState.get("board")

def getLevelDescriptions(levelName: str):
    # Returns a String description of the input level or "No description available for input level"
    return levelDescriptions.get(levelName, "No description available for input level.")

def getPieceDescriptions(pieceName: str):
    # Returns a String description of the input level or "No description available for input piece"
    return pieceDescriptions.get(pieceName, "No description available for input piece.")

def listLevelNames():
    # Returns a list of Strings representing the valid levelNames
    return levelNames

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/updateState")
async def updateGS(request: Request):
    data = await request.json()
    global currentGameState
    currentGameState = data
    return{"status": "updated"}


async def callTool(toolName: str, parameters: dict = None):
    parameters = parameters or {}

    toolMap = {
        "getCurrentLevel": lambda _: getCurrentLevel(),
        "getCurrentTurn": lambda _: getCurrentTurn(),
        "getCurrentSelectedPiece": lambda _: getCurrentSelectedPiece(),
        "getCurrentBoard": lambda _: getCurrentBoard(),
        "getLevelDescriptions": lambda p: getLevelDescriptions(p.get("levelName")),
        "getPieceDescriptions": lambda p: getPieceDescriptions(p.get("pieceName")),
        "listLevelNames": lambda _: listLevelNames()
    }

    func = toolMap.get(toolName)

    if not func:
        return f"Unknown tool: {toolName}"

    try:
        return func(parameters)
    except Exception as e:
        return f"Error during tool execution: {str(e)}"


    
async def runOnce(prompt: str):
    payload = {
        "model": "mistral",
        "prompt": prompt,
        "max_tokens": 150,
        "temperature": 0.7,
        "stream": False
    }
    ollamaUrl = "http://localhost:11434/api/generate"

    async with httpx.AsyncClient(timeout=30) as client:
        hf_response = await client.post(ollamaUrl, json=payload)
        hf_response.raise_for_status()
        result = hf_response.json()

    return result.get("response", "").strip()


async def recursiveThink(prompt: str, depth: int = 0):  
    # Recursive tool call
    if depth > 2:  
        # Depth limit, avoid token overflow
        return "Depth limit reached."

    generated = await runOnce(prompt)
    try:
        toolCall = json.loads(generated)
        toolName = toolCall.get("tool")
        params = toolCall.get("parameters", {})

        toolResult = await callTool(toolName, params)

        print(f"Tool call requested: {toolName} with parameters: {params}")
        print(f"Tool response: {toolResult}")

        newPrompt = (
            prompt +
            f"\nTool called: {toolName}" +
            f"\nParameters: {json.dumps(params)}" +
            f"\nTool response: {json.dumps(toolResult)}" +
            "\nAssistant:"
        )
        return await recursiveThink(newPrompt, depth + 1)  
    except json.JSONDecodeError:
        # No tool call, return raw text
        return generated or "No response"

@app.post("/ask")
async def ask(request: Request):
    data = await request.json()
    userMessage = data.get("message", "")

    systemPrompt = """
You are EvoMartin, a helpful assistant for EvoChess, a game that evolves traditional chess with piece upgrades.  
Your role is to help players understand the mechanics and interface of EvoChess. Only if prompted, you may help players strategize ideas.
However, you must not suggest or evaluate specific moves.

PROJECT OVERVIEW:  
- The EvoChess project is a web-based chess project that includes a number of levels for the user to play.  
- These levels are split into only 1 of 2 categories: PVP or PVE (Player vs Player/Enemy). 
- PVE:  
-- There 7 PVE levels total, 6 themed levels for each Evolved Piece and a finale.  
-- The PVE levels follow a story progression, introducing each Evolved Piece 1 by 1.  
-- The progression is as follows: (Pawn, Knight, Bishop, Rook, Queen, King, Finale).  
-- Each PVE level allows the player access to all the prior evolution (i.e. the bishopLevel can access EvoPawn and EvoKnight, Finale can access all 6 Evos, etc).  
-- Although the levels are designed to be played in succession, they are all unlocked by default for player convenience.  
-- The White pieces (player) always starts with the standard chess setup with some pieces evolved, dependent on level.  
-- The Black pieces are played by a game bot, whose logic depends on the level, retrievable from the tool getLevelDescriptions.  
-- The Black pieces (game bot) has a themed starting board, detailed in the tool getLevelDescriptions.  
-- If the Black pieces promote a pawn, it will always promote to a queen regardless of level.  
- PVP:  
-- EvoChess (PVPevoc.js file name) is the standard game for the EvoChess project. It's a PVP level.  
-- However, there are multiple PVP levels aside from it, some themed around a PVE equivalent.  
-- In such levels, the initial board setup of the Black pieces is slightly different for game balance.  
-- The White pieces (player) always starts with the standard chess setup with some pieces evolved, dependant on level.  
-- The Black pieces (player2) has a themed starting board, detailed in the tool getLevelDescriptions.  
- General Game System:  
-- The white pieces always start at the bottom, and the black pieces at the top.  
-- Some levels have "evolution selectors" where player(s) can select 0, 1 or 2 evolutions.  
-- Available selection is dependent on level, detailed in the tool getLevelDescriptions.  
-- If it exists, the selector for the white pieces is 2 dropdown menus below the board.  
-- If it exists, the selector for the black pieces is 2 dropdown menus above the board.  
-- For levels with selectors, when the game (re)starts, players must (re)select evolutions.  
-- Players can click a piece of the current colors turn to select a piece, then click a square marked with a gray dot to move the selected piece there.  
-- When the player evolves a pawn, a dropdown menu is shown and the game is paused until a selection is made.    

GAME MECHANICS:  
- The following rules apply to every level in the EvoChess project, anything unmentioned should be assumed to align with standard chess.  
-- Game is won/lost when one side has no leftover Kings, a draw is declared ONLY if both sides have no leftover Kings on the same turn.  
-- All Pawns can promote to Regular Kings.  
-- You are able to move into check/move pinned pieces.  
-- You cannot castle in check (King attacked), through check (King moves past attacked square), however you can castle into check (King ends up on attacked square).  
-- Evolved pieces exist, each one detailed in the tool getPieceDescriptions.  

PIECE STRUCTURE:  
- Do not assume the abilities or interactions of Evolved Pieces. You must refer to the tool getPieceDescriptions.  
- You may assume the abilities or interactions of the standard Pieces. For ambiguities, you must refer to the tool getPieceDescriptions.
- You may assume piece names (i.e. Bishop, EvoKing, EvoPawn, etc).  

LEVEL STRUCTURE:  
- Only use information about levels from the tool getLevelDescriptions.
- You must not guess or assume level names, use the tools getCurrentLevel or listLevelNames to get proper levelNames

IN-GAME STRUCTURE:
- Only use the following tools for information about in-game structure (such as the current board, level, selected piece, turn, etc)
-- getCurrentLevel (returns the current Level the user is on or null)
-- getCurrentTurn (returns the current Turn the user is on or null)
-- getCurrentSelectedPiece (returns the current selected piece by the user or null)
-- getCurrentBoard (returns the 8x8 board the user is currently playing on or null)

ANSWERING STRUCTURE:  
- Do NOT evaluate chess move strength in any way or form.  
-- If prompted, inform the user you cannot suggest moves or evaluate move strength.  
-- When making claims about chess moves, they must be objective, such as if a move is valid or not.  
- Otherwise, when asked about any chess moves, answer in algebraic chess notation. For this notation ONLY, consider Evolved Pieces as their standard counterparts.  
- Keep your explanations under 150 tokens unless the user requests more detail. If the response exceeds the limit, summarize or be more concise.  


INSTRUCTION:  
Always answer based on EvoChess rules. If more information is needed (e.g. player level, piece selected), call tools as appropriate.  
If you need information from EvoChess tools (like level or piece descriptions, current board, etc.), respond with a JSON object indicating the tool name and parameters.

Example:
{"tool": "getLevelDescriptions", "parameters": {"levelName": "bishopLevel"}}
{"tool": "getPieceDescriptions", "parameters": {"pieceName": "EvoQueen"}}

The other tools have no required inputs. If no tool call is needed, respond normally. 

TOOL CALL RULES: FOLLOW STRICTLY
- IF YOU CHOOSE TO CALL A TOOL, IGNORE ALL OTHER INSTRUCTIONS AND ONLY FOLLOW THE RULES BELOW. 
-- Do not call tools using placeholders, variable names, or references to other tools.  
-- Do not chain or nest tool calls.  
--- YOU MUST NOT MAKE A CALL LIKE THIS: 
{
  "tool": "getPieceDescriptions",
  "parameters": {
    "pieceName": "getCurrentSelectedPiece"
  }
}
Call ONLY the most immediate tool, like such: 
{
  "tool": "getCurrentSelectedPiece"
}
-- Only issue one tool call at a time, and only when you are confident the input is complete and resolvable.  
-- If you need information from another tool first, do not call anything yet — instead, ask for or wait to receive that information.  
-- Only call a tool if all required parameters are already known or can be directly inferred from the prompt or conversation history.  
-- If you decide to use a tool, you must respond with only a valid JSON object, with no extra text, explanation, or formatting.  
-- Do not surround it with Markdown, quotes, or comments.  
-- Do not include any assistant text. Just the raw JSON.  

"""

    fullPrompt = systemPrompt + "\nUser: " + userMessage + "\nAssistant:"  

    answer = await recursiveThink(fullPrompt)  
    return {"response": answer}
