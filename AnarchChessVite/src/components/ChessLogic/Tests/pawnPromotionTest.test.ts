import { describe, expect, it } from "vitest";
import ChessLogic from "@components/ChessLogic/ChessLogic";
import { ChessPiecesName, MoveAction } from "../../../shared/enums";

describe ("correctly handles pawn promotion" ,() => {
    const baoardConfig = [
        [null,null,null,null,ChessPiecesName.blackBishop,null,null,null],
        [null,null,null,ChessPiecesName.whitePawn,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [ChessPiecesName.blackKing,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,ChessPiecesName.blackPawn,null],
        [null,null,null,null,null,ChessPiecesName.whiteBishop,ChessPiecesName.whiteKing,ChessPiecesName.blackKnight],
    ]

    const chessify = new ChessLogic(baoardConfig)

    it ("correctly generates moves for white pawn" , () => {
        const results = chessify._generatePseduoLegalMovesFor({row: 1, column: 3})
        expect(results).toEqual([
            { coord: { row: 0, column: 3 }, action: 'PAWN_PROMOTION_BISHOP' },
            { coord: { row: 0, column: 3 }, action: 'PAWN_PROMOTION_KNOOK' },
            { coord: { row: 0, column: 3 }, action: 'PAWN_PROMOTION_QUEEN' },
            { coord: { row: 0, column: 3 }, action: 'PAWN_PROMOTION_ROOK' },
            { coord: { row: 0, column: 4 }, action: 'PAWN_PROMOTION_BISHOP' },
            { coord: { row: 0, column: 4 }, action: 'PAWN_PROMOTION_KNOOK' },
            { coord: { row: 0, column: 4 }, action: 'PAWN_PROMOTION_QUEEN' },
            { coord: { row: 0, column: 4 }, action: 'PAWN_PROMOTION_ROOK' }
          ])
    })

    it ("correctly generates moves for black pawn" , () => {
        const results = chessify._generatePseduoLegalMovesFor({row: 6, column: 6})
        expect(results).toEqual([
            { coord: { row: 7, column: 5 }, action: 'PAWN_PROMOTION_BISHOP' },
            { coord: { row: 7, column: 5 }, action: 'PAWN_PROMOTION_KNOOK' },
            { coord: { row: 7, column: 5 }, action: 'PAWN_PROMOTION_QUEEN' },
            { coord: { row: 7, column: 5 }, action: 'PAWN_PROMOTION_ROOK' }
          ])
    })

    it ("promotes the piece correctly" , () => {
        chessify.moveWithAction({row: 6, column: 6}, {coord: {row: 7, column: 5}, action: MoveAction.pawnPromotionBishop})
        expect(chessify.currentBoard[7]).toEqual(
            [null,null,null,null,null,
                {name: ChessPiecesName.blackBishop ,lastPosition: null},
                {name: ChessPiecesName.whiteKing, lastPosition: null},
                {name: ChessPiecesName.blackKnight, lastPosition: null}
            ],
        )
    })

    it ("does player move correctly" , () => {
        chessify.playerMadeMove({row: 1, column: 3} , {row: 0, column: 4}, MoveAction.pawnPromotionKnook)
        expect(chessify.currentBoard[0]).toEqual([
            null,
            null,
            null,
            null,
            { name: 'WHITE_KNOOK', lastPosition: null },
            null,
            null,
            null
          ])
    })
})
