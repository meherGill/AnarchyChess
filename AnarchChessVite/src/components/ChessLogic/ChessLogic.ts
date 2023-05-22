import { ChessPiecesName, MoveAction, PlayerColor, TypeOfChessPiece } from "@enums";
import { IChessPiece, IGeneratedMoves, IMove, IMoveHistory, IMoveType, ISquareCoordinate } from "@shared/types";
import { vanillaBishopLikeMoves, knightLikeMoves, generateIlVaticano, rookLikeMoves, pawnLikeMoves, kingLikeMoves, returnCastlingCoord } from "./moveGeneratingFunctions";
import { checkIfGivenKingIsInCheck, checkIfGivenPositionIsInCheck } from "./checkForCheck";
import { makeDeepCopyOfPiece, areCoordsEqual } from "@shared/utilityFunctions";

export const getChessPieceNameFor = (chessPieceType: TypeOfChessPiece, color: PlayerColor) : ChessPiecesName => {
    return `${color}_${chessPieceType}` as ChessPiecesName
}

export const checkIfCoordInBound = (coord: ISquareCoordinate): boolean => {
    let rowValid = false;
    let colValid = false;

    if (coord.row >= 0 && coord.row < 8) {
        rowValid = true;
    }
    if (coord.column >= 0 && coord.column < 8) {
        colValid = true;
    }
    return rowValid && colValid;
};

export const checkIfSquareIsEmpty = (coord: ISquareCoordinate, currentBoard: Array<Array<IChessPiece | null>>): boolean => {
    return !currentBoard[coord.row][coord.column];
};

export const returnColorOfPiece = (chessPiece: ChessPiecesName): PlayerColor => {
    if (chessPiece.substring(0, 5) === PlayerColor.black) {
        return PlayerColor.black;
    } else {
        return PlayerColor.white;
    }
};

export const returnOpponentColor = (chessPiece: ChessPiecesName) : PlayerColor => {
    if (returnColorOfPiece(chessPiece)===PlayerColor.white){
        return PlayerColor.black
    }
    else{
        return PlayerColor.white
    }

};

export const _getPieceOnCoord = (coord: ISquareCoordinate, currentBoard:  Array<Array<IChessPiece | null>>): IChessPiece | null => {
    return currentBoard[coord.row][coord.column];
};

export const _setPieceOnCoord = (coord: ISquareCoordinate, pieceToSet: IChessPiece | null, currentBoard: Array<Array<IChessPiece | null>> ) : boolean => {
    currentBoard[coord.row][coord.column] = pieceToSet
    return true
};

export const returnTypeOfPiece = (piece: ChessPiecesName) : TypeOfChessPiece=> {
    return piece.substring(5, piece.length).toUpperCase() as TypeOfChessPiece;
};
class ChessLogic {
    // new features to add
    // forced en-passant: kinda done
    // il-vaticano : bishop pairs should be two spaces apart with only pawns between them Done
    // knight-boost done
    // omnipotent f6 pawn
    // king cant move to c2 (done)

    //ToDo:
    // checkmate
    // pawn promotion
    currentBoard: Array<Array<IChessPiece | null>>;
    turnToPlay: PlayerColor = PlayerColor.white; //default player to play
    whiteInCheck: boolean = false; //default check value of whiteKing on starting board
    blackInCheck: boolean = false; //default check value of blackKing on starting board
    blackKingPosition: ISquareCoordinate = {row: 0, column: 4}; //the default position of black king on starting board
    whiteKingPosition:ISquareCoordinate= {row: 7, column: 4}; //the default position of white king on starting board
    
    lastWhiteMovePlayedArr: Array<IMoveHistory> = [];
    lastBlackMovePlayedArr: Array<IMoveHistory> = [];

    whiteHasCastled: boolean = false
    blackHasCastled: boolean = false

    // forcedMoves:
    forcedMoves: Array<IMoveType> = []

    //this object will store the last move update, and it uses the stored values to undo the move
    lastboardState: Array<Array<IChessPiece | null>> = []

    coordsAffectedWithPrevValue: Array<{coord: ISquareCoordinate, value: IChessPiece | null}> = []

