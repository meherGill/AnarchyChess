import { describe, it, expect } from "vitest";
import {ChessPiecesName, MoveAction, PlayerColor} from "@enums";
import ChessLogic from "../ChessLogic";
import { IGeneratedMoves } from "../../../shared/types";

describe("it moves the pieces and performs the actions correctly" , ()=>{
    let boardConfigSimpleCase = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [ChessPiecesName.blackKing, ChessPiecesName.whitePawn, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, ChessPiecesName.whiteKing],
        [null, null, null, null, null, null, null, null],
    ];

    let boardConfigWith_HCastling_KnightBoost_IlVaticano = [
        [null, null, null, null, null, null, ChessPiecesName.blackKing],
        [null, ChessPiecesName.whitePawn, null, null, null, ChessPiecesName.blackPawn, null, null],
        [null, null, null, null, null, null, null, null],
        [ChessPiecesName.whiteBishop, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.whiteBishop, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [ChessPiecesName.whiteRook, null, null, ChessPiecesName.whiteKing, null, null, null, null],
    ];

    let boardConfigPassant_twoStepsHardCoded = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [ChessPiecesName.blackKing, null, null, null, null, null, null, null],
        [null, null, null, null, ChessPiecesName.whitePawn, ChessPiecesName.blackPawn, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, ChessPiecesName.whiteKing],
        [null, null, null, null, null, null, null, null],
    ]

    const boardConfigPassant_withoutHardcoding = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null,  ChessPiecesName.blackPawn, null, null],
        [ChessPiecesName.blackKing, null, null, null, null, null, null, null],
        [null, null, null, null, ChessPiecesName.whitePawn,null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, ChessPiecesName.whiteKing],
        [null, null, null, null, null, null, null, null],
    ]

    const chessifySimpleCase = new ChessLogic(boardConfigSimpleCase)
    const chessify_HCastling_KnightBoost_IlVaticano = new ChessLogic(boardConfigWith_HCastling_KnightBoost_IlVaticano)
    const chessifyPassant_twoStepsHardCoded = new ChessLogic(boardConfigPassant_twoStepsHardCoded)
    chessifyPassant_twoStepsHardCoded.lastMovePlayedArr = [{
        piece: ChessPiecesName.blackPawn,
        from: {row: 1, column: 5},
        to: {row: 3, column: 5}
    }]
    chessifyPassant_twoStepsHardCoded.currentBoard[3][5]!.lastPosition ={row: 1, column: 5}

    let chessifyPassant_withoutHardcoding = new ChessLogic(boardConfigPassant_withoutHardcoding)
    chessifyPassant_withoutHardcoding.turnToPlay = PlayerColor.black

    it ("correctly moves the pieces for chessifySimpleCase", () => {
        const coordFrom = {row:2, column: 0}
        chessifySimpleCase.turnToPlay = PlayerColor.black
        chessifySimpleCase.moveWithAction(coordFrom, {coord: {row: 3, column: 0}})
        expect(chessifySimpleCase.currentBoard[2]).toEqual([null, {name: ChessPiecesName.whitePawn, lastPosition: null}, null,null, null, null, null, null],)
        expect(chessifySimpleCase.currentBoard[3]).toEqual([{name: ChessPiecesName.blackKing , lastPosition: coordFrom}, null, null,null, null, null, null, null],)
        
        coordFrom.row = 3
        coordFrom.column = 0

        chessifySimpleCase.turnToPlay = PlayerColor.black
        chessifySimpleCase.moveWithAction(coordFrom, {coord: {row: 2, column: 1}})
        expect(chessifySimpleCase.currentBoard[2]).toEqual([null, {name: ChessPiecesName.blackKing, lastPosition: coordFrom}, null,null, null, null, null, null])

        chessifySimpleCase._undoLastMove()
        
        expect(chessifySimpleCase.currentBoard[2]).toEqual([null, {name: ChessPiecesName.whitePawn, lastPosition: null}, null,null, null, null, null, null],)
        expect(chessifySimpleCase.currentBoard[3]).toEqual([{name: ChessPiecesName.blackKing , lastPosition: {row:2 , column: 0}}, null, null,null, null, null, null, null],)
    })

    it ("correctly performs ilvaticano", () => {
        const ilVaticanoCoordFrom = {row:3,column: 0}
        chessify_HCastling_KnightBoost_IlVaticano.moveWithAction(ilVaticanoCoordFrom, {coord: {row: 3, column: 3}, action: MoveAction.ilVaticano})
        expect(chessify_HCastling_KnightBoost_IlVaticano.currentBoard[3]).toEqual([{name: ChessPiecesName.whiteBishop, lastPosition: {row: 3, column: 3}}, null, null, {name: ChessPiecesName.whiteBishop, lastPosition: ilVaticanoCoordFrom}, null, null, null, null],)
        
        chessify_HCastling_KnightBoost_IlVaticano._undoLastMove()
        expect(chessify_HCastling_KnightBoost_IlVaticano.currentBoard[3]).toEqual([{name: ChessPiecesName.whiteBishop, lastPosition: null}, {name:  ChessPiecesName.blackPawn, lastPosition: null},  {name:  ChessPiecesName.blackPawn, lastPosition: null}, {name: ChessPiecesName.whiteBishop, lastPosition: null}, null, null, null, null],)
    })

    it ("correctly does for castling", () => {
        const castlingFrom = {row: 7, column: 3}
        chessify_HCastling_KnightBoost_IlVaticano.turnToPlay = PlayerColor.white
        chessify_HCastling_KnightBoost_IlVaticano.moveWithAction(castlingFrom, {coord: {row: 7, column: 1}, action: MoveAction.horizontalCastling})
        expect(chessify_HCastling_KnightBoost_IlVaticano.currentBoard[7]).toEqual([null,{name: ChessPiecesName.whiteKing, lastPosition: castlingFrom}, {name: ChessPiecesName.whiteRook, lastPosition: {row: 7, column: 0}}, null, null, null, null, null],)

        chessify_HCastling_KnightBoost_IlVaticano._undoLastMove()
        expect(chessify_HCastling_KnightBoost_IlVaticano.currentBoard[7]).toEqual([{name: ChessPiecesName.whiteRook, lastPosition: null}, null,null, {name: ChessPiecesName.whiteKing, lastPosition: null} ,null,null,null,null])
    })

    it ("correctly promotes pawn for knight boost and gives it the boost", () => {
        const knightBoostFrom = {row: 1, column: 1}
        chessify_HCastling_KnightBoost_IlVaticano.turnToPlay = PlayerColor.white
        chessify_HCastling_KnightBoost_IlVaticano.moveWithAction(knightBoostFrom, {coord: {row: 2, column: 0}, action: MoveAction.knightBoost})
        expect(chessify_HCastling_KnightBoost_IlVaticano.currentBoard[2]).toEqual([{name: ChessPiecesName.whiteKnight, lastPosition: null}, null, null, null, null, null, null, null],)

        chessify_HCastling_KnightBoost_IlVaticano._undoLastMove()
        expect(chessify_HCastling_KnightBoost_IlVaticano.currentBoard[1]).toEqual( [null, {name: ChessPiecesName.whitePawn, lastPosition: null}, null, null, null, {name: ChessPiecesName.blackPawn, lastPosition: null}, null, null],)
    })

    it ("correctly performs action for passant" ,() => {
        const passantFrom = {row: 3,column: 4}
        chessifyPassant_twoStepsHardCoded.moveWithAction(passantFrom, {coord: {row: 2, column: 5}, action: MoveAction.enPassant})
        expect(chessifyPassant_twoStepsHardCoded.currentBoard[2]).toEqual([
            { name: 'BLACK_KING', lastPosition: null },
            null,
            null,
            null,
            null,
            { name: 'WHITE_PAWN', lastPosition: passantFrom },
            null,
            null
          ])

          chessifyPassant_twoStepsHardCoded._undoLastMove()
          expect(chessifyPassant_twoStepsHardCoded.currentBoard[2]).toEqual([
            { name: 'BLACK_KING', lastPosition: null },
            null,
            null,
            null,
            null,
            null,
            null,
            null
          ])
          expect(chessifyPassant_twoStepsHardCoded.currentBoard[3]).toEqual([
            null,
            null,
            null,
            null,
            { name: 'WHITE_PAWN', lastPosition: null },
            { name: 'BLACK_PAWN', lastPosition: {row: 1, column: 5} },
            null,
            null
          ])
    })

    it ("does two steps of en-passant perfectly", () => {
        let pieceToPlay = {row: 1, column: 5}
        chessifyPassant_withoutHardcoding.turnToPlay = PlayerColor.black
        let moveList = chessifyPassant_withoutHardcoding._generatePseduoLegalMovesFor(pieceToPlay)
        const twoStepMove = moveList.filter((val) =>  val.coord.column === 5 && val.coord.row === 3).pop() as IGeneratedMoves
        chessifyPassant_withoutHardcoding.moveWithAction(pieceToPlay,twoStepMove)

        expect(chessifyPassant_withoutHardcoding.currentBoard[1]).toEqual( [null, null, null, null, null, null, null, null])

        pieceToPlay = {row: 3, column: 4}
        moveList = chessifyPassant_withoutHardcoding._generatePseduoLegalMovesFor(pieceToPlay)
        let nextMove = moveList.filter((val) => val.coord.column === 5 && val.coord.row === 2).pop() as IGeneratedMoves
        chessifyPassant_withoutHardcoding.moveWithAction(pieceToPlay, nextMove)

        expect(chessifyPassant_withoutHardcoding.currentBoard[2]).toEqual([{name : ChessPiecesName.blackKing, lastPosition: null}, null, null, null, null, {name : ChessPiecesName.whitePawn, lastPosition: pieceToPlay}, null, null],)
    })
})