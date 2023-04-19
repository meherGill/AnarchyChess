import { describe, it, expect } from "vitest";
import { ChessPieces } from "@enums";
import ChessLogic from "./ChessLogic";
describe("ChessLogic class", () => {
    it("correctly finds the white and black king", () => {
        let boardMatrix = [
            ["", ChessPieces.blackKing, "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", ChessPieces.whiteKing, "", "", "", "", "", ""],
        ];

        const chessify = new ChessLogic(boardMatrix);
        expect(chessify.blackKingPosition).toBe([0, 1]);
        expect(chessify.whiteKingPosition).toBe([7, 1]);
    });
});
