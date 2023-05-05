import { describe, it, expect } from "vitest";
import { ChessPiecesName, MoveAction } from "@enums";
import ChessLogic from "./ChessLogic";
import { ISquareCoordinate } from "@shared/types";
import { vanillaBishopLikeMoves, knightLikeMoves, rookLikeMoves, generateIlVaticano } from "./moveGeneratingFunctions";
import { customSortFn, getCoordsOnly } from "../../shared/helperFunctionsForTest";


describe("ChessLogic class", () => {
    let boardConfigBishop = [
        [null, ChessPiecesName.blackKing, null, null, null, null, null, null],
        [null, null, ChessPiecesName.blackPawn, null, null, null, null, null],
        [null, null, ChessPiecesName.whiteKing, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [
            ChessPiecesName.blackBishop,
            null,
            ChessPiecesName.whiteBishop,
            null,
            null,
            null,
            null,
            null,
        ],
        [null, ChessPiecesName.whitePawn, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
    ];

    let boardConfigRook = [
        [null, null, null, null, null, null, ChessPiecesName.blackRook, null],
        [null, ChessPiecesName.blackKing, ChessPiecesName.blackPawn, null, null, null, null, null],
        [null, null, ChessPiecesName.whiteKing, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [
            ChessPiecesName.blackBishop,
            null,
            ChessPiecesName.whiteBishop,
            null,
            null,
            null,
            null,
            null,
        ],
        [null, ChessPiecesName.whiteRook, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
    ]

    let boardConfigKnight = [
        [ChessPiecesName.whiteKing, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, ChessPiecesName.blackKnight, null, null, null, null],
        [
            null,
            null,
            null,
            null,
            null,
            null,
            ChessPiecesName.blackKing,
            null,
        ],
        [null, null, null, null, null, ChessPiecesName.whiteRook, null, null],
        [null, null, null, null, null, null, null, ChessPiecesName.whiteKnight],
    ]

    let boardConfigIlVaticano = [
        [ChessPiecesName.whiteKing, null, null, null, null, null, null, null],
        [null, ChessPiecesName.blackBishop, null, ChessPiecesName.whitePawn, ChessPiecesName.blackBishop, null, null, null],
        [ChessPiecesName.whiteBishop, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.whiteBishop, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.whiteBishop, null],
        [null, ChessPiecesName.blackBishop, ChessPiecesName.whitePawn, ChessPiecesName.whitePawn, ChessPiecesName.whiteBishop, null, null, null],
        [null, ChessPiecesName.blackBishop, ChessPiecesName.whitePawn, ChessPiecesName.whitePawn, ChessPiecesName.blackBishop, null, null, null],
        [null, ChessPiecesName.whiteBishop, ChessPiecesName.whitePawn, ChessPiecesName.whitePawn, ChessPiecesName.whiteBishop, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, ChessPiecesName.whiteKnight],
    ]
    let chessifyBishop = new ChessLogic(boardConfigBishop);
    let chessifyRook = new ChessLogic(boardConfigRook);
    let chessifyKnight = new ChessLogic(boardConfigKnight)
    let chessifyIlVaticano = new ChessLogic(boardConfigIlVaticano);

    it ("correctly generates vanilla bishop like moves" ,() => {
        const blackBishopResultsGenMoves = vanillaBishopLikeMoves({row: 5, column: 0},chessifyBishop.currentBoard)
        const blackBishopResults = getCoordsOnly(blackBishopResultsGenMoves).sort(customSortFn)
        expect(blackBishopResults).toEqual(
            [
                {row: 4, column: 1},
                {row: 3, column: 2},
                {row: 2, column: 3},
                {row: 1, column: 4},
                {row: 0, column: 5},
                {row: 6, column: 1}
            ].sort(customSortFn)
        )

        const whiteBishopResutsGenMoves = vanillaBishopLikeMoves({row:5, column:2}, chessifyBishop.currentBoard)
        const whiteBishopResuts = getCoordsOnly(whiteBishopResutsGenMoves).sort(customSortFn)
        expect(whiteBishopResuts).toEqual(
            [
                {row: 4, column: 1},
                {row: 3, column: 0},
                {row: 6, column: 3},
                {row: 7, column:4},
                {row: 4, column: 3},
                {row: 3, column: 4},
                {row: 2, column: 5},
                {row: 1, column: 6},
                {row: 0, column: 7}
            ].sort(customSortFn)
        )
    })

    it ("correctly generates rook like moves", () => {
        const blackRookResultsGenMoves = rookLikeMoves({row: 6, column: 1}, chessifyRook.currentBoard)
        const blackRookResults = getCoordsOnly(blackRookResultsGenMoves).sort(customSortFn)
        expect(blackRookResults).toEqual([
            {row: 5, column: 1},
            {row: 4, column: 1},
            {row: 3, column: 1},
            {row: 2, column: 1},
            {row: 1, column: 1},
            {row: 7, column: 1},
            {row: 6, column: 0},
            {row: 6, column: 2},
            {row: 6, column: 3},
            {row: 6, column: 4},
            {row: 6, column: 5},
            {row: 6, column: 6},
            {row: 6, column: 7},
        ].sort(customSortFn))

        const whiteRookResultsGenMoves = rookLikeMoves({row:0, column: 6}, chessifyRook.currentBoard)
        const whiteRookResults = getCoordsOnly(whiteRookResultsGenMoves).sort(customSortFn)
        expect(whiteRookResults).toEqual([
            {row: 0, column: 0},
            {row: 0, column: 1},
            {row: 0, column: 2},
            {row: 0, column: 3},
            {row: 0, column: 4},
            {row: 0, column: 5},
            {row: 0, column: 7},
            {row: 1, column: 6},
            {row: 2, column: 6},
            {row: 3, column: 6},
            {row: 4, column: 6},
            {row: 5, column: 6},
            {row: 6, column: 6},
            {row: 7, column: 6},
        ].sort(customSortFn))
    })

    it ("correctly generates knight moves" , () => {
        const blackKnightGenMoves = knightLikeMoves({row: 4, column: 3}, chessifyKnight.currentBoard)
        const blackKnight = getCoordsOnly(blackKnightGenMoves).sort(customSortFn)
        expect(blackKnight).toEqual([
            {row:  2, column: 4},
            {row:  2, column: 2},
            {row:  6, column: 2},
            {row:  6, column: 4},
            {row:  3, column: 1},
            {row:  3, column: 5},
            {row:  5, column: 1},
            {row:  5, column: 5},
        ].sort(customSortFn))

        const whiteKnightGenMoves = knightLikeMoves({row: 7, column: 7}, chessifyKnight.currentBoard)
        const whiteKnight = getCoordsOnly(whiteKnightGenMoves)
        expect(whiteKnight).toEqual([
            {row: 5, column: 6}
        ])
    })

    it ("correctly checks for ilvaticano validity", () => {
        const result1 = generateIlVaticano({row: 1, column: 1}, chessifyIlVaticano.currentBoard)
        const result2 = generateIlVaticano({row: 2, column: 3}, chessifyIlVaticano.currentBoard)
        const result3 = generateIlVaticano({row: 3, column: 1}, chessifyIlVaticano.currentBoard)
        const result4_1 = generateIlVaticano({row: 4, column: 1}, chessifyIlVaticano.currentBoard)
        const result4_2 = generateIlVaticano({row: 4, column: 4}, chessifyIlVaticano.currentBoard)
        const result5 = generateIlVaticano({row: 5, column: 1}, chessifyIlVaticano.currentBoard)

        expect(result1).toEqual({
            ilVaticanoPossible: false,
            secondBishopLikeCoords: []
        })

       
        expect(result2).toEqual({
            ilVaticanoPossible: true,
            secondBishopLikeCoords: [{coord: {row: 2, column: 0}, action: MoveAction.ilVaticano}, {coord: {row: 2, column: 6}, action: MoveAction.ilVaticano}]
        })

        expect(result3).toEqual({
            ilVaticanoPossible: false,
            secondBishopLikeCoords: []
        })

        expect(result4_1).toEqual({
            ilVaticanoPossible: true,
            secondBishopLikeCoords: [{coord: {row: 4, column: 4}, action: MoveAction.ilVaticano}]
        })

        expect(result4_2).toEqual({
            ilVaticanoPossible: true,
            secondBishopLikeCoords: [{coord: {row: 4, column: 1}, action: MoveAction.ilVaticano}]
        })

        expect(result5).toEqual({
            ilVaticanoPossible: false,
            secondBishopLikeCoords: []
        })
    })
})