import { describe, it, expect} from "vitest";
import ChessLogic from "../ChessLogic";
import { ChessPiecesName, MoveAction, PlayerColor, TypeOfChessPiece } from "@enums";
import { customSortFn, customSortFnWithActions } from "@helperFunctionsForTest";
import { CoordMapper } from "../../../shared/utility";


describe("test post processing function" , () => {
    const boardConfigA = [
        [ChessPiecesName.blackKing, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, ChessPiecesName.whiteQueen, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn],
        [null, null, null, null, null, null, null, null],
        [ChessPiecesName.blackRook, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, ChessPiecesName.whiteKing]
    ]

    const boardConfigB = [
        [ChessPiecesName.blackRook, null, null, ChessPiecesName.blackQueen, null, null, null, ChessPiecesName.blackKing],
        [ChessPiecesName.blackPawn, ChessPiecesName.blackPawn,null,ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn],
        [null, null, ChessPiecesName.whiteKnook, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, ChessPiecesName.whiteKing]
    ]

    const boardConfigC = [
        [ChessPiecesName.blackKing, null, null, null, null, null, null, ChessPiecesName.blackQueen],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, ChessPiecesName.whiteKnook, null],
        [ChessPiecesName.whiteBishop, null, null, null, null, null, null, ChessPiecesName.whiteKing]
    ]

    // const boardConfigPassant 
    const boardConfigPassant = [
        [ChessPiecesName.blackKing, null, null, null, null, null, null,null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, ChessPiecesName.whiteBishop, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.whiteBishop, null, null],
        [null, null, null, ChessPiecesName.whiteKing, null, null, null, null]
    ]

    const chessifyA = new ChessLogic(boardConfigA)
    const chessifyB = new ChessLogic(boardConfigB)
    const chessifyC = new ChessLogic(boardConfigC)
    const chessifyPassant = new ChessLogic(boardConfigPassant)

    it ("correctly returns all coords on board for a player and the set of unoque pieces for the opposite player", () => {
        chessifyA.turnToPlay = PlayerColor.white
        let [allCoordsFor1Plyer, oppUniquePiecesSet] = chessifyA.updateAllCoordsOfPieceOnBoardForColor(chessifyA.turnToPlay)
        expect(allCoordsFor1Plyer.sort(customSortFn)).toEqual([
            {row: 2, column: 1},
            {row: 7, column: 7}
        ].sort(customSortFn))

        expect(oppUniquePiecesSet).toEqual(
            new Set(
                [TypeOfChessPiece.King, TypeOfChessPiece.Pawn, TypeOfChessPiece.Rook]
            )
        )

        chessifyA.turnToPlay = PlayerColor.black
        let [new_allCoordsFor1Plyer, new_oppUniquePiecesSet] = chessifyA.updateAllCoordsOfPieceOnBoardForColor(chessifyA.turnToPlay)
        expect(new_allCoordsFor1Plyer.sort(customSortFn)).toEqual([
            {row: 0 , column: 0},
            {row: 4 , column: 6},
            {row: 4 , column: 7},
            {row: 6 , column: 0}
        ].sort(customSortFn))

        expect(new_oppUniquePiecesSet).toEqual(new Set([
                TypeOfChessPiece.King, TypeOfChessPiece.Queen
            ]))
    })

    it ("correctly generates pseudolegal moves for all pieces for 1 player", () => {
        chessifyB.turnToPlay = PlayerColor.black
        const allPseudoLegalMoves = chessifyB._generatePseudoLegalMovesForAllPiecesFor(chessifyB.turnToPlay)
        const expectedMapObject = new CoordMapper()

        //all 7 black pawn moves
        expectedMapObject.set({row: 1, column: 0}, 
            [{coord: {row: 2, column: 0}}, {coord: {row: 3, column: 0}}].sort(customSortFnWithActions))
        expectedMapObject.set({row: 1, column: 1}, 
            [{coord: {row: 2, column: 1}}, {coord: {row: 3, column: 1}},  {coord: {row: 2, column: 2}}].sort(customSortFnWithActions))
        expectedMapObject.set({row: 1, column: 3}, 
            [{coord: {row: 2, column: 3}}, {coord: {row: 3, column: 3}},  {coord: {row: 2, column: 2}}].sort(customSortFnWithActions))
        expectedMapObject.set({row: 1, column: 4}, 
            [{coord: {row: 2, column: 4}}, {coord: {row: 3, column: 4}}].sort(customSortFnWithActions));
        expectedMapObject.set({row: 1, column: 5}, 
            [{coord: {row: 2, column: 5}}, {coord: {row: 3, column: 5}}].sort(customSortFnWithActions));
        expectedMapObject.set({row: 1, column: 6}, 
            [{coord: {row: 2, column: 6}}, {coord: {row: 3, column: 6}}].sort(customSortFnWithActions));
        expectedMapObject.set({row: 1, column: 7}, 
            [{coord: {row: 2, column: 7}}, {coord: {row: 3, column: 7}}].sort(customSortFnWithActions));
        
        //black rook moves
        expectedMapObject.set({row: 0, column: 0},[{coord: {row: 0, column: 1}}, {coord: {row: 0, column: 2}}].sort(customSortFnWithActions))

        //black queen moves
        expectedMapObject.set({row: 0, column: 3},[
            {coord: {row: 0, column: 1}}, 
            {coord: {row: 0, column: 2}},
            {coord: {row: 0, column: 4}},
            {coord: {row: 0, column: 5}},
            {coord: {row: 0, column: 6}},
            {coord: {row: 1, column: 2}},
            {coord: {row: 2, column: 1}},
            {coord: {row: 3, column: 0}},
        ].sort(customSortFnWithActions))

        //black king moves
        expectedMapObject.set({row: 0, column: 7},
            [{coord: {row: 0, column: 6}}, ])

        expect(expectedMapObject.size).toEqual(allPseudoLegalMoves.size)
        for (let [key, value] of expectedMapObject.entries()){
            const recievedValue = allPseudoLegalMoves.get(key).sort(customSortFnWithActions)
            expect(recievedValue).toEqual(value)
        }
    })

    it ("correctly calculates all legal moves", () => {
        let expectedLegalMoves = new CoordMapper()
        let allLegalMoves = chessifyC.memoizedLegalMovesMap

        //setting legal king moves
        expectedLegalMoves.set({row: 7, column: 7}, [
        {coord: {row: 7, column: 6}}
        ].sort(customSortFnWithActions))

        //setting legal knook moves
        expectedLegalMoves.set({row: 6, column: 6}, [
            {coord: {row: 6, column: 7}},
            {coord: {row: 4, column: 7}}
        ].sort(customSortFnWithActions))

        //setting legal bishop moves
        expectedLegalMoves.set({row: 7, column: 0}, [
            {coord: {row: 0, column: 7}}
        ].sort(customSortFnWithActions))

        expect(expectedLegalMoves.size).toEqual(allLegalMoves.size)
        for (let [key, value] of expectedLegalMoves.entries()){
            const recievedValue = allLegalMoves.get(key).sort(customSortFnWithActions)
            expect(recievedValue).toEqual(value)
        }

        expectedLegalMoves = new CoordMapper()
        allLegalMoves = chessifyPassant.memoizedLegalMovesMap

        //setting legal king moves
        expectedLegalMoves.set({row: 7, column: 3}, [
            {coord: {row: 6, column: 3}},
            {coord: {row: 6, column: 4}},
        ].sort(customSortFnWithActions))

        //setting legal bishop moves
        expectedLegalMoves.set({row: 6, column: 2}, [
            {coord: {row: 6, column: 5}, action: MoveAction.ilVaticano},
        ])

        expectedLegalMoves.set({row: 6, column: 5}, [
            {coord: {row: 6, column: 2}, action: MoveAction.ilVaticano},
        ])

        for (let [key, value] of expectedLegalMoves.entries()){
            const recievedValue = allLegalMoves.get(key).sort(customSortFnWithActions)
            expect(recievedValue).toEqual(value)
        }

        
    })
})