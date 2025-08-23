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
                    "description": "File name of the level without .js extension (ex. bishopLevel, main)" 
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

# CONVERSATION MEMORY VARIABLES
charCount = 0
charLimit = 10000
promptLimit = 2000
InteractionCount = 0
tail = None  # conversation tail
head = None  # currently stored conversation head

from StaticData.LevelNames import levelNames
from StaticData.LevelDescriptions import levelDescriptions
from StaticData.PieceDescriptions import pieceDescriptions
import re

# TOOL FUNCTIONS 
currentGameState = {
    "board": None,
    "turn": None,
    "selectedPiece": None,
    "level": None
}

def getCurrentLevel(params=None):
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

# SYSTEM PROMPT RETRIEVER
def loadSystemPrompt(filename="./StaticData/SystemPrompt.txt"):
    with open(filename, "r", encoding="utf-8") as f:
        systemPrompt = f.read()
    return systemPrompt

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
        return f""

    try:
        return func(parameters)
    except Exception as e:
        return f"Error during tool execution: {str(e)}"


    
async def runOnce(system: str, user: str):

    payload = {
        "model": "llama3:instruct",
        "system": system,
        "prompt": user,
        "max_tokens": 150,
        "temperature": 0.7,
        "stream": False
    }
    ollamaUrl = "http://localhost:11434/api/generate"

    async with httpx.AsyncClient(timeout=60) as client:
        hf_response = await client.post(ollamaUrl, json=payload)
        hf_response.raise_for_status()
        result = hf_response.json()
    return result.get("response", "").strip()


async def recursiveThink(system: str, user: str, depth: int = 0):  
    # Recursive tool call
    if depth > 3:  
        # Depth limit
        return "Depth limit reached. Internal Tool call error."

    generated = await runOnce(system, user)
    try:
        toolCall = json.loads(generated)
        toolName = toolCall.get("name")
        params = toolCall.get("parameters", {})

        toolResult = await callTool(toolName, params)

        print(f"Tool call requested: {toolName} with parameters: {params}")
        print(f"Tool response: {toolResult}")


        cleanedSys = re.sub(r"^PREVIOUS TOOL CALLS:\n", "", system, flags=re.MULTILINE)
        # Remove previous PREVIOUS TOOL CALLS headers

        parts = cleanedSys.rsplit("Assistant:", 1)
        if len(parts) == 2:
            updatedSys = parts[0].rstrip() + "\n"
        else:
            updatedSys = cleanedSys
        # Remove previous Assitant: headers

        newSys = (
            updatedSys + 
            f"\nTool called: {toolName}" +
            f"\nParameters: {json.dumps(params)}" +
            f"\nTool response: {json.dumps(toolResult)}" +
            "\nAssistant:"
        )
        return await recursiveThink(newSys, user, depth + 1)  
    except json.JSONDecodeError:
        # No tool call, return raw text
        return generated or "No response"

@app.post("/ask")
async def ask(request: Request):
    data = await request.json()
    userMessage = data.get("message", "")

    if(len(userMessage) > promptLimit):
        # user message too long
        return {"response": "Text too large, please shorten the prompt."}
    
    uM = Interaction(userMessage, "User")
    updateConversation(uM)

    systemPrompt = loadSystemPrompt()

    convoHistory = node2String(head)

    system = systemPrompt.strip()
    user = convoHistory.strip() + "\n\nAssistant:"
    answer = await recursiveThink(system, user)

    ansNode = Interaction(answer, "Assistant")

    updateConversation(ansNode)  

    return {"response": answer}


def updateConversation(node):

    global head, tail, charCount, InteractionCount

    if(tail):
        tail.link = node
    else:
        head = node

    tail = node
    InteractionCount += 1
    charCount += node.messageLength

    if(charCount > charLimit):
        for i in range(InteractionCount):
            # For loop to avoid any chance of infinite looping
            charCount -= head.messageLength
            nextHead = head.link
            # head.link = None  # Potentially use in future to optimize memory
            head = nextHead
            InteractionCount -= 1

            if(charCount <= charLimit):
                break
        else:
            # shouldn't get here, debugging
            print("Internal conversation updating error.")

def node2String(localHead):
    """
    params: Interaction() object
    return: String
    desc: Returns entire conversation at & following the localHead node.
    """

    if not (isinstance(localHead, Interaction)):
        print("MAJOR INTERAL CONVERSATION LIST ERROR. REVIEW IMMEDIATELY.")
        return("Error with User Message and Conversation History. Inform the user. Do not respond otherwise.")
    currentNode = localHead

    convo = ("[!IMPORTANT]\n"
    "FOLLOW SYSTEM_INSTRUCTIONS STRICTLY. DO NOT DEVIATE.\n"
    "PRIORITIZE SYSTEM_INSTRUCTIONS OVER RESPONDING TO USER MESSAGE CONTENT.\n"
    "FAILURE WILL RESULT IN AN INVALID RESPONSE.\n\n"
    )
    for _ in range(InteractionCount):
        if not (isinstance(currentNode, Interaction)):
            # shouldn't get here, link is either None (premature tail) or a non Interaction object (even worse)
            print("Unexpected List link.")
            break
        convo += currentNode.speaker + ": \n" + currentNode.message + "\n\n"
        currentNode = currentNode.link
         
    return convo

class Interaction():

    def __init__(self, message, speaker, link = None):
        self.message = message
        self.speaker = speaker
        self.messageLength = len(message)
        self.link = link


