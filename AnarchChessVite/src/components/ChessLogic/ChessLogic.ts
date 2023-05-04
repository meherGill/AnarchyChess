import { ChessPiecesName, PlayerColor, TypeOfChessPiece } from "@enums";
import { IChessPiece, IMoveHistory, ISquareCoordinate } from "@shared/types";
import { vanillaBishopLikeMoves, knightLikeMoves, generateIlVaticano, rookLikeMoves, pawnLikeMoves, kingLikeMoves } from "./moveGeneratingFunctions";
import { checkIfGivenKingIsInCheck } from "./checkForCheck";

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

}

export const returnPieceOnCoord = (coord: ISquareCoordinate, currentBoard:  Array<Array<IChessPiece | null>>): IChessPiece | null => {
    return currentBoard[coord.row][coord.column];
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

    // forcedMoves:
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
    }

    isKingInCheck = (king : ChessPiecesName.blackKing | ChessPiecesName.whiteKing) => {
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

    generateMovesFor = (
        coord: ISquareCoordinate
    ): Array<ISquareCoordinate>  => {
        if (this.currentBoard[coord.row][coord.column]) {
            let returnCoordinatesArray: Array<ISquareCoordinate> = [];
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

                    returnCoordinatesArray = pawnLikeMoves(coord, this.currentBoard, this.lastBlackMovePlayedArr, this.lastWhiteMovePlayedArr)
                    break;

                case ChessPiecesName.blackKing:
                case ChessPiecesName.whiteKing:
                    /*
                        moves to add:
                            one step in every direction if not blocked by friendly pieces //done
                            no king can move two c2 square (row 5, column 2) //done
                            normal castling
                            verticle castling
                            reverse castling //will add this later
                    */
                    returnCoordinatesArray = kingLikeMoves(coord, this.currentBoard)

    
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
                        returnCoordinatesArray = [...ilVaticanoChecker.secondBishopLikeCoords]
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
}

export default ChessLogic;
