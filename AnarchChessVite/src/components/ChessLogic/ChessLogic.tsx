import { ChessPieces, PlayerColor } from "../../enums";

class ChessLogic {
    currentBoard: Array<Array<any>>;
    turnToPlay: PlayerColor = PlayerColor.white; //default player to play
    whiteInCheck: boolean = false; //default check value of whiteKing on starting board
    blackInCheck: boolean = false; //default check value of blackKing on starting board
    blackKingPosition: [number, number] = [0, 4]; //the default position of black king on starting board
    whiteKingPosition: [number, number] = [7, 4]; //the default position of white king on starting board
    constructor(initialBoard: Array<Array<any>>) {
        this.currentBoard = initialBoard;
        //recalculating the whiteKing position or blackKing posiiton based on provided board
        for (let row = 0; row < 8; row++) {
            for (let column = 0; column < 8; column++) {
                if (this.currentBoard[row][column] === ChessPieces.whiteKing) {
                    this.whiteKingPosition = [row, column];
                } else if (
                    this.currentBoard[row][column] === ChessPieces.blackKing
                ) {
                    this.blackKingPosition = [row, column];
                }
            }
        }
    }

    generateMovesFor = () => {};
}

export default ChessLogic;