    //varaible to see if king is in check
    isKingInCheck: boolean = false

    
    currentCoordsOnBoardForCurrentPlayersColor: Array<ISquareCoordinate> = []
    uniquePiecesPresentOnBoardForOppositePlayer: Set<TypeOfChessPiece> = new Set()
    //pre-generated moves
    memoizedLegalMovesMap: Map<ISquareCoordinate, Array<IGeneratedMoves>> = new Map()

    constructor(initialBoard: Array<Array<ChessPiecesName | null>>) {
        this.currentBoard = [];
        for (let row = 0; row < 8; row++) {
            this.currentBoard.push([]);
            for (let column = 0; column < 8; column++) {
                this.currentBoard[row].push(null);
            }
        }

        //recalculating the whiteKing position or blackKing posiiton based on provided board
        for (let row = 0; row < 8; row++) {
            for (let column = 0; column < 8; column++) {
                const currPiece = initialBoard[row][column];
                if (currPiece) {
                    this.currentBoard[row][column] = {
                        name: currPiece,
                        lastPosition: null,
                    };
                } else {
                    continue;
                }

                if (
                    this.currentBoard[row][column]?.name ===
                    ChessPiecesName.whiteKing
                ) {
                    this.whiteKingPosition = {row: row, column: column};
                } else if (
                    this.currentBoard[row][column]?.name ===
                    ChessPiecesName.blackKing
                ) {
                    this.blackKingPosition = {row: row, column: column};
                }
            }
        }

        this.updateAllCoordsOfPieceOnBoardForColor(this.turnToPlay)
    }

    switchTurns = () => {
        if (this.turnToPlay === PlayerColor.white) 
            this.turnToPlay = PlayerColor.black
        else
            this.turnToPlay = PlayerColor.white
    }

    _isKingInCheck = (playerColor: PlayerColor, uniquePiecesOnBoardForPlayer?: Set<TypeOfChessPiece>) => {
        const king = getChessPieceNameFor(TypeOfChessPiece.King, playerColor) as ChessPiecesName.blackKing | ChessPiecesName.whiteKing
        let coordsForKing: ISquareCoordinate
        if (king === ChessPiecesName.blackKing){
            coordsForKing = this.blackKingPosition
        }
        else{
            coordsForKing = this.whiteKingPosition
        }

        const result = checkIfGivenKingIsInCheck(coordsForKing,this.currentBoard, uniquePiecesOnBoardForPlayer)
        return result
    }

    _isEnPassantPresentForPlayerAndWhere = (playerColor: PlayerColor) : boolean | Array<IMove> => {
        let lastPlayCoordToCheckFor: IMoveHistory | undefined
        let coloredPawn: ChessPiecesName;
        let expectedRowFrom: number;
        let expectedRowTo: number;
        let potentialEnPassantableCoordinate_row: number;

        let pawnsThatCanEnPassantArr : Array<ISquareCoordinate> = []
        if (playerColor === PlayerColor.white){
            lastPlayCoordToCheckFor = this.lastBlackMovePlayedArr.at(-1)
            coloredPawn = ChessPiecesName.blackPawn
            expectedRowFrom = 1
            expectedRowTo = 3
            potentialEnPassantableCoordinate_row = 2
        }
        else{
            lastPlayCoordToCheckFor = this.lastWhiteMovePlayedArr.at(-1)
            coloredPawn = ChessPiecesName.whitePawn
            expectedRowFrom = 6
            expectedRowTo = 4
            potentialEnPassantableCoordinate_row = 5
        }

        if (!lastPlayCoordToCheckFor){
            return false
        }

        //checks if opponent pawn moved two pieces from its starting square
        if (!(lastPlayCoordToCheckFor?.piece === coloredPawn &&
            lastPlayCoordToCheckFor?.from.row === expectedRowFrom &&
            lastPlayCoordToCheckFor?.to.row === expectedRowTo)){
               
            return false
        }

        //get two horizontally adjacent squares next to the pawn that moved two spaces
        const leftCoord : ISquareCoordinate = {...lastPlayCoordToCheckFor.to, column: lastPlayCoordToCheckFor.to.column - 1}
        const rightCoord : ISquareCoordinate = {...lastPlayCoordToCheckFor.to, column: lastPlayCoordToCheckFor.to.column + 1}

        let pieceOnLeftCoord: IChessPiece| null = null;
        let pieceOnRightCoord: IChessPiece| null = null;
        if (checkIfCoordInBound(leftCoord)){
            pieceOnLeftCoord = _getPieceOnCoord(leftCoord, this.currentBoard)
        }
        if (checkIfCoordInBound(rightCoord)){
            pieceOnRightCoord = _getPieceOnCoord(rightCoord, this.currentBoard)
        }
        if (pieceOnLeftCoord?.name === getChessPieceNameFor(TypeOfChessPiece.Pawn, playerColor)){
            pawnsThatCanEnPassantArr.push(leftCoord)
        }
        if (pieceOnRightCoord?.name === getChessPieceNameFor(TypeOfChessPiece.Pawn, playerColor)){
            pawnsThatCanEnPassantArr.push(rightCoord)
        }
        
        if (pawnsThatCanEnPassantArr.length > 0){
            return pawnsThatCanEnPassantArr.map((pawnCoord: ISquareCoordinate) => {
                return {
                    from: pawnCoord,
                    to: {
                        row: potentialEnPassantableCoordinate_row, 
                        column: lastPlayCoordToCheckFor!.to.column
                        }
                }
            })
        }
        return false
    }

