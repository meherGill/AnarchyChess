import { describe, it, expect } from "vitest";
import {ChessPiecesName} from "@enums";
import ChessLogic from "./ChessLogic";
import { ISquareCoordinate } from "@shared/types";
import { checkIfGivenKingIsInCheck } from "./checkForCheck";

describe("correctly detects if king is in check", () => {
    let boardConfigKingCheckFromQueen1 = [
        [ChessPiecesName.blackKing, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, ChessPiecesName.blackQueen, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, ChessPiecesName.whiteKing, null, null, null, null],
    ];
    
    let boardConfigKingCheckFromQueen2 = [
        [ChessPiecesName.blackKing, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, ChessPiecesName.blackQueen, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, ChessPiecesName.whiteKing, null, null, null, null],
    ];

    let boardConfigKingCheckFromQueen3 = [
        [ChessPiecesName.blackKing, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [ChessPiecesName.blackQueen, null, null, ChessPiecesName.whiteKing, null, null, null, null],
    ];

    let boardConfigBishop = [
        [ChessPiecesName.blackKing, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, ChessPiecesName.whiteBishop, null, null, null],
        [null,null, null, null, null, ChessPiecesName.whiteKing, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null,null , null, null, null, null],
    ]

    let boardConfigKnook = [
        [ChessPiecesName.blackKing, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, ChessPiecesName.blackKnook, null, null, null, null],
        [null,null, null, null, null, ChessPiecesName.whiteKing, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null,null , null, null, null, null],
    ]

    let boardConfigPawn1 = [
        [ChessPiecesName.blackKing, null, null, null, null, null, null, null],
        [null, ChessPiecesName.whitePawn, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null,null, null, null, null, ChessPiecesName.whiteKing, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null,null , null, null, null, null],
    ]

    let boardConfigPawn2 = [
        [ChessPiecesName.blackKing, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, ChessPiecesName.blackPawn, null],
        [null,null, null, null, null, ChessPiecesName.whiteKing, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null,null , null, null, null, null],
    ]

    let boardConfigKing = [
        [ChessPiecesName.blackKing, null, null, null, null, null, null, null],
        [ChessPiecesName.whiteKing, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null,null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null,null , null, null, null, null],
    ]

    const chessifyKingCheckQueen1 = new ChessLogic(boardConfigKingCheckFromQueen1)
    const chessifyKingCheckQueen2 = new ChessLogic(boardConfigKingCheckFromQueen2)
    const chessifyKingCheckQueen3 = new ChessLogic(boardConfigKingCheckFromQueen3)

    const chessifyKingCheckBishop = new ChessLogic(boardConfigBishop)

    const chessifyKingCheckKnook = new ChessLogic(boardConfigKnook)

    const chessifyKingCheckPawn1 = new ChessLogic(boardConfigPawn1)
    const chessifyKingCheckPawn2 = new ChessLogic(boardConfigPawn2)

    const chessifyKingCheckKing  = new ChessLogic(boardConfigKing)

    it ("correctly detects if king is in check from a queen" , () => {
       const result1 = chessifyKingCheckQueen1.isKingInCheck(ChessPiecesName.whiteKing)
       expect(result1).toEqual({
        inCheck: true,
        threatAt: {row: 2, column: 3}
       })

       const result2 = chessifyKingCheckQueen2.isKingInCheck(ChessPiecesName.whiteKing)
       expect(result2).toEqual({
        inCheck: true,
        threatAt: {row: 5, column: 1}
       })

       const result3 = chessifyKingCheckQueen3.isKingInCheck(ChessPiecesName.whiteKing)
       expect(result3).toEqual({
        inCheck: true,
        threatAt: {row: 7, column: 0}
       })
    })

    it ("correctly detects if king is in check from a bishop", () => {
        const result = chessifyKingCheckBishop.isKingInCheck(ChessPiecesName.blackKing)
        expect(result).toEqual({
            inCheck: true,
            threatAt: {row: 4, column: 4}
        })

        const notCheckedResult = chessifyKingCheckBishop.isKingInCheck(ChessPiecesName.whiteKing)
        expect(notCheckedResult).toEqual({
            inCheck: false,
            threatAt: null
        })
    })

    it ("correctly detecs if king is in check from a knook", () => {
        const result = chessifyKingCheckKnook.isKingInCheck(ChessPiecesName.whiteKing)
        expect(result).toEqual({
            inCheck: true,
            threatAt: {row: 4, column: 3}
        })
    })

    it ("correctly detects if king is in check from  a pawn", () => {
        const result1 = chessifyKingCheckPawn1.isKingInCheck(ChessPiecesName.blackKing)
        const result2 = chessifyKingCheckPawn2.isKingInCheck(ChessPiecesName.whiteKing)

        expect(result1).toEqual({
            inCheck: true,
            threatAt: {row: 1, column: 1}
        })

        expect(result2).toEqual({
            inCheck: true,
            threatAt: {row: 4, column: 6}
        })
    })

    it ("correctly detects if king is in check from another king" , () => {
        const result1 = chessifyKingCheckKing.isKingInCheck(ChessPiecesName.whiteKing)
        const result2 = chessifyKingCheckKing.isKingInCheck(ChessPiecesName.blackKing)

        expect(result1).toEqual({
            inCheck: true,
            threatAt: {row: 0, column: 0}
        })

        expect(result2).toEqual({
            inCheck: true,
            threatAt: {row: 1, column: 0}
        })
    })
    
})