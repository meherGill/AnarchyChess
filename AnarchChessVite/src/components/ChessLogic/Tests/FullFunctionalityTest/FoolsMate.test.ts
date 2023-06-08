import { describe, it, expect, vi } from "vitest";
import ChessLogic from "@components/ChessLogic/ChessLogic";
import { ChessPiecesName } from "@shared/enums";
import { cloneDeep } from "lodash";

describe("One full game, using playerMadeMove functions" , () => {

    const chessboard = [
        [ChessPiecesName.blackRook, ChessPiecesName.blackKnight, ChessPiecesName.blackBishop, ChessPiecesName.blackQueen, ChessPiecesName.blackKing, ChessPiecesName.blackBishop, ChessPiecesName.blackKnight, ChessPiecesName.blackRook],
        [ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [ChessPiecesName.whitePawn, ChessPiecesName.whitePawn, ChessPiecesName.whitePawn, ChessPiecesName.whitePawn, ChessPiecesName.whitePawn, ChessPiecesName.whitePawn, ChessPiecesName.whitePawn, ChessPiecesName.whitePawn],
        [ChessPiecesName.whiteRook, ChessPiecesName.whiteKnight, ChessPiecesName.whiteBishop, ChessPiecesName.whiteQueen, ChessPiecesName.whiteKing, ChessPiecesName.whiteBishop, ChessPiecesName.whiteKnight, ChessPiecesName.whiteRook]
    ];
    
    const chessisfy = new ChessLogic(chessboard)
    
    const snapshotBeginning = cloneDeep(chessisfy)

    let result
    it ("rejects moves made by white player on black pieces" , () => {

        result = chessisfy.playerMadeMove(
            {row: 1, column: 0}, {row: 2, column: 0}
        ).valid
        expect(result).toEqual(false)
        const snapshot_ = cloneDeep(chessisfy)
        expect(snapshotBeginning).toEqual(snapshot_)
    })

    it ("rejects incorrect moves made by white player on white piece" , () => {
        result = chessisfy.playerMadeMove(
            {row: 1, column: 0}, {row: 6, column: 0}
        ).valid
        expect(result).toEqual(false)
        const snapshot_ = cloneDeep(chessisfy)
        expect(snapshotBeginning).toEqual(snapshot_)
    })

    it ("plays one compelete game of chess with fools mate", () => {
        let spy = vi.spyOn(chessisfy, 'checkmateHandler')
        result = chessisfy.playerMadeMove(
            {row: 6, column: 6}, {row: 4, column: 6}
        ).valid
        expect(result).toEqual(true)
        const snapshot2 = cloneDeep(chessisfy)
        expect(snapshot2).not.toEqual(snapshotBeginning)
        
        result = chessisfy.playerMadeMove({row: 1, column: 4}, {row: 2, column: 4}).valid
        expect(result).toEqual(true)

        result = chessisfy.playerMadeMove({row: 6, column: 5}, {row: 4, column: 5}).valid
        expect(result).toEqual(true)

        expect(spy).toHaveBeenCalledTimes(0)
        result = chessisfy.playerMadeMove({row: 0, column: 3}, {row: 4, column: 7}).valid
        expect(result).toEqual(true)

        expect(spy).toHaveBeenCalledTimes(1)
    })
})