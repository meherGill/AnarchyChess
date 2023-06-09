import { describe, it, expect, vi} from "vitest";
import ChessLogic from "../ChessLogic";
import { ChessPiecesName, MoveAction, PlayerColor, TypeOfChessPiece } from "@enums";
import { customSortFn, customSortFnWithActions } from "@helperFunctionsForTest";
import { CoordMapper } from "@shared/utility";


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

    const boardConfigVaticano = [
        [ChessPiecesName.blackKing, null, null, null, null, null, null,null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, ChessPiecesName.whiteBishop, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.whiteBishop, null, null],
        [null, null, null, ChessPiecesName.whiteKing, null, null, null, null]
    ]

    const boardConfigForcedMovePassant = [
        [ChessPiecesName.blackKing, null, null, null, null, null, ChessPiecesName.blackQueen, ChessPiecesName.blackQueen],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [ChessPiecesName.blackPawn, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, ChessPiecesName.whitePawn, null, null, null, null, ChessPiecesName.whitePawn, ChessPiecesName.whitePawn],
        [null, null, null, null, null, null, null, ChessPiecesName.whiteKing]
    ]

    const chessifyA = new ChessLogic(boardConfigA)
    const chessifyB = new ChessLogic(boardConfigB)
    const chessifyC = new ChessLogic(boardConfigC)
    const chessifyVaticano = new ChessLogic(boardConfigVaticano)
    const chessifyForcedPassant = new ChessLogic(boardConfigForcedMovePassant)

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

        // ####
        // ### now checking for vaticano ##
        // ####
        
        expectedLegalMoves = new CoordMapper()
        allLegalMoves = chessifyVaticano.memoizedLegalMovesMap

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

        expect(expectedLegalMoves.size).toEqual(allLegalMoves.size)
        for (let [key, value] of expectedLegalMoves.entries()){
            const recievedValue = allLegalMoves.get(key).sort(customSortFnWithActions)
            expect(recievedValue).toEqual(value)
        }

        // ####
        // ### now checking for forced passant ##
        // ####

        expectedLegalMoves = new CoordMapper()

        chessifyForcedPassant.moveWithAction({row: 6, column: 1}, {coord: {row: 4, column: 1}}, true)
        chessifyForcedPassant.turnToPlay = PlayerColor.black
        chessifyForcedPassant.postMoveComputation()

        expectedLegalMoves.set({row:4, column: 0}, [{coord: {row: 5, column: 1}, action: MoveAction.enPassant}])
        allLegalMoves = chessifyForcedPassant.memoizedLegalMovesMap

        expect(expectedLegalMoves.size).toEqual(allLegalMoves.size)
        for (let [key, value] of expectedLegalMoves.entries()){
            expect(allLegalMoves.get(key).sort(customSortFnWithActions)).toEqual(value.sort(customSortFnWithActions))
        }
    })
})

describe("it correctly calls checkmate and stalemate", () => {
    const boardConfigVanillaMateInOne = [
        [ChessPiecesName.blackKing, null, null, null, null, null, null,null],
        [null, null, null, null, null, null, null, ChessPiecesName.whiteQueen],
        [ChessPiecesName.whiteKing, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null]
    ]

    const boardConfigMateDueToForcedEnPassant = [
        [null, null, null, ChessPiecesName.blackKing, null, null, null,null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, ChessPiecesName.blackPawn, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, ChessPiecesName.whitePawn, null, null, null],
        [null, null, null, ChessPiecesName.whiteRook, null, null, null, ChessPiecesName.whiteKing]
    ]

    const boardConfigStalemateChecker = [
        [ChessPiecesName.blackKing, null, null, null, null, null, null,null],
        [null, null, null, null, null, null, null, ChessPiecesName.whiteQueen],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, ChessPiecesName.whiteKing]
    ]
    
    const smotheredMateInOneChecker = [
        [ChessPiecesName.blackKing, ChessPiecesName.blackRook, null, null, null, null, null,null],
        [ChessPiecesName.blackQueen, ChessPiecesName.blackPawn, null, null, null, null, null, ChessPiecesName.whiteQueen],
        [null, null, null, null, null, null, null, null],
        [null, ChessPiecesName.whiteKnight, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, ChessPiecesName.whiteKing]
    ]

    const chessifyVanillaMateInOne = new ChessLogic(boardConfigVanillaMateInOne)
    const chessifyMateDueToPassant = new ChessLogic(boardConfigMateDueToForcedEnPassant)

    const chessifyStalemateInOne = new ChessLogic(boardConfigStalemateChecker)
    const chessifySmotheredMate = new ChessLogic(smotheredMateInOneChecker)

    it ("correctly calls checkmate in mate in 1 position", () => {
        let spy = vi.spyOn(chessifyVanillaMateInOne, 'checkmateHandler')
        expect(spy).toHaveBeenCalledTimes(0)
        chessifyVanillaMateInOne.moveWithAction({row:1, column: 7}, {coord: {row: 1, column: 1}}, true)
        chessifyVanillaMateInOne.turnToPlay = PlayerColor.black
        chessifyVanillaMateInOne.postMoveComputation()
        expect(spy).toHaveBeenCalledTimes(1)
    })

    it ("correctly calls mate due to forced passant" , () => {
        let spy = vi.spyOn(chessifyMateDueToPassant, 'checkmateHandler')
        expect(spy).toHaveBeenCalledTimes(0)
        chessifyMateDueToPassant.playerMadeMove({row:6, column: 4}, {row: 4, column: 4})
        // chessifyMateDueToPassant.turnToPlay = PlayerColor.black
        // chessifyMateDueToPassant.postMoveComputation()
        expect(spy).toHaveBeenCalledTimes(1)
    })

    it ("correctly calls checkmate handler for smothered mate", () => {
        let spy = vi.spyOn(chessifySmotheredMate, 'checkmateHandler')
        expect(spy).toHaveBeenCalledTimes(0)
        chessifySmotheredMate.moveWithAction({row: 3, column: 1}, {coord: {row: 1, column: 2}}, true)
        chessifySmotheredMate.turnToPlay = PlayerColor.black
        chessifySmotheredMate.postMoveComputation()
        expect(spy).toHaveBeenCalledTimes(1)
    })

    it ("correctly calls stalemate handler", () => {
        let spy = vi.spyOn(chessifyStalemateInOne, 'stalemateHandler')
        expect(spy).toHaveBeenCalledTimes(0)
        chessifyStalemateInOne.moveWithAction({row: 1, column: 7}, {coord: {row: 1, column: 2}}, true)
        chessifyStalemateInOne.turnToPlay = PlayerColor.black
        chessifyStalemateInOne.postMoveComputation()
        expect(spy).toHaveBeenCalledTimes(1)
    })

}) 

describe ("test if postMoveComputation is correctly called during the initial constructor call" , () => {
    const smotheredMateChecker = [
        [ChessPiecesName.whiteKing, ChessPiecesName.whiteRook, null, null, null, null, null,null],
        [ChessPiecesName.whiteQueen, ChessPiecesName.whitePawn,  ChessPiecesName.blackKnight, null, null, null, null, ChessPiecesName.blackQueen],
        [null, null, null, null, null, null, null, null],
        [null,null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, ChessPiecesName.blackKing]
    ]
    const chessifySmotheredMate = new ChessLogic(smotheredMateChecker)
    expect(chessifySmotheredMate.mate).toEqual(true)
})  