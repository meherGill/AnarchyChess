import { describe, expect, it } from "vitest";
import ChessLogic from "@components/ChessLogic/ChessLogic";
import { ChessPiecesName, MoveAction } from "../../../shared/enums";
import { customSortFnWithActions } from "../../../shared/helperFunctionsForTest";

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
        const results = chessify._generatePseduoLegalMovesFor({row: 1, column: 3}).sort(customSortFnWithActions)
        expect(results).toEqual([
            { coord: { row: 0, column: 3 }, action: MoveAction.pawnPromotionBishop },
            { coord: { row: 0, column: 3 }, action: MoveAction.pawnPromotionKnook },
            { coord: { row: 0, column: 3 }, action: MoveAction.pawnPromotionQueen },
            { coord: { row: 0, column: 3 }, action: MoveAction.pawnPromotionRook },
            { coord: { row: 0, column: 4 }, action: MoveAction.pawnPromotionBishop },
            { coord: { row: 0, column: 4 }, action: MoveAction.pawnPromotionKnook },
            { coord: { row: 0, column: 4 }, action: MoveAction.pawnPromotionQueen },
            { coord: { row: 0, column: 4 }, action: MoveAction.pawnPromotionRook },
            { coord: { row: 1, column: 1 }, action: MoveAction.knightBoost },
            { coord: { row: 2, column: 2 }, action: MoveAction.knightBoost },
            { coord: { row: 1, column: 5 }, action: MoveAction.knightBoost },
            { coord: { row: 2, column: 4 }, action: MoveAction.knightBoost },
            { coord: { row: 1, column: 2 }, action: MoveAction.knightBoost },
            { coord: { row: 2, column: 3 }, action: MoveAction.knightBoost },
            { coord: { row: 1, column: 6 }, action: MoveAction.knightBoost },
            { coord: { row: 2, column: 5 }, action: MoveAction.knightBoost },
          ].sort(customSortFnWithActions))
    })

    it ("correctly generates moves for black pawn" , () => {
        const results = chessify._generatePseduoLegalMovesFor({row: 6, column: 6}).sort(customSortFnWithActions)
        expect(results).toEqual([
            { coord: { row: 7, column: 5 }, action: MoveAction.pawnPromotionBishop },
            { coord: { row: 7, column: 5 }, action: MoveAction.pawnPromotionKnook},
            { coord: { row: 7, column: 5 }, action: MoveAction.pawnPromotionQueen},
            { coord: { row: 7, column: 5 }, action: MoveAction.pawnPromotionRook },
            { coord: { row: 6, column: 3 }, action: MoveAction.knightBoost },
            { coord: { row: 5, column: 4 }, action: MoveAction.knightBoost },
            { coord: { row: 5, column: 6 }, action: MoveAction.knightBoost },
            { coord: { row: 6, column: 7 }, action: MoveAction.knightBoost },

          ].sort(customSortFnWithActions))
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

    it ("correctly tells if pawn will promote next move" , () => {
        let baoardConfigNew = [
            [null,null,null,null,ChessPiecesName.blackBishop,null,null,null],
            [null,null,null,ChessPiecesName.whitePawn,null,null,null,null],
            [ChessPiecesName.whitePawn,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [ChessPiecesName.blackKing,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,ChessPiecesName.blackPawn,null],
            [null,null,null,null,null,ChessPiecesName.whiteBishop,ChessPiecesName.whiteKing,ChessPiecesName.blackKnight],
        ]
        
        const chessifyNew = new ChessLogic(baoardConfigNew)
        let res = chessifyNew.checkIfNeedToProvidePawnPromotionOption({row: 1, column: 3}, {row: 0, column: 3})
        expect(res).toEqual(true)
        res = chessifyNew.checkIfNeedToProvidePawnPromotionOption({row: 1, column: 3}, {row: 0, column: 4})
        expect(res).toEqual(true)
        res = chessifyNew.checkIfNeedToProvidePawnPromotionOption({row: 2, column: 0}, {row: 0, column: 3})
        expect(res).toEqual(false)

        //supposed to be false since its not blacks turn right now
        res = chessifyNew.checkIfNeedToProvidePawnPromotionOption({row: 6, column: 6}, {row: 7, column: 5})
        expect(res).toEqual(false)

        //after making the following move, it will now show promotion for black
        chessifyNew.playerMadeMove({row: 7, column: 6}, {row:6, column: 7})
        res = chessifyNew.checkIfNeedToProvidePawnPromotionOption({row: 6, column: 6}, {row: 7, column: 5})
        expect(res).toEqual(true)
    })
})