    _generatePseduoLegalMovesFor = (
        coord: ISquareCoordinate
    ): Array<IGeneratedMoves>  => {
        if (this.currentBoard[coord.row][coord.column]) {
            let returnCoordinatesArray: Array<IGeneratedMoves> = [];
            const piece = this.currentBoard[coord.row][coord.column]?.name;
            switch (piece) {
                //for pawns
                case ChessPiecesName.blackPawn:
                case ChessPiecesName.whitePawn:
                    /*pawn needs to have the following
                        if unblocked, can move one square (done)
                        if unblocked and on starting rank/row, can move two squares (done)
                        if enemy piece on direct diagnol, can take enemy piece (done)
                        if en-passant available, en passant forced (done)
                        pawn promotion: get knight boost if promoted to knight
                    */
                    returnCoordinatesArray = pawnLikeMoves({ coord, currentBoard: this.currentBoard, lastBlackMovePlayedArr: this.lastBlackMovePlayedArr, lastWhiteMovePlayedArr: this.lastWhiteMovePlayedArr })
                    break;

                case ChessPiecesName.blackKing:
                case ChessPiecesName.whiteKing:
                    /*
                        moves to add:
                            one step in every direction if not blocked by friendly pieces //done
                            no king can move two c2 square (row 5, column 2) //done
                            normal castling //move generated, TO DO: generate moves for rook
                            verticle castling
                            reverse castling //will add this later
                    */
                    const colorOfPPiece = returnColorOfPiece(piece)
                    const allKingsMoves = kingLikeMoves(coord, this.currentBoard)

                    //filters out all squares that are in check
                    /* temporarilty assign the king's coordinate a null position
                        because, when we are checking a king's move for potential checks, we dont want the king
                        to block those potential check.
                        As an example; if a row looks like [whiteQueen, blacKing, null,...]
                        the null square in that row is being blocked by the whiteQueen, therefore, 
                        the whiteQueen's threat is not there and the square will be counted as as safe square for the king, 
                        in the absence of any other threats even though it is not
                    */  
                    const kingChessPiece = _getPieceOnCoord(coord, this.currentBoard)
                    _setPieceOnCoord(coord, null, this.currentBoard)
                    const allLegalKingMoves = allKingsMoves.filter(generatedMove => {
                        const coord = generatedMove.coord
                        
                        return !checkIfGivenPositionIsInCheck(coord, colorOfPPiece, this.currentBoard).inCheck
                    })
                    
                    //replacing the empty square used for the previous square back to a king piece
                    _setPieceOnCoord(coord, kingChessPiece, this.currentBoard)
                    returnCoordinatesArray = allLegalKingMoves
                    //if its white king and it hasnt castled or if its black king that hasnt castled, add castling coords
                    if ((colorOfPPiece === PlayerColor.white && !this.whiteHasCastled) 
                         || (colorOfPPiece === PlayerColor.black && !this.blackHasCastled)){
                            returnCoordinatesArray = [...returnCoordinatesArray, ...returnCastlingCoord(coord, this.currentBoard)]
                    }
                    break;

                case ChessPiecesName.blackKnight:
                case ChessPiecesName.whiteKnight:
                    /*
                        moves to add:
                            normal knight moves (done)
                    */
                    returnCoordinatesArray = [...knightLikeMoves(coord, this.currentBoard)]
                    
                    break;

                case ChessPiecesName.blackBishop:
                case ChessPiecesName.whiteBishop:
                    /*
                        moves to add:
                            normal bishop moves (done)
                            il vaticano (done)
                    */
                    returnCoordinatesArray = [...vanillaBishopLikeMoves(coord, this.currentBoard)]
                    const ilVaticanoChecker = generateIlVaticano(coord, this.currentBoard);
                    if (ilVaticanoChecker.ilVaticanoPossible){
                        returnCoordinatesArray = [...returnCoordinatesArray, ...ilVaticanoChecker.secondBishopLikeCoords]
                    }
                    break;

                case ChessPiecesName.blackQueen:
                case ChessPiecesName.whiteQueen:
                    /*
                        moves to add:
                            normal queen moves (done)
                    */
                    returnCoordinatesArray =[...returnCoordinatesArray, ...vanillaBishopLikeMoves(coord, this.currentBoard)]
                    returnCoordinatesArray =[...returnCoordinatesArray, ...rookLikeMoves(coord, this.currentBoard)]
                    break;

                case ChessPiecesName.blackRook:
                case ChessPiecesName.whiteRook:
                    /*
                        moves to add:
                            normal rook moves (done)
                            castling
                            reverse castling
                    */
                    returnCoordinatesArray =[...returnCoordinatesArray, ...rookLikeMoves(coord, this.currentBoard)]
                    break;

                case ChessPiecesName.blackKnook:
                case ChessPiecesName.whiteKnook:
                    /*
                        moves to add:
                            knook moves: a mixture of knight and rook (done)
                    */
                    returnCoordinatesArray = [...returnCoordinatesArray, ...rookLikeMoves(coord, this.currentBoard)]
                    returnCoordinatesArray = [...returnCoordinatesArray, ...knightLikeMoves(coord, this.currentBoard)]
                    break;

                default:
                    returnCoordinatesArray = [];
            }

            return returnCoordinatesArray;
        } else {
            return [];
        }
    };

