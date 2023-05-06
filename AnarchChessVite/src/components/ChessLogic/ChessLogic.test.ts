import { describe, it, expect } from "vitest";
import { ChessPiecesName } from "@enums";
import ChessLogic from "./ChessLogic";
import { IGeneratedMoves } from "@shared/types";
import { customSortFn, customSortFnWithActions, getCoordsOnly } from "@helperFunctionsForTest";

describe("ChessLogic class", () => {

    let boardConfig0 = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [ChessPiecesName.blackKing, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, ChessPiecesName.whiteKing],
        [null, null, null, null, null, null, null, null],
    ];

    let boardConfigA = [
        [null, ChessPiecesName.blackKing, null, null, null, null, null, null],
        [null, null, ChessPiecesName.blackPawn, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, ChessPiecesName.whiteKnight, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, ChessPiecesName.whitePawn, null, null, null, null, null, null],
        [null, ChessPiecesName.whiteKing, null, null, null, null, null, null],
    ];

    let boardConfigB = [
        [null, ChessPiecesName.blackKing, null, null, null, null, null, null],
        [null, null, ChessPiecesName.blackPawn, null, null, null, null, null],
        [null, null, ChessPiecesName.whiteKing, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, ChessPiecesName.whitePawn, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
    ];

    let boardConfigC = [
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

    let boardConfigPassant = [
        [null, ChessPiecesName.blackKing, null, null, null, null, null, null],
        [
            ChessPiecesName.blackQueen,
            ChessPiecesName.whitePawn,
            ChessPiecesName.whiteKnight,
            null,
            null,
            null,
            null,
            null,
        ],
        [null, null, null, null, null, null, null, null],
        [
            ChessPiecesName.whitePawn,
            ChessPiecesName.blackPawn,
            null,
            null,
            null,
            null,
            null,
            null,
        ],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, ChessPiecesName.whiteKing, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
    ];

    let boardConfigQueen = [
        [null, ChessPiecesName.blackKing, null, null, null, null, null, null],
        [
            ChessPiecesName.blackQueen,
            ChessPiecesName.whitePawn,
            ChessPiecesName.whiteKnight,
            null,
            null,
            null,
            null,
            null,
        ],
        [null, null, null, null, null, null, null, null],
        [
            ChessPiecesName.whitePawn,
            ChessPiecesName.blackPawn,
            null,
            null,
            null,
            null,
            null,
            null,
        ],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, ChessPiecesName.whiteKing, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
    ];

    let boardConfigKnook = [
        [ChessPiecesName.whiteKing, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, ChessPiecesName.whiteKnook, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, ChessPiecesName.blackKing]
    ]

    let boardConfigKnight = [
        [ChessPiecesName.whiteKing, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, ChessPiecesName.whiteKnight, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, ChessPiecesName.blackKing]
    ]

    let boardConfigRook = [
        [ChessPiecesName.whiteKing, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, ChessPiecesName.blackRook, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, ChessPiecesName.blackKing]
    ]

    let chessify0 = new ChessLogic(boardConfig0);
    let chessifyA = new ChessLogic(boardConfigA);
    let chessifyB = new ChessLogic(boardConfigB);
    let chessifyC = new ChessLogic(boardConfigC);
    let chessifyPassant = new ChessLogic(boardConfigPassant);
    let chessifyQueen = new ChessLogic(boardConfigQueen)
    let chessifyKnook = new ChessLogic(boardConfigKnook)
    let chessifyKnight = new ChessLogic(boardConfigKnight)
    let chessifyRook = new ChessLogic(boardConfigRook)

    chessifyPassant.lastBlackMovePlayedArr = [
        {
            piece: ChessPiecesName.blackPawn,
            from: { row: 1, column: 1 },
            to: { row: 3, column: 1 },
        },
    ];
    it("correctly finds the white and black king", () => {
        expect(chessify0.blackKingPosition).toEqual({row: 2, column: 0});

        expect(chessifyA.blackKingPosition).toEqual({row: 0, column: 1});
        expect(chessifyA.whiteKingPosition).toEqual({row: 7, column: 1});

        expect(chessifyB.blackKingPosition).toEqual({row:0, column:1});
        expect(chessifyB.whiteKingPosition).toEqual({row:2, column:2});
    });
    describe("correctly returns the validMoves for a pawn", () => {
        it("correctly displays moves for black pawn in boardConfigA", () => {
            const resultGenMoves = chessifyA.generateMovesFor({ row: 1, column: 2 });
            const result = getCoordsOnly(resultGenMoves)
            expect(result).toEqual([{ row: 2, column: 2 }]);
        });
        it("correctly displays moves for a white pawn in boardConfigA", () => {
            const resultGenMoves = chessifyA.generateMovesFor({ row: 6, column: 1 });
            const result = getCoordsOnly(resultGenMoves)
            expect(result).toEqual([
                { row: 5, column: 1 },
                { row: 4, column: 1 },
            ]);
        });
        it("correctly displays moves for black pawn in boardConfigB", () => {
            const resultGenMoves = chessifyB.generateMovesFor({ row: 1, column: 2 });
            const result = getCoordsOnly(resultGenMoves)
            expect(result).toEqual([]);
        });
        it("correctly displays moves for a rank 7 white pawn in boardConfigB", () => {
            const resultGenMoves = chessifyB.generateMovesFor({ row: 1, column: 2 })
            const result = getCoordsOnly(resultGenMoves);
            expect(result).toEqual([]);
        });
        it("correctly displays moves for white pawn in boardConfigC", () => {
            const resultGenMoves = chessifyC.generateMovesFor({ row: 6, column: 1 });
            const result = getCoordsOnly(resultGenMoves)
            expect(result).toEqual([
                { row: 5, column: 1 },
                { row: 4, column: 1 },
                { row: 5, column: 0 },
            ]);
        });
        it("correctly displays only move passant for pawn in boardConfigPassant", () => {
            const resultGenMoves = chessifyPassant.generateMovesFor({
                row: 3,
                column: 0,
            });
            const result = getCoordsOnly(resultGenMoves)
            expect(result).toEqual([{ row: 2, column: 1 }]);
        });
    });
    describe("correctly returns validMoves for a king", () => {
        it("correctly displays moves for both kings in boardConfig0", () => {
            const resultBlackkingGenMoves = chessify0.generateMovesFor({
                row: 2,
                column: 0,
            }) as Array<IGeneratedMoves>;
            const resultBlackking = getCoordsOnly(resultBlackkingGenMoves)
            resultBlackking.sort(customSortFn);
            expect(resultBlackking).toEqual(
                [
                    { row: 1, column: 0 },
                    { row: 1, column: 1 },
                    { row: 2, column: 1 },
                    { row: 3, column: 0 },
                    { row: 3, column: 1 },
                ].sort(customSortFn)
            );

            const resultWhiteKingGenMoves = chessify0.generateMovesFor({
                row: 6,
                column: 7,
            }) as Array<IGeneratedMoves>;
            const resultWhiteKing = getCoordsOnly(resultWhiteKingGenMoves)
            resultWhiteKing.sort(customSortFn);
            expect(resultWhiteKing).toEqual(
                [
                    { row: 5, column: 7 },
                    { row: 5, column: 6 },
                    { row: 6, column: 6 },
                    { row: 7, column: 7 },
                    { row: 7, column: 6 },
                ].sort(customSortFn)
            );
        });
        it("correctly displays moves for both kings in boardConfigPassantable", () => {
            const resultBlackKingGenMoves = chessifyPassant.generateMovesFor({
                row: 0,
                column: 1,
            }) as Array<IGeneratedMoves>;
            const resultBlackKing = getCoordsOnly(resultBlackKingGenMoves)
            resultBlackKing.sort(customSortFn);
            expect(resultBlackKing).toEqual(
                [
                    { row: 1, column: 1 },
                    { row: 1, column: 2 },
                ].sort(customSortFn)
            );

            const resultWhiteKingGenMoves = chessifyPassant.generateMovesFor({
                row: 6,
                column: 1,
            }) as Array<IGeneratedMoves>;
            const resultWhiteKing = getCoordsOnly(resultWhiteKingGenMoves)
            resultWhiteKing.sort(customSortFn);
            expect(resultWhiteKing).toEqual(
                [
                    { row: 7, column: 0 },
                    { row: 7, column: 1 },
                    { row: 7, column: 2 },
                    { row: 6, column: 0 },
                    { row: 6, column: 2 },
                    { row: 5, column: 0 },
                    { row: 5, column: 1 },
                ].sort(customSortFn)
            );
        });

        it ("correctly displays queen moves", () => {
            let resultGenMoves : IGeneratedMoves[] = chessifyQueen.generateMovesFor({row: 1, column: 0})
            const result = getCoordsOnly(resultGenMoves).sort(customSortFn)
            expect(result).toEqual([
                {row: 0, column: 0},
                {row: 2, column: 0},
                {row: 3, column: 0},
                {row: 1, column: 1},
                {row: 2, column: 1},
                {row: 3, column: 2},
                {row: 4, column: 3},
                {row: 5, column: 4},
                {row: 6, column: 5},
                {row: 7, column: 6}
            ].sort(customSortFn))
        })

        it ("correctly displays queen moves", () => {
            let resultGenMoves = chessifyQueen.generateMovesFor({row: 1, column: 0})
            const result = getCoordsOnly(resultGenMoves).sort(customSortFn)
            expect(result).toEqual([
                {row: 0, column: 0},
                {row: 2, column: 0},
                {row: 3, column: 0},
                {row: 1, column: 1},
                {row: 2, column: 1},
                {row: 3, column: 2},
                {row: 4, column: 3},
                {row: 5, column: 4},
                {row: 6, column: 5},
                {row: 7, column: 6}
            ].sort(customSortFn))
        })

        it ("correctly displays rook moves", () => {
            let resultGenMoves = chessifyRook.generateMovesFor({row: 4, column: 3})
            const result = getCoordsOnly(resultGenMoves).sort(customSortFn)
            expect(result).toEqual([
                {row: 0, column: 3},
                {row: 1, column: 3},
                {row: 2, column: 3},
                {row: 3, column: 3},
                {row: 5, column: 3},
                {row: 6, column: 3},
                {row: 7, column: 3},
                {row: 4, column: 0},
                {row: 4, column: 1},
                {row: 4, column: 2},
                {row: 4, column: 4},
                {row: 4, column: 5},
                {row: 4, column: 6},
                {row: 4, column: 7},
            ].sort(customSortFn))
        })

        it ("correctly displays bishop moves", () => {
            let resultGenMoves = chessifyC.generateMovesFor({row: 5, column: 0})
            const result = getCoordsOnly(resultGenMoves).sort(customSortFn)
            expect(result).toEqual([
                {row: 6, column: 1},
                {row: 4, column: 1},
                {row: 3, column: 2},
                {row: 2, column: 3},
                {row: 1, column: 4},
                {row: 0, column: 5},
            ].sort(customSortFn))
        })

        it ("correctly displays knight moves", () => {
            let resultGenMoves = chessifyKnight.generateMovesFor({row: 4, column: 3})
            const result = getCoordsOnly(resultGenMoves).sort(customSortFn)
            expect(result).toEqual([
                {row:3, column: 1},
                {row:5, column: 1},
                {row:3, column: 5},
                {row:5, column: 5},
                {row:6, column: 4},
                {row:6, column: 2},
                {row:2, column: 4},
                {row:2, column: 2},

            ].sort(customSortFn))
        })

        it ("correctly knook moves", () => {
            let resultGenMoves = chessifyKnook.generateMovesFor({row: 4, column: 3})
            const result = getCoordsOnly(resultGenMoves).sort(customSortFn)
            expect(result).toEqual([
                {row: 4, column: 0},
                {row: 4, column: 1},
                {row: 4, column: 2},
                {row: 4, column: 4},
                {row: 4, column: 5},
                {row: 4, column: 6},
                {row: 4, column: 7},
                {row: 3, column: 3},
                {row: 2, column: 3},
                {row: 1, column: 3},
                {row: 0, column: 3},
                {row: 5, column: 3},
                {row: 6, column: 3},
                {row: 7, column: 3},
                {row: 2, column: 4},
                {row: 2, column: 2},
                {row: 6, column: 2},
                {row: 6, column: 4},
                {row: 3, column: 1},
                {row: 5, column: 1},
                {row: 3, column: 5},
                {row: 5, column: 5},
            ].sort(customSortFn))
        })
    });
});

describe("ChessLogic class, specific for king", () => {
    let boardConfigKing = [
        [null, null,null,null,null,null,null,null ],
        [null, null,null,null,null,null,null,null ],
        [null, null,null,null,null,null,null,null ],
        [null, null,null,null,ChessPiecesName.whiteKing,null,null,null ],
        [null, null,null,ChessPiecesName.blackQueen,null,null,null,null ],
        [null, null,null,null,null,null,null,null ],
        [null, null,null,null,null,ChessPiecesName.whiteQueen,ChessPiecesName.blackKing,null ],
        [null, null,null,null,null,null,null, ]
    ]

    const chessifyKing = new ChessLogic(boardConfigKing)

    it("correctly gives legal moves of whiteKing in boardConfigKing", () => {
        const whiteKingResult = chessifyKing.generateMovesFor(chessifyKing.whiteKingPosition).sort(customSortFnWithActions)
        expect(whiteKingResult).toEqual([
            {coord: {row: 4, column: 3}},
            {coord: {row: 3, column: 5}},
            {coord: {row: 2, column: 4}}
        ].sort(customSortFnWithActions))

        const blackKingResult = chessifyKing.generateMovesFor(chessifyKing.blackKingPosition).sort(customSortFnWithActions)
        expect(blackKingResult).toEqual([
            {coord: {row:6, column: 5}},
            {coord: {row:7, column: 7}},
            {coord: {row:5, column: 7}},
        ].sort(customSortFnWithActions))
    })
})