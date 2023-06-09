import { describe, it, expect } from "vitest";
import {ChessPiecesName, MoveAction, PlayerColor} from "@enums";
import ChessLogic from "../ChessLogic";
import exp from "constants";
import { ISquareCoordinate } from "../../../shared/types";
import { CoordMapper } from "../../../shared/utility";

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

    let boardConfigKnook2 = [
        [ChessPiecesName.blackKing, null, null, null, null, null, null, ChessPiecesName.whiteQueen],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null,null, null, null, null,null, null, null],
        [null, null, null, null, null, null, null, ChessPiecesName.whiteKnook],
        [null, null, null,null , null, null, null,  ChessPiecesName.whiteKing],
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
    const chessifyKingCheckKnook2 = new ChessLogic(boardConfigKnook2)

    const chessifyKingCheckPawn1 = new ChessLogic(boardConfigPawn1)
    const chessifyKingCheckPawn2 = new ChessLogic(boardConfigPawn2)

    const chessifyKingCheckKing  = new ChessLogic(boardConfigKing)
    it ("correctly detects if king is in check from a queen" , () => {
       const result1 = chessifyKingCheckQueen1._isKingInCheck(PlayerColor.white)
       expect(result1).toEqual({
        inCheck: true,
        threatAt: {row: 2, column: 3}
       })

       const result2 = chessifyKingCheckQueen2._isKingInCheck(PlayerColor.white)
       expect(result2).toEqual({
        inCheck: true,
        threatAt: {row: 5, column: 1}
       })

       const result3 = chessifyKingCheckQueen3._isKingInCheck(PlayerColor.white)
       expect(result3).toEqual({
        inCheck: true,
        threatAt: {row: 7, column: 0}
       })
    })

    it ("correctly detects if king is in check from a bishop", () => {
        const result = chessifyKingCheckBishop._isKingInCheck(PlayerColor.black)
        expect(result).toEqual({
            inCheck: true,
            threatAt: {row: 4, column: 4}
        })

        const notCheckedResult = chessifyKingCheckBishop._isKingInCheck(PlayerColor.white)
        expect(notCheckedResult).toEqual({
            inCheck: false,
            threatAt: null
        })
    })

    it ("correctly detecs if king is in check from a knook", () => {
        let result = chessifyKingCheckKnook._isKingInCheck(PlayerColor.white)
        expect(result).toEqual({
            inCheck: true,
            threatAt: {row: 4, column: 3}
        })

        result = chessifyKingCheckKnook2._isKingInCheck(PlayerColor.white)
        expect(result).toEqual({
            inCheck: false,
            threatAt: null
        })
    })

    it ("correctly detects if king is in check from  a pawn", () => {
        const result1 = chessifyKingCheckPawn1._isKingInCheck(PlayerColor.black)
        const result2 = chessifyKingCheckPawn2._isKingInCheck(PlayerColor.white)

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
        const result1 = chessifyKingCheckKing._isKingInCheck(PlayerColor.white)
        const result2 = chessifyKingCheckKing._isKingInCheck(PlayerColor.black)

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

describe ("correctly checks if the given move will put king in check using memoizedMap" , () => {
    let boardConfigNew = [
        [null,null,null,null,ChessPiecesName.blackBishop,null,null,null],
        [null,null,null,ChessPiecesName.whitePawn,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [ChessPiecesName.blackKing,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,ChessPiecesName.blackPawn,null],
        [null,null,null,null,null,ChessPiecesName.whiteBishop,ChessPiecesName.whiteKing,ChessPiecesName.blackKnight],
    ]


    const chessifyNewA = new ChessLogic(boardConfigNew)

    it ("doesnt make a piece move if that move is not protecting king from check, which otherwise would have been valid" , () => {
        let coordFrom = {row:1, column: 3}
        let coordTo = {row: 0, column: 4}
        let res = chessifyNewA.playerMadeMove(coordFrom, coordTo, MoveAction.pawnPromotionQueen)
        expect(res.valid).toEqual(true)
        coordFrom = {row:6, column: 6}
        coordTo = {row: 7, column: 5}
        res = chessifyNewA.playerMadeMove(coordFrom, coordTo)
        let checkIfChecky = chessifyNewA.checkIfCheckedCoord(coordFrom, coordTo)
        expect(checkIfChecky).toEqual(true)
        expect(res.valid).toEqual(false)
    })

    const chessifyNewB = new ChessLogic(boardConfigNew)

    it ("all moves that would cause king to be in check are recorded in memoized check moves" , () => {
        let coordFrom = {row:1, column: 3}
        let coordTo = {row: 0, column: 3}
        chessifyNewB.playerMadeMove(coordFrom, coordTo, MoveAction.pawnPromotionQueen)
        const movesWhichPutKingInCheckMap = new CoordMapper()
        // chessifyNewB.playerMadeMove({row: 0, column: 4}, {row: 2, column: 2})
        const allPseudoLegalMoves = chessifyNewB._generatePseudoLegalMovesForAllPiecesFor()
        for (const coord of allPseudoLegalMoves.keys()){
            for (const move of allPseudoLegalMoves.get(coord)){
                chessifyNewB.moveWithAction(coord, move)
                if (chessifyNewB._isKingInCheck().inCheck){
                    if (movesWhichPutKingInCheckMap.has(coord)){
                        movesWhichPutKingInCheckMap.get(coord).push(move)
                    }
                    else{
                        movesWhichPutKingInCheckMap.set(coord, [move])
                    }
                }
                chessifyNewB._undoLastMove()
            }
        }

        for (const [coord, moves] of movesWhichPutKingInCheckMap.entries()){
            const coordFrom  = coord
            let res;
            for (const move of moves){
                res = chessifyNewB.checkIfCheckedCoord(coordFrom, move.coord, move.action)
                expect(res).toEqual(true)
            }
        }
        
    })

})