    _updateForcedMovesAsideFromCheckFor = (playerColor: PlayerColor) : boolean => {   
        // in the order of precedance
        // - en passant
        // the reason `check` is not included is because in post move computation, we filter out all moves that will cause a check
        this.forcedMoves = []
        let enPassantMoves = this._isEnPassantPresentForPlayerAndWhere(playerColor)
        if (enPassantMoves){
            enPassantMoves = enPassantMoves as IMove[]
            const moveActions : IMoveType[] = enPassantMoves.map(enPassantMove => {
                return {...enPassantMove, action: MoveAction.enPassant}
            })
            this.forcedMoves = [...this.forcedMoves, ...moveActions]
        }
        
        //check if any of the forced moves is in the legal moves generated otherwise
        return false
    }   

    _moveCoordOnly = (coordFrom: ISquareCoordinate, coordTo: ISquareCoordinate) => {
        this.currentBoard[coordTo.row][coordTo.column] = this.currentBoard[coordFrom.row][coordFrom.column]
        this.currentBoard[coordFrom.row][coordFrom.column] = null
        this.currentBoard[coordTo.row][coordTo.column]!.lastPosition = {row: coordFrom.row, column: coordFrom.column}
    }

    _undoLastMove = () => {
        for (let {coord, value} of this.coordsAffectedWithPrevValue){
            this.currentBoard[coord.row][coord.column] = value
        }
    }
    
