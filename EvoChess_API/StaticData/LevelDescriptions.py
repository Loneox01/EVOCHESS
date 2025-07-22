levelDescriptions = {
    "bishopLevel": """
    This level, bishopLevel, is the 3rd of 7 levels in the PVE storyline. It is themed around the EvoBishop.

    It introduces the EvoBishop with the Active Ability: Ricochet, in the level message.

    Black's initial board setup is two (left/right) Xs, consisting of 8 EvoBishops.  
    The right X only has 7 EvoBishops, with the top left being substitued for the Black King [0, 4].  

    White has the standard setup with EvoPawns and EvoKnights. White has 3 additional EvoPawns on [5,2], [5,4], [5,6].

    The gamebot in this level follows the following priority:  
    - Capture the enemy King if possible
    - If black King in check:
    -- If only 1 attacking piece, capture if possible
    -- If there exists a safe square to move for the King, move
    - Capture a random enemy piece if possible
    - Perform a random move if possible
    - Pass
    """,
    "main": "This is level, main, is a PVP level with no evolutions. It follows all universal EvoChess rules and systems, and it is otherwise identical to standard chess.",
    "finalLevel": """
    This level, finalLevel, is the last (7th) of 7 levels in the PVE storyline. It is not themed.
    The level message is: "EvoChess PVE."

    Both the black and white pieces follow the standard chess setup. However, all of black's pieces are evolved.  
    White, the player, can (and must to begin the game) select 0, 1, or 2 of any Evolution.  

    The gamebot in this level follows the following priority:
    - Capture the enemy King if possible
    - If black King in check:
    -- If only 1 attacking piece, capture if possible
    -- If there exists a safe square to move for the King, move
    -- If only 1 attacking scoped piece (Rook, Bishop, Queen), block if possible
    - Capture a random enemy piece if possible
    - Perform a random move if possible
    - Pass

    The gamebot in this level will NOT move pinned pieces and considers it illegal.
    The gamebot in this level will generally not move the King directly into check, but will if there are no other legal moves.
    """,
    "kingLevel": """
    This level, kingLevel, is the 6th of 7 levels in the PVE storyline. It is themed around the EvoKing.

    The level message introduces the EvoKing's Active Ability: Soverign Absolute.

    Black's setup consists of 24 EvoKings in a Crown shape, symmetrical across the middle vertical axis.  
    White, the player, can (and must to begin the game) select 0, 1, or 2 of any Evolution(s) except the EvoKing.  

    Black only has 1 randomly chosen true King, hinted at in the level message.  
    The game and gamebot only considers the true king as the black King, all other EvoKings share priority with any other piece.

    The gamebot in this level follows the following priority:
    - Capture the enemy King if possible
    - If black King in check:
    -- If only 1 attacking piece, capture if possible
    -- If there exists a safe square to move for the King, move
    - Capture a random enemy piece if possible
    - Perform a random move if possible
    - Pass

    The gamebot in this level will NOT move pinned pieces and considers it illegal.
    The gamebot in this level will generally not move the King directly into check, but will if there are no other legal moves.
    """,
    "knightLevel": """
    This level, knightLevel, is the 2nd of 7 levels in the PVE storyline. It is themed around the EvoKnight.

    It introduces the EvoKnight with the Passive Ability: Magic Armor, in the level message.

    Black's initial board setup is two (left/right) Ns, consisting of 10 EvoKnights.  
    The right N only has 9 EvoKnights, with the top left being substitued for the Black King [0, 4].  

    White has the standard setup with EvoPawns.

    The gamebot in this level follows the following priority:  
    - If black King in check:
    -- If there exists a safe square to move for the King, move
    - Capture a random enemy piece if possible
    - Perform a random move if possible
    - Pass
    """,
    "pawnLevel": """
    This level, pawnLevel, is the 1st of 7 levels in the PVE storyline. It is themed around the EvoPawn.

    It introduces the EvoPawn with the Passive Ability: En Croissant, in the level message.

    Black's initial board setup is a pyramid of 19 EvoPawns.   
    The right side of the pyramid only has 9 EvoPawns, with the top left being substitued for the Black King [0, 4].  

    White has the standard setup with no evolutions.

    The gamebot in this level follows the following priority:  
    - Capture a random enemy piece if possible
    - Perform a random move if possible
    - Pass
    """,
    "PVPbishop": """
    This level, PVPbishop, is the PVP equivalent of the PVE level bishopLevel. It is themed around the EvoBishop.

    Black's initial board setup is two (left/right) Xs, consisting of 8 EvoBishops.  
    The right X only has 7 EvoBishops, with the top left being substitued for the Black King [0, 4].  

    White has the standard setup with EvoPawns and EvoKnights. White has 3 additional EvoPawns on [5,2], [5,4], [5,6].
    """,
    "PVPevoc": """
    This level, PVPevoc, is the standard EvoChess PVP level.

    The initial board setup is identical to that of standard chess.  
    Both white and black (players) can (and must to start the game) select 0, 1 or 2 of any Evolution.  
    The Evolution selectors for White are below the board, and above the board for Black.  
    """,
    "PVPknight": """
    This level, PVPknight, is the PVP equivalent of the PVE level knightLevel. It is themed around the EvoKnight.

    Black's initial board setup has an N consisting of 10 EvoKnights on the left side, and an X consisting of only 5 EvoKnights centered at [2,6].  
    The black King is on [0, 4].

    White has the standard chess setup with EvoPawns.
    """,
    "PVPpawn": """
    This level, PVPpawn, is the PVP equivalent of the PVE level pawnLevel. It is themed around the EvoPawn.

    Black's initial board setup is a pyramid of 19 EvoPawns, with the black King on [0,4].  
    White has the standard chess setup with no Evolutions. 
    """,
    "PVProok": """
    This level, PVProok, is the PVP equivalent of the PVE level rookLevel. It is themed around the EvoRook.

    Black's initial setup is the standard chess setup with every piece other than the black King replaced with an EvoRook.
    White has the standard chess setup with 3 additional pawns on [5,3], [5,4], [5,5].

    White can (and must to start the game) select 0, 1, or 2 Evolutions out of the following pool:
    - EvoPawn.  
    - EvoKnight.  
    - EvoBishop.  

    This selector is below the board.  
    """,
    "queenLevel": """
    This level, queenLevel, is the 5th of 7 levels in the PVE storyline. It is themed around the EvoQueen. 

    It introduces the EvoQueen with the Active Ability: Omniscient Seer in the level message. 

    Black's setup has the following:
    - Black King on [0,4]
    - EvoQueens on [0,3], [1,3], [1,4]
    - 6 Rooks on the remaining top rank squares
    - 3 Bishops on [1, 0], [1, 1], [2, 0], and 3 more mirrored on the right side.
    - 8 pawns to complete the crown shape

    White has the standard chess setup.

    White can (and must to start the game) select 0, 1, or 2 Evolutions out of the following pool:
    - EvoPawn.  
    - EvoKnight.  
    - EvoBishop.  
    - EvoRook.  

    This selector is below the board.  
    """,
    "rookLevel": """
    This level, rookLevel, is the 4th of 7 levels in the PVE storyline. It is themed around the EvoRook.

    It introduces the EvoRook with the Passive Ability: Kamikaze in the level message. 

    Black's initial setup is the standard chess setup with every piece other than the black King replaced with an EvoRook.
    Black has an additional 3 EvoRooks on [2,3], [2,4], [2,5].  
    White has the standard chess setup with 3 additional pawns on [5,3], [5,4], [5,5].

    White can (and must to start the game) select 0, 1, or 2 Evolutions out of the following pool:
    - EvoPawn.  
    - EvoKnight.  
    - EvoBishop.  

    This selector is below the board.  
    """
}