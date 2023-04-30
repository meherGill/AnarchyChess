import { describe, it, expect } from "vitest";
import { ChessPiecesName } from "@enums";
import ChessLogic from "./ChessLogic";
import { ISquareCoordinate } from "../../shared/types";

const customSortFn = (a: ISquareCoordinate, b: ISquareCoordinate) => {
    if (a.row < b.row) {
        return -1;
    } else if (a.row > b.row) {
        return 1;
    } else {
        return a.column - b.column;
    }
};
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

    let chessify0 = new ChessLogic(boardConfig0);
    let chessifyA = new ChessLogic(boardConfigA);
    let chessifyB = new ChessLogic(boardConfigB);
    let chessifyC = new ChessLogic(boardConfigC);
    let chessifyPassant = new ChessLogic(boardConfigPassant);
    chessifyPassant.lastBlackMovePlayedArr = [
        {
            piece: ChessPiecesName.blackPawn,
            from: { row: 1, column: 1 },
            to: { row: 3, column: 1 },
        },
    ];
    it("correctly finds the white and black king", () => {
        expect(chessify0.blackKingPosition).toEqual([2, 0]);

        expect(chessifyA.blackKingPosition).toEqual([0, 1]);
        expect(chessifyA.whiteKingPosition).toEqual([7, 1]);

        expect(chessifyB.blackKingPosition).toEqual([0, 1]);
        expect(chessifyB.whiteKingPosition).toEqual([2, 2]);
    });
    describe("correctly returns the validMoves for a pawn", () => {
        it("correctly displays moves for black pawn in boardConfigA", () => {
            const result = chessifyA.generateMovesFor({ row: 1, column: 2 });
            expect(result).toEqual([{ row: 2, column: 2 }]);
        });
        it("correctly displays moves for a white pawn in boardConfigA", () => {
            const result = chessifyA.generateMovesFor({ row: 6, column: 1 });
            expect(result).toEqual([
                { row: 5, column: 1 },
                { row: 4, column: 1 },
            ]);
        });
        it("correctly displays moves for black pawn in boardConfigB", () => {
            const result = chessifyB.generateMovesFor({ row: 1, column: 2 });
            expect(result).toEqual([]);
        });
        it("correctly displays moves for a rank 7 white pawn in boardConfigB", () => {
            const result = chessifyB.generateMovesFor({ row: 1, column: 2 });
            expect(result).toEqual([]);
        });
        it("correctly displays moves for white pawn in boardConfigC", () => {
            const result = chessifyC.generateMovesFor({ row: 6, column: 1 });
            expect(result).toEqual([
                { row: 5, column: 1 },
                { row: 4, column: 1 },
                { row: 5, column: 0 },
            ]);
        });
        it("correctly displays only move passant for pawn in boardConfigPassant", () => {
            const result = chessifyPassant.generateMovesFor({
                row: 3,
                column: 0,
            });
            expect(result).toEqual([{ row: 2, column: 1 }]);
        });
    });
    describe("correctly returns validMoves for a king", () => {
        it("correctly displays moves for both kings in boardConfig0", () => {
            const resultBlackking = chessify0.generateMovesFor({
                row: 2,
                column: 0,
            }) as Array<ISquareCoordinate>;
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

            const resultWhiteKing = chessify0.generateMovesFor({
                row: 6,
                column: 7,
            }) as Array<ISquareCoordinate>;
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
            const resultBlackKing = chessifyPassant.generateMovesFor({
                row: 0,
                column: 1,
            }) as Array<ISquareCoordinate>;
            resultBlackKing.sort(customSortFn);

            expect(resultBlackKing).toEqual(
                [
                    { row: 0, column: 0 },
                    { row: 0, column: 2 },
                    { row: 1, column: 1 },
                    { row: 1, column: 2 },
                ].sort(customSortFn)
            );

            const resultWhiteKing = chessifyPassant.generateMovesFor({
                row: 6,
                column: 1,
            }) as Array<ISquareCoordinate>;
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
    });
});