    moveWithAction = (coordFrom: ISquareCoordinate, {coord: coordTo, action} : IGeneratedMoves) : boolean => {
        let leftCoord: ISquareCoordinate
        let rightCoord: ISquareCoordinate
        this.coordsAffectedWithPrevValue = []
        
        let exitEarly = false

        if (this.forcedMoves.length > 0){
            exitEarly = true
            for (let forcedMove of this.forcedMoves){
                if (
                    areCoordsEqual(coordFrom, forcedMove.from)
                    &&
                    areCoordsEqual(coordTo, forcedMove.to)
                ){
                    exitEarly = false
                }
            }
        }
        if (exitEarly){
            return false
        }

        switch(action){
            case MoveAction.ilVaticano:
 
                if (coordFrom.column < coordTo.column){
                    leftCoord = coordFrom
                    rightCoord = coordTo
                }
                else{
                    leftCoord = coordTo
                    rightCoord = coordFrom
                }

                const inBetweenCoord1 = {
                    row: leftCoord.row,
                    column: leftCoord.column+1
                }

                const inBetweenCoord2 = {
                    row: leftCoord.row,
                    column: leftCoord.column+2
                }

                const pieceOnFrom = makeDeepCopyOfPiece(_getPieceOnCoord(coordFrom, this.currentBoard))
                const pieceOnTo = makeDeepCopyOfPiece(_getPieceOnCoord(coordTo, this.currentBoard))

                this.coordsAffectedWithPrevValue = [
                    {coord: inBetweenCoord1 , value: _getPieceOnCoord(inBetweenCoord1, this.currentBoard)},
                    {coord: inBetweenCoord2 , value: _getPieceOnCoord(inBetweenCoord2, this.currentBoard)},
                    {coord: coordFrom, value: pieceOnFrom},
                    {coord: coordTo, value: pieceOnTo}
                ]

                this.currentBoard[inBetweenCoord1.row][inBetweenCoord1.column] = null
                this.currentBoard[inBetweenCoord2.row][inBetweenCoord2.column] = null

                this.currentBoard[coordFrom.row][coordFrom.column]!.lastPosition = coordTo
                this.currentBoard[coordTo.row][coordTo.column]!.lastPosition = coordFrom
                break;

            case MoveAction.horizontalCastling:
                let rooksNewCoord: ISquareCoordinate
                let rooksOldCoord: ISquareCoordinate
                if (coordFrom.column < coordTo.column){
                    rooksOldCoord = {...coordTo, column: 7}
                    rooksNewCoord = {...coordTo, column: coordTo.column-1}
                }
                else{
                    rooksOldCoord = {...coordTo, column: 0}
                    rooksNewCoord = {...coordTo, column: coordTo.column+1}
                }

                const oldRookPiece : IChessPiece = makeDeepCopyOfPiece(_getPieceOnCoord(rooksOldCoord, this.currentBoard)) as IChessPiece
                const oldKingPiece : IChessPiece = makeDeepCopyOfPiece(_getPieceOnCoord(coordFrom, this.currentBoard)) as IChessPiece
               
                this.coordsAffectedWithPrevValue = [
                    {coord: rooksOldCoord , value: oldRookPiece},   
                    {coord: coordFrom , value: oldKingPiece},
                    {coord: rooksNewCoord, value: null},
                    {coord: coordTo, value: null}
                ]

                this._moveCoordOnly(coordFrom, coordTo)
                this._moveCoordOnly(rooksOldCoord, rooksNewCoord)
                break;

            case MoveAction.enPassant:
                let passantedPieceCoord : ISquareCoordinate = {row: coordFrom.row, column: coordTo.column}
                
                this.coordsAffectedWithPrevValue = [
                    {coord: passantedPieceCoord , value: makeDeepCopyOfPiece(_getPieceOnCoord(passantedPieceCoord, this.currentBoard))},
                    {coord: coordFrom , value: makeDeepCopyOfPiece(_getPieceOnCoord(coordFrom, this.currentBoard))},
                    {coord: coordTo, value: makeDeepCopyOfPiece(_getPieceOnCoord(coordTo, this.currentBoard))}
                ]
                
                this._moveCoordOnly(coordFrom, coordTo)
                this.currentBoard[passantedPieceCoord.row][passantedPieceCoord.column] = null
                break;

            case MoveAction.knightBoost:
                const pieceColor = returnColorOfPiece(_getPieceOnCoord(coordFrom, this.currentBoard)!.name)

                this.coordsAffectedWithPrevValue = [
                    {coord: coordFrom , value: makeDeepCopyOfPiece(_getPieceOnCoord(coordFrom, this.currentBoard))},
                    {coord: coordTo , value: makeDeepCopyOfPiece(_getPieceOnCoord(coordTo, this.currentBoard))}
                ]

                this._moveCoordOnly(coordFrom, coordTo)
                this.currentBoard[coordTo.row][coordTo.column] = {name: getChessPieceNameFor(TypeOfChessPiece.Knight, pieceColor), lastPosition: null}
                break;

            default:
                this.coordsAffectedWithPrevValue = [
                    {coord: coordFrom , value: makeDeepCopyOfPiece(_getPieceOnCoord(coordFrom, this.currentBoard))},
                    {coord: coordTo , value: makeDeepCopyOfPiece(_getPieceOnCoord(coordTo, this.currentBoard))}
                ]
                this._moveCoordOnly(coordFrom, coordTo)

                break;
        }

        // if playing the move caused king to be in check then return false and undo board state
        if (this._isKingInCheck(this.turnToPlay).inCheck){
            this._undoLastMove()
            return false
        }
        else{
            const  moveHistoryElement = {
                piece: _getPieceOnCoord(coordTo, this.currentBoard)!.name as ChessPiecesName,
                from: coordFrom,
                to: coordTo
            }
            if (this.turnToPlay === PlayerColor.white){
                this.lastWhiteMovePlayedArr.push(moveHistoryElement)
            }
            else{
                this.lastBlackMovePlayedArr.push(moveHistoryElement)
            }
            return true

        }
    }

