pieceDescriptions = {
    "King": "Can castle into check, but not through or during check. Otherwise a standard King. ",
    "Pawn": "Can promote to Kings. Can En passant capture left/right adjacent EvoPawns that moved 2 squares vertically in the immediate previous turn. Otherwise a standard Pawn.",
    "Rook": "Cannot capture the EvoKnight from 3 or more squares away. Otherwise a standard Rook. ",
    "Knight": "Cannot capture the EvoKnight. Otherwise a standard Knight.",
    "Bishop": "Cannot capture the EvoKnight from 3 or more Manhatten squares away. Otherwise a standard Bishop. ",
    "Queen": "Cannot capture the EvoKnight from 3 or more Manhatten squares away. Otherwise a standard Queen.",
    "EvoKing": """
    Active Ability: Soverign Absolute.  
    - Can capture ally pieces up to 3 times per piece.  
    - When capturing any piece, spawns an Evolved version of the captured piece square it moved from.  
    -- Pawns that are captured from the last rank are automatically promoted.

    Can castle into check, but not through or during check. Otherwise a standard King.
    """,
    "EvoPawn": """
    Active Ability: En Croissant.  
    - Can capture opposing adjacent pieces in the front/left/right directions if square behind them is unoccupied.
    - Doing so moves the EvoPawn 2 squares away to the unoccupied and removes the captured piece in the middle.
    - Capturing via En Croissant vertically (front) subjects the EvoPawn to En Passant in the immediate following turn, detailed below.

    Can promote to Kings. Can En passant capture left/right adjacent EvoPawns that moved 2 squares vertically in the immediate previous turn. Otherwise a standard Pawn.
    """,
    "EvoRook": """
    Passive Ability: Kamikaze.  
    - When captured, remove ALL (ally and enemy) adjacent pieces in the front/back/left/right directions.  
    - The occupied/capture square is unaffected.  

    Cannot capture the EvoKnight from 3 or more squares away. Otherwise a standard Rook.
    """,
    "EvoKnight": """
    Passive Ability: Magic Armor.  
    - Cannot be captured by opposing pieces 3 or more squares away by Manhatten Distance.  
    - EvoQueens that capture via extended scope can bypass this ability if the minion is less than 3 squares away.

    Cannot capture the EvoKnight. Otherwise a standard Knight.
    """,
    "EvoBishop": """
    Active Ability: Ricochet.  
    - Scope is extended to bounce off edges at 90 degrees.  
    - Scope is still blocked on first piece encountered.  
    - Capturing a piece in the extended scope reverts the EvoBishop to a Bishop.

    Cannot capture the EvoKnight from 3 or more Manhatten squares away. Otherwise a standard Bishop.
    """,
    "EvoQueen": """
    Active Ability: Omniscient Seer.  
    - Scope is extended by instances of ally Bishop/Rooks.  
    -- Can move to any square ally Bishops or Rooks can move to.  
    - Capturing a piece in the extended scope reverts the EvoQueen to a Queen. 

    Can capture the EvoKnight from 3 or more squares away if the minion Rook/Bishop's scope is within 3 Manhatten squares of the EvoKnight.  
    Otherwise cannot capture the EvoKnight from 3 or more Manhatten squares away.  
    Otherwise a standard Queen.  
    """
}