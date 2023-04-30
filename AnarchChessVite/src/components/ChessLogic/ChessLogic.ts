import { ChessPiecesName, PlayerColor, TypeOfChessPiece } from "@enums";
import { IChessPiece, ISquareCoordinate } from "@shared/types";

class ChessLogic {
    // new features to add
    // forced en-passant
    // il-vaticano
    // knight-boost
    // omnipotent f2 pawn
    // king cant move to c2

    currentBoard: Array<Array<IChessPiece | null>>;
    turnToPlay: PlayerColor = PlayerColor.white; //default player to play
    whiteInCheck: boolean = false; //default check value of whiteKing on starting board
    blackInCheck: boolean = false; //default check value of blackKing on starting board
    blackKingPosition: [number, number] = [0, 4]; //the default position of black king on starting board
    whiteKingPosition: [number, number] = [7, 4]; //the default position of white king on starting board
    lastWhiteMovePlayedArr?: Array<{
        piece: ChessPiecesName;
        from: ISquareCoordinate;
        to: ISquareCoordinate;
    }>;
    lastBlackMovePlayedArr?: Array<{
        piece: ChessPiecesName;
        from: ISquareCoordinate;
        to: ISquareCoordinate;
    }>;

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
                    this.whiteKingPosition = [row, column];
                } else if (
                    this.currentBoard[row][column]?.name ===
                    ChessPiecesName.blackKing
                ) {
                    this.blackKingPosition = [row, column];
                }
            }
        }
    }

    checkIfCoordInBound = (coord: ISquareCoordinate): boolean => {
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

    checkIfSquareIsEmpty = (coord: ISquareCoordinate): boolean => {
        return !this.currentBoard[coord.row][coord.column];
    };

    returnColorOfPiece = (chessPiece: ChessPiecesName): PlayerColor => {
        if (chessPiece.substring(0, 5) === PlayerColor.black) {
            return PlayerColor.black;
        } else {
            return PlayerColor.white;
        }
    };

    returnOpponentColor = (chessPiece: ChessPiecesName) : PlayerColor => {
        if (this.returnColorOfPiece(chessPiece)===PlayerColor.white){
            return PlayerColor.black
        }
        else{
            return PlayerColor.white
        }

    }

    returnPieceOnCoord = (coord: ISquareCoordinate): IChessPiece | null => {
        return this.currentBoard[coord.row][coord.column];
    };

    returnTypeAndColorOfPiece = (piece: ChessPiecesName) => {
        return {
            name: piece.substring(5, piece.length),
            color: this.returnColorOfPiece(piece),
        };
    };
    generateMovesFor = (
        coord: ISquareCoordinate
    ): Array<ISquareCoordinate> | boolean => {
        if (this.currentBoard[coord.row][coord.column]) {
            let returnCoordinatesArray: Array<ISquareCoordinate> = [];
            const piece = this.currentBoard[coord.row][coord.column]?.name;
            let opponentPieceColor: PlayerColor;
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
                    const newCoordOneStepForward: ISquareCoordinate = {
                        ...coord,
                    };
                    const typeOfPiece = this.returnColorOfPiece(piece);

                    if (typeOfPiece === PlayerColor.black) {
                        newCoordOneStepForward.row = coord.row + 1;
                    } else {
                        newCoordOneStepForward.row = coord.row - 1;
                    }

                    //check if pawn can move one step forward
                    //inside this if is the logic for the pawn moving two steps forward
                    if (
                        this.checkIfCoordInBound(newCoordOneStepForward) &&
                        this.checkIfSquareIsEmpty(newCoordOneStepForward)
                    ) {
                        returnCoordinatesArray.push(newCoordOneStepForward);

                        //check if pawn can move two steps:
                        //writing it inside this if condition because pawn cant move two steps
                        //if the square infront of it is not clear, therefore if the parent if fails, then
                        //no need to check for two steps
                        const newCoordTwoStepForward = { ...coord };
                        if (
                            typeOfPiece === PlayerColor.black &&
                            coord.row === 1
                        ) {
                            newCoordTwoStepForward.row = coord.row + 2;
                        } else if (
                            typeOfPiece === PlayerColor.white &&
                            coord.row === 6
                        ) {
                            newCoordTwoStepForward.row = coord.row - 2;
                        }
                        if (this.checkIfSquareIsEmpty(newCoordTwoStepForward)) {
                            returnCoordinatesArray.push(newCoordTwoStepForward);
                        }
                    }

                    //START OF CODE
                    // check if pawn can take enemy piece diagnally
                    const newCoordDiagLeft = { ...coord };
                    const newCoordDiagRight = { ...coord };

                    opponentPieceColor = this.returnOpponentColor(piece)
                    //populate newCoordDiagLeft and newCoordDiagRight
                    if (typeOfPiece === PlayerColor.black) {
                        newCoordDiagLeft.row = newCoordDiagLeft.row + 1;
                        newCoordDiagLeft.column = newCoordDiagLeft.column - 1;
                        newCoordDiagRight.row = newCoordDiagLeft.column =
                            newCoordDiagLeft.row + 1;
                        newCoordDiagRight.column = newCoordDiagRight.column + 1;
                
                    } else if (typeOfPiece === PlayerColor.white) {
                        newCoordDiagLeft.row = newCoordDiagLeft.row - 1;
                        newCoordDiagLeft.column = newCoordDiagLeft.column - 1;
                        newCoordDiagRight.row = newCoordDiagRight.row - 1;
                        newCoordDiagRight.column = newCoordDiagRight.column + 1;
               
                    } else {
                        throw new Error("this shouldnt happen");
                    }

                    //iterate through the two diagnol columns to see if an opponent piece is present there
                    [newCoordDiagLeft, newCoordDiagRight].forEach(
                        (diagCooord) => {
                            if (this.checkIfCoordInBound(diagCooord)) {
                                const piece =
                                    this.returnPieceOnCoord(diagCooord);
                                if (piece) {
                                    const pieceColor = this.returnColorOfPiece(
                                        piece.name
                                    );
                                    if (pieceColor === opponentPieceColor) {
                                        returnCoordinatesArray.push(diagCooord);
                                    }
                                }
                            }
                        }
                    );

                    // END IF PAWN CAN TAKE PIECE DIAGONALLY 
                    
                    
                    //check if PAWN CAN EN PASSANTE
                    let enPassantableCheck1 = false;
                    if (this.returnColorOfPiece(piece) === PlayerColor.black) {
                        if (coord.row === 4) {
                            enPassantableCheck1 = true;
                        }
                    } else if (
                        this.returnColorOfPiece(piece) === PlayerColor.white
                    ) {
                        if (coord.row === 3) {
                            enPassantableCheck1 = true;
                        }
                    }
                    if (enPassantableCheck1) {
                        const lastWhiteMovePlayed =
                            this.lastWhiteMovePlayedArr?.at(-1);
                        const lastBlackMovePlayed =
                            this.lastBlackMovePlayedArr?.at(-1);
                        if (opponentPieceColor === PlayerColor.black) {
                            if (
                                lastBlackMovePlayed?.from.row === 1 &&
                                lastBlackMovePlayed?.to.row === 3 &&
                                lastBlackMovePlayed.piece ===
                                    ChessPiecesName.blackPawn
                            ) {
                                if (
                                    Math.abs(
                                        coord.column -
                                            lastBlackMovePlayed.to.column
                                    ) === 1
                                ) {
                                    returnCoordinatesArray = [
                                        {
                                            row: lastBlackMovePlayed.to.row - 1,
                                            column: lastBlackMovePlayed.to
                                                .column,
                                        },
                                    ];
                                }
                            }
                        } else if (opponentPieceColor === PlayerColor.white) {
                            if (
                                lastWhiteMovePlayed?.from.row === 6 &&
                                lastWhiteMovePlayed?.to.row === 4 &&
                                lastWhiteMovePlayed.piece ===
                                    ChessPiecesName.whitePawn
                            ) {
                                if (
                                    Math.abs(
                                        coord.column -
                                            lastWhiteMovePlayed.to.column
                                    ) === 1
                                ) {
                                    returnCoordinatesArray = [
                                        {
                                            row: lastWhiteMovePlayed.to.row - 1,
                                            column: lastWhiteMovePlayed.to
                                                .column,
                                        },
                                    ];
                                }
                            }
                        }
                    }

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
                    const tempMovesArr = [1,-1, 0]
                    opponentPieceColor = this.returnOpponentColor(piece)
                    for (let rowOffset of tempMovesArr){
                        for (let columnOffset of tempMovesArr){
                            if (rowOffset === 0 && columnOffset === 0) {
                                continue
                            }
                            else{
                                const newCoords = {...coord}
                                newCoords.column += columnOffset
                                newCoords.row += rowOffset

                                //check for c2 square, c2 is row: 5, column 2
                                if (newCoords.column === 2 && newCoords.row === 5){
                                    continue
                                }
                                if (this.checkIfCoordInBound(newCoords) && 
                                    (
                                        this.checkIfSquareIsEmpty(newCoords) ||
                                        this.returnColorOfPiece(this.returnPieceOnCoord(newCoords)!.name) === opponentPieceColor
                                    )
                                ){
                                    returnCoordinatesArray.push(newCoords)
                                }
                            }
                        }
                    }

                    break;
                case ChessPiecesName.blackKnight:
                case ChessPiecesName.whiteKnight:
                    /*
                        moves to add:
                            normal knight moves
                    */
                    break;
                case ChessPiecesName.blackBishop:
                case ChessPiecesName.whiteBishop:
                    /*
                        moves to add:
                            normal bishop moves,
                            il vaticano,
                    */
                    break;
                case ChessPiecesName.blackQueen:
                case ChessPiecesName.whiteQueen:
                    /*
                        moves to add:
                            normal queen moves
                    */
                    break;
                case ChessPiecesName.blackRook:
                case ChessPiecesName.whiteRook:
                    /*
                        moves to add:
                            normal rook moves
                            castling
                            reverse castling
                    */
                    break;
                case ChessPiecesName.blackKnook:
                case ChessPiecesName.whiteKnook:
                    /*
                        moves to add:
                            knook moves: a misture of knight and rook
                    */
                    break;
                default:
                    returnCoordinatesArray = [];
            }
            return returnCoordinatesArray;
        } else {
            return false;
        }
    };
}

export default ChessLogic;
