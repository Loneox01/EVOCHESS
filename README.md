As of Version 1.63:

Project is mostly finished, here is a general overview of what EvoChess is.

**PROJECT SETUP:**

There is no domain for the website, however you can locally setup the project with the following instructions:

Download the project.   
Install Python (or alternatives).  
In the downloaded projects root directory, bash: python3 -m http.server.  
Open a browser and go to http://localhost:8000.  


**PROJECT DETAILS:**  

The EvoChess project is a website to play PVP and PVE games of EvoChess, a unique spin on chess.  
In EvoChess, standard chess pieces (Pawn, King, etc.) can be evolved, granting them additional abilities.  

The project has a PVE storyline where players can play against a basic hand-coded bot in custom levels.  

These custom levels have the standard board setup for white (player) and a unique setup for black (bot), fitting the theme of the level.  
The progression of the story focuses on each individual piece evolution, following the order of: Pawn -> Knight -> Bishop -> Rook -> Queen -> King. 
Each piece evolution gets a PVE level associated/catered towards it, after which said evolution is 'unlocked' for futher levels.  
The finale is a standard board setup where the player chooses 2 evolutions while the bot receives every evolution.  
The project has PVP setups where players alternate turns moving for black/white.  

Some of the PVE levels were adapted to be balanced for PVP.  
The primary PVP game mode (EvoChess) has the standard board setup, with players being able to additionally choose 2 evolved pieces.  
Slight 'rule' changes from standard chess include the following:  

Game is won/lost when one side has no leftover Kings, a draw is declared if both sides have no leftover Kings on the same turn.  
Pawns can promote to Kings (For funsies).  
You are able to move into check/move pinned pieces (most standard 'illegal moves' are legal).  
You cannot castle in check (King attacked), through check (King moves past attacked square), however you can castle into check (King ends up on attacked square).  
Evolved pieces exist.  
For more details feel free to visit the webpage or see the project files.  