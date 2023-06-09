import { describe, it, expect } from "vitest";
import ChessLogic, { _setPieceOnCoord } from "../ChessLogic";
import { ChessPiecesName, PlayerColor } from "@enums";
import exp from "constants";

describe("it correctly does an en passant check" , () => {
    let boardConfigDoublePassant = [
        [ChessPiecesName.blackKing, null, null, null, null, null, null, null],
        [null, null, null, ChessPiecesName.blackPawn,null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [ChessPiecesName.whitePawn, ChessPiecesName.blackPawn,ChessPiecesName.whitePawn, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, ChessPiecesName.whiteKing],
        [null, null, null, null, null, null, null, null],
    ];

    let boardConfigSinglePassant = [
        [ChessPiecesName.blackKing, null, null, null, null, null, null, null],
        [null, null, null, ChessPiecesName.blackPawn,null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [ChessPiecesName.whitePawn, ChessPiecesName.whitePawn ,ChessPiecesName.whitePawn, null, null, null, null, null],
        [ChessPiecesName.whitePawn, ChessPiecesName.blackPawn, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, ChessPiecesName.whiteKing],
        [null, null, null, null, null, null, null, null],
    ];

    const chessifyDoublePassant = new ChessLogic(boardConfigDoublePassant)
    chessifyDoublePassant.turnToPlay = PlayerColor.white
    chessifyDoublePassant.lastMovePlayedArr = [{piece: ChessPiecesName.blackPawn, from: {row: 1, column: 1}, to: {row: 3, column: 1}}]

    const chessifySinglePassant = new ChessLogic(boardConfigSinglePassant)
    chessifySinglePassant.turnToPlay = PlayerColor.black
    chessifySinglePassant.lastMovePlayedArr = [{piece: ChessPiecesName.whitePawn, from: {row: 6, column: 0}, to: {row: 4, column: 0}}]
    
    it("correctly checks for double enpassant" , () => {
        const result = chessifyDoublePassant._isEnPassantPresentForPlayerAndWhere(chessifyDoublePassant.turnToPlay)
        expect(result).toEqual([
            {
                from: {row: 3, column: 0},
                to: {row: 2, column: 1}
            },
            {
                from: {row: 3, column: 2},
                to: {row: 2, column: 1}
            }
        ])
    })

    it ("correctly checks for single en passant", () => {
        const result = chessifySinglePassant._isEnPassantPresentForPlayerAndWhere(chessifySinglePassant.turnToPlay)
        expect(result).toEqual([{
            to: {row: 5, column: 0},
            from: {row: 4, column: 1}
        }])

        //change it to whites turn and expect false
        chessifySinglePassant.turnToPlay = PlayerColor.white
        const resultFalse = chessifySinglePassant._isEnPassantPresentForPlayerAndWhere(chessifySinglePassant.turnToPlay)
        expect(resultFalse).toBeFalsy()

        //reset test
        chessifySinglePassant.turnToPlay = PlayerColor.black
        let modifiedResult = chessifySinglePassant._isEnPassantPresentForPlayerAndWhere(chessifySinglePassant.turnToPlay)
        expect(modifiedResult).toEqual([{
            to: {row: 5, column: 0},
            from: {row: 4, column: 1}
        }])

        //change capturing piece to a bishop and expecting false
        _setPieceOnCoord({row:4, column: 1}, { name: ChessPiecesName.blackBishop, lastPosition: null}, chessifySinglePassant.currentBoard)
        modifiedResult = chessifySinglePassant._isEnPassantPresentForPlayerAndWhere(chessifySinglePassant.turnToPlay)
        expect(resultFalse).toBeFalsy()

    })

    it ("correctly does en-passant when an incorrect turn is played first", () => {
        let newBoard = [
            [ChessPiecesName.blackKing, null, null, null, null, null, null, null],
            [null, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn,null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null,ChessPiecesName.whitePawn, null, null, null, null, null],
            [ChessPiecesName.whitePawn, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, ChessPiecesName.whiteKing],
            [null, null, null, null, null, null, null, null],
        ];

        const chessifyNewBoard = new ChessLogic(newBoard)
        let res = chessifyNewBoard.playerMadeMove({row: 4, column: 0}, {row: 3, column: 0}).valid
        expect(res).toEqual(true)
        expect(chessifyNewBoard.currentBoard[3]).toEqual([
            { name: ChessPiecesName.whitePawn, lastPosition: { row: 4, column: 0 } },
            null,
            { name: ChessPiecesName.whitePawn, lastPosition: null },
            null,
            null,
            null,
            null,
            null
        ])
        expect(chessifyNewBoard.currentBoard[4]).toEqual([
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ])

        res = chessifyNewBoard.playerMadeMove({row: 1, column: 1},{row: 3, column: 1}).valid
        expect(res).toEqual(true)
        expect(chessifyNewBoard.currentBoard[3]).toEqual([
            { name: ChessPiecesName.whitePawn, lastPosition: { row: 4, column: 0 } },
            { name: ChessPiecesName.blackPawn, lastPosition: {row: 1, column: 1} },
            { name: ChessPiecesName.whitePawn, lastPosition: null },
            null,
            null,
            null,
            null,
            null
        ])

        let badMove = chessifyNewBoard.playerMadeMove({row: 6, column:7} , {row: 0, column: 0}).valid
        expect(badMove).toEqual(false)
        res = chessifyNewBoard.playerMadeMove({row: 3, column:0} , {row: 2, column: 1}).valid
        expect(res).toEqual(true)
        res = chessifyNewBoard.playerMadeMove({row: 1, column: 2}, {row: 2, column: 1}).valid
        expect(res).toEqual(true)
    })
})