    updateAllCoordsOfPieceOnBoardForColor = (playerColor: PlayerColor) : [Array<ISquareCoordinate>, Set<TypeOfChessPiece>] => {
        const updateArr: Array<ISquareCoordinate> = []
        const newSetOfUnqiuePiecesPresentOnBoardForPlayer : Set<TypeOfChessPiece> = new Set()
        for (let row = 0; row < this.currentBoard.length; row++){
            for (let column = 0; column < this.currentBoard[row].length; column++) {
                const piece = this.currentBoard[row][column]
                if (piece){
                    const colorOfPiece = returnColorOfPiece(piece.name)
                    if (colorOfPiece !== playerColor){
                        const coord = {row: row, column: column}
                        updateArr.push(coord)
                        newSetOfUnqiuePiecesPresentOnBoardForPlayer.add(returnTypeOfPiece(_getPieceOnCoord(coord, this.currentBoard)!.name))
                    }
                }
            }
        }
     return [updateArr, newSetOfUnqiuePiecesPresentOnBoardForPlayer]
    }

    _generatePseudoLegalMovesForAllPiecesFor = (playerColor: PlayerColor) : Map<ISquareCoordinate, Array<IGeneratedMoves>>  => {
        let [allCoordsOnBoardForPlayerColor, allUniquePiecesOnBoardForOppositePlayer] 
            =  this.updateAllCoordsOfPieceOnBoardForColor(playerColor)
        this.uniquePiecesPresentOnBoardForOppositePlayer = allUniquePiecesOnBoardForOppositePlayer
        const moveArr: Map<ISquareCoordinate, Array<IGeneratedMoves>> = new Map()
        for (const coord of allCoordsOnBoardForPlayerColor){
            const result = this._generatePseduoLegalMovesFor(coord)
            moveArr.set(coord, result)
        }
        return moveArr
    }

