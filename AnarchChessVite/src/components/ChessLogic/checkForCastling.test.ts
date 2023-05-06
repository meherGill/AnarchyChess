import { describe, it, expect } from "vitest";
import {ChessPiecesName, MoveAction} from "@enums";
import ChessLogic from "./ChessLogic";
import { getCoordsOnly, customSortFn, customSortFnWithActions } from "@helperFunctionsForTest";


describe("correctly check if king can castle or not", () => {
    let boardConfigAllCastling = [
        [null, null, null, null, null, null, null, null],
        [ChessPiecesName.blackRook, null, null, null, ChessPiecesName.blackKing, null, null, ChessPiecesName.blackRook],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [ChessPiecesName.whiteRook, null, null, null ,ChessPiecesName.whiteKing, null, null, ChessPiecesName.whiteRook],
    ];

    let boardConfigBlackCastlingOnlyShortSide = [
        [ChessPiecesName.blackRook, ChessPiecesName.blackKnight, null, null, ChessPiecesName.blackKing, null, null , ChessPiecesName.blackRook],
        [ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn,ChessPiecesName.blackPawn],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, ChessPiecesName.blackRook, null, null, null],
        [null, null, null, null, null, null, null, null],
        [ChessPiecesName.whiteRook, null, null, null ,ChessPiecesName.whiteKing, null, null, ChessPiecesName.whiteRook],
    ];


    const chessifyAllCastling = new ChessLogic(boardConfigAllCastling)
    const chessifyBlackShortSideCastlingOnly = new ChessLogic(boardConfigBlackCastlingOnlyShortSide)

    it ("check for boardConfigAllCastling" ,() => {
        const resultBlackKingGenMoves = chessifyAllCastling.generateMovesFor({row: 1, column: 4}).sort(customSortFnWithActions)
        const resultWhiteKingGenMoves = chessifyAllCastling.generateMovesFor({row: 7, column: 4}).sort(customSortFnWithActions)

        expect(resultBlackKingGenMoves).toEqual([
            { coord: { row: 2, column: 5 } },
            { coord: { row: 2, column: 3 } },
            { coord: { row: 2, column: 4 } },
            { coord: { row: 1, column: 5 } },
            { coord: { row: 1, column: 3 } },
            { coord: { row: 0, column: 5 } },
            { coord: { row: 0, column: 3 } },
            { coord: { row: 0, column: 4 } },
            { coord: { row: 1, column: 2 }, action: MoveAction.castling },
            { coord: { row: 1, column: 6 }, action: MoveAction.castling }
          ].sort(customSortFnWithActions))

        expect(resultWhiteKingGenMoves).toEqual([
            { coord: { row: 6, column: 5 } },
            { coord: { row: 6, column: 3 } },
            { coord: { row: 6, column: 4 } },
            { coord: { row: 7, column: 5 } },
            { coord: { row: 7, column: 3 } },
            { coord: { row: 7, column: 2 }, action: MoveAction.castling },
            { coord: { row: 7, column: 6 }, action: MoveAction.castling  }
          ].sort(customSortFnWithActions))
    })

    it ("check for boardConfigBlackCastlingOnlyShortSide", () => {
        const resultBlackKingGenMoves = chessifyBlackShortSideCastlingOnly.generateMovesFor({row: 0, column: 4}).sort(customSortFnWithActions)
        expect(resultBlackKingGenMoves).toEqual([
            {coord: {row: 0, column: 3}},
            {coord: {row: 0, column: 5}},
            {coord: {row: 0, column: 6}, action: MoveAction.castling},
        ].sort(customSortFnWithActions))

        const resultWhiteKingGenMoves = chessifyBlackShortSideCastlingOnly.generateMovesFor({row: 7, column: 4}).sort(customSortFnWithActions)
        console.log("whitey white ", resultWhiteKingGenMoves)
        expect(resultWhiteKingGenMoves).toEqual([
            {coord: {row: 6, column: 3}},
            {coord: {row: 6, column: 5}},
            {coord: {row: 7, column: 3}},
            {coord: {row: 7, column: 5}},
        ].sort(customSortFnWithActions))
    })
})