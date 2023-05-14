import { ChessPiecesName, MoveAction, PlayerColor, TypeOfChessPiece } from "@enums";
import { IChessPiece, IGeneratedMoves, IMove, IMoveHistory, IMoveType, ISquareCoordinate } from "@shared/types";
import { vanillaBishopLikeMoves, knightLikeMoves, generateIlVaticano, rookLikeMoves, pawnLikeMoves, kingLikeMoves, returnCastlingCoord } from "./moveGeneratingFunctions";
import { checkIfGivenKingIsInCheck, checkIfGivenPositionIsInCheck } from "./checkForCheck";
import { makeDeepCopyOfPiece } from "../../shared/utilityFunctions";

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

export const returnTypeAndColorOfPiece = (piece: ChessPiecesName) => {
    return {
        name: piece.substring(5, piece.length),
        color: returnColorOfPiece(piece),
    };
};
class ChessLogic {
    // new features to add
    // forced en-passant
    // il-vaticano : bishop pairs should be two spaces apart with only pawns between them
    // knight-boost
    // omnipotent f6 pawn
    // king cant move to c2 (done)

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

    //memoizedMoves
    memoizedMovesForEachPiece: any = {}

    constructor(initialBoard: Array<Array<ChessPiecesName | null>>) {
        this.currentBoard = [];
        for (let row = 0; row < 8; row++) {
            this.currentBoard.push([]);
            for (let column = 0; column < 8; column++) {
                this.currentBoard[row].push(null);
            }
        }

        //populating memoizedMovesForEachPiece
        Object.values(TypeOfChessPiece).forEach((chessPiece) => {
            this.memoizedMovesForEachPiece[chessPiece] = []
        })

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
    }

    _isKingInCheck = (king : ChessPiecesName.blackKing | ChessPiecesName.whiteKing) => {
        let coordsForKing: ISquareCoordinate
        if (king === ChessPiecesName.blackKing){
            coordsForKing = this.blackKingPosition
        }
        else{
            coordsForKing = this.whiteKingPosition
        }

        const result = checkIfGivenKingIsInCheck(coordsForKing,this.currentBoard)
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

    _generateMovesFor = (
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

    _updateForcedMovesFor = (playerColor: PlayerColor) => {   
        // in the order of precedance
        // - en passant
        this.forcedMoves = []
        let enPassantMoves = this._isEnPassantPresentForPlayerAndWhere(playerColor)
        if (enPassantMoves){
            enPassantMoves = enPassantMoves as IMove[]
            const moveActions : IMoveType[] = enPassantMoves.map(enPassantMove => {
                return {...enPassantMove, action: MoveAction.enPassant}
            })
            this.forcedMoves = [...this.forcedMoves, ...moveActions]
            return
        }
    }   

    _createLastBoardStateCopy = () => {
        let currentStateCopyArray : Array<Array<IChessPiece | null>> = []
        for (let row = 0; row < this.currentBoard.length; row++){
            currentStateCopyArray.push([])
            for (let column= 0; column < this.currentBoard[row].length; column++){
                const chessPieceCopy = {...this.currentBoard[row][column]} as IChessPiece
                currentStateCopyArray[row].push(chessPieceCopy)
            }
        }
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

    
    moveWithAction = (coordFrom: ISquareCoordinate, {coord, action} : IGeneratedMoves) : boolean => {
        let leftCoord: ISquareCoordinate
        let rightCoord: ISquareCoordinate
        this.coordsAffectedWithPrevValue = []
        let coordTo = coord

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

                const pieceOnFrom = _getPieceOnCoord(coordFrom, this.currentBoard)
                const pieceOnTo = _getPieceOnCoord(coordTo, this.currentBoard)

                this.coordsAffectedWithPrevValue = [
                    {coord: inBetweenCoord1 , value: _getPieceOnCoord(inBetweenCoord1, this.currentBoard)},
                    {coord: inBetweenCoord2 , value: _getPieceOnCoord(inBetweenCoord2, this.currentBoard)},
                    {coord: coordFrom, value: {name: pieceOnFrom!.name, lastPosition: pieceOnFrom!.lastPosition ? {...pieceOnFrom!.lastPosition} : null} as IChessPiece},
                    {coord: coordTo, value: {name: pieceOnTo!.name, lastPosition: pieceOnTo!.lastPosition ? {...pieceOnTo!.lastPosition} : null} as IChessPiece}
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
                this.currentBoard[passantedPieceCoord.row][passantedPieceCoord.column] = null

                this.coordsAffectedWithPrevValue = [
                    {coord: passantedPieceCoord , value: _getPieceOnCoord(passantedPieceCoord, this.currentBoard)},
                    {coord: coordFrom , value: _getPieceOnCoord(coordFrom, this.currentBoard)}
                ]

                this._moveCoordOnly(coordFrom, coordTo)
                break;

            case MoveAction.knightBoost:
                const pieceColor = returnColorOfPiece(_getPieceOnCoord(coordFrom, this.currentBoard)!.name)

                this.coordsAffectedWithPrevValue = [
                    {coord: coordFrom , value: _getPieceOnCoord(coordFrom, this.currentBoard)},
                    {coord: coordTo , value: _getPieceOnCoord(coordTo, this.currentBoard)}
                ]

                this._moveCoordOnly(coordFrom, coordTo)
                this.currentBoard[coordTo.row][coordTo.column] = {name: getChessPieceNameFor(TypeOfChessPiece.Knight, pieceColor), lastPosition: null}
                break;

            default:
                this.coordsAffectedWithPrevValue = [
                    {coord: coordFrom , value: _getPieceOnCoord(coordFrom, this.currentBoard)},
                    {coord: coordTo , value: _getPieceOnCoord(coordTo, this.currentBoard)}
                ]
                this._moveCoordOnly(coordFrom, coordTo)

                break;
        }

        // if playing the move caused king to be in check then return false and undo board state
        if (this._isKingInCheck(getChessPieceNameFor(TypeOfChessPiece.King, this.turnToPlay) as ChessPiecesName.blackKing | ChessPiecesName.whiteKing).inCheck){
            this._undoLastMove()
            return false
        }
        else{
            return true
        }
    }
}

export default ChessLogic;