    postMoveComputation = () => {
        /*
        - First generate all pseudlo legal moves for all pieces for one player and the types of pieces on board for the opposite player
        - Then while you iterate through pseudo legal moves, then you use types of piece of opposite player on current board to efficiently check if king is in check
        - you filter out all the moves where the king is not in check and you get a list of all legal moves
        - using those legal moves you can check if the king is in checkmate, stalemate or neither
        */
    
        // very heavy function
        let allPseudoLegalMovesMap = this._generatePseudoLegalMovesForAllPiecesFor(this.turnToPlay)
        const inCheck = this._isKingInCheck(this.turnToPlay).inCheck
        
        //check if every other move will result in check
        let atleastOneMoveIsSafe = false
        const  allLegalMovesMap = new Map()
        for (const [coordFrom, generatedMovesArr ]  of allPseudoLegalMovesMap.entries()){
            let legalMovesForThisCoord : IGeneratedMoves[] = []
            for (const [index, move] of generatedMovesArr.entries()){
                this.moveWithAction(coordFrom, {coord: move.coord, action: move.action})
                if (this._isKingInCheck(this.turnToPlay, this.uniquePiecesPresentOnBoardForOppositePlayer).inCheck){
                    this._undoLastMove()
                }
                else{
                    legalMovesForThisCoord.push(move)
                    atleastOneMoveIsSafe = true
                }
            }

            allLegalMovesMap.set(coordFrom, legalMovesForThisCoord)
        }

        this.memoizedLegalMovesMap = allLegalMovesMap

        if (!atleastOneMoveIsSafe && inCheck){
            console.log("Checkmate")
        }
        else if (!atleastOneMoveIsSafe && !inCheck){
            console.log("Stalemate")
        }
    }

    playerMadeMove = (coordFrom: ISquareCoordinate, coordTo: ISquareCoordinate) => {

        /*
        Assumption: 
        1. The king is correctly not in checkmate or stalemate, so no need to check for that in the beginning
        2. the forced moves array is already updated 
        3. all pseudo legal moves for that piece MUST have already been generated in the previous function 
                (or if it is the first iteration of this function, 
                then all moves must have been generated when the board was initialised in the constructor)

        LET player1 = whose turn it is to play right now
        player2 = the other player

        - check forced moves array
            - if forced move array is not empty then check if coord1 and coord2 are in it
                - if no, then return false
                - else do that move and then do post move computation (Point 3.)
        2. if forced move is empty then
            - check if coordFrom has a piece on it and that piece belongs to the player whose turn it is currently
            - according to assumption 3, pseudo legal moves for that piece have already been generated, 
              then we check if our given coord pair is in that object of generated moves
                - if no, then we return false
                - if yes, then check if after making the move will the king be in check hence making it an illegal move
                    - if yes, then return false
                    - else, make that move
        3. after the move has been made: (Post Move Computation)
            - generate all possible moves for player 2, memoize them, 
            - check if player is in check:
                - if yes, then check if player2 is in checkmate (for vanilla checkmate)
                - if no, then check if player2 is in stalemate
            - update forced moves object for player2
            - if every move in forcedMove object results in check for player2, then its a checkmate againh
        */

        let validMoveForcedMoves = true
        if (this.forcedMoves.length > 0){
            // in forced moves

            validMoveForcedMoves = false
            for (let move of this.forcedMoves){
                if ((move.from === coordFrom) && (move.to === coordTo)){
                    this.moveWithAction(coordFrom, {coord: coordTo, action: move.action})
                    validMoveForcedMoves = true
                    break
                }
            }
            if (!validMoveForcedMoves){
                return false
            }
        }
        else {
            // no forced moves
             //check if coordFrom belongs to wrong turn to play:
            if (returnColorOfPiece(_getPieceOnCoord(coordFrom, this.currentBoard)!.name) !== this.turnToPlay){
                return false
            }
            let moves = this.memoizedLegalMovesMap.get(coordFrom)
            let validMoveOfCoord = false
            let action = null
            if (moves){
                for (let move of moves){
                    if ((move.coord.column === coordTo.column) && (move.coord.row === coordTo.row)){
                        validMoveOfCoord = true
                        action = move.action
                    }
                }
                if (!validMoveOfCoord){
                    // coordFrom is not a valid move in coordTo
                    return false
                }
            }
            else{
                // there were no moves generated for that piece
                return false
            }

            // make the move
            this.moveWithAction(coordFrom, {coord: coordTo, action: action})
        }
        this.switchTurns()
        this.postMoveComputation()
    }
} 

export default ChessLogic;