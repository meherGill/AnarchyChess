import { IChessPiece, ISquareCoordinate, IilVaticanoReturnType } from "@shared/types";
import { checkIfCoordInBound, returnColorOfPiece, returnPieceOnCoord, returnTypeAndColorOfPiece } from "./ChessLogic";
import { ChessPiecesName, PlayerColor } from "@enums";

const checkIfValidCoordAndCaptureForPieceColor = (playerColor: PlayerColor, coord: ISquareCoordinate, currentBoard:Array<Array<IChessPiece| null>>) : {isValid: boolean, capture: boolean} => {
    if (checkIfCoordInBound(coord)){
        const piece = returnPieceOnCoord(coord, currentBoard)
        if (piece){
            const colorOfPieceOnCoord = returnColorOfPiece(piece.name)
            if (colorOfPieceOnCoord === playerColor){
                return {isValid: false, capture: false}
            }
            else{
                return {isValid: true, capture: true}
            }
        }
        else{
            return {isValid: true, capture: false}
        }
    }
    return {isValid: false, capture: false}
}

const pawnLikeMoves = (coords: ISquareCoordinate, currentBoard: Array<Array<ISquareCoordinate | null>>) => {

}
const commonFunctionalityForRookAndBishop = (coords: ISquareCoordinate, currentBoard: Array<Array<IChessPiece| null>>,functionArray: Array<Function>) : Array<ISquareCoordinate>=> {
    const returnArray : Array<ISquareCoordinate> = []
    const playerColor = returnColorOfPiece(returnPieceOnCoord(coords, currentBoard)!.name)
    for (let func of functionArray){
        let newCoords: ISquareCoordinate = {...coords}
        while (true){
            newCoords = func(newCoords)
            const isValidMoveAndCapture = checkIfValidCoordAndCaptureForPieceColor(playerColor,newCoords,currentBoard)
            if (isValidMoveAndCapture.isValid){
                returnArray.push({...newCoords})
                if (isValidMoveAndCapture.capture){
                    break;
                }
         
            }
            else{
                break
            }
        }
    }
    return returnArray
}

export const vanillaBishopLikeMoves = (coords: ISquareCoordinate, currentBoard: Array<Array<IChessPiece | null>>) => {
    const diagUpperLeft = (coord: ISquareCoordinate) : ISquareCoordinate => {
        return {row: coord.row-1, column: coord.column-1}
    }

    const diagLowerLeft = (coord: ISquareCoordinate) : ISquareCoordinate => {
        return {row: coord.row+1, column: coord.column-1}
    }

    const diagUpperRight = (coord: ISquareCoordinate) : ISquareCoordinate => {
        return {row: coord.row-1, column: coord.column+1}
    }

    const diagLowerRight = (coord: ISquareCoordinate) : ISquareCoordinate => {
        return {row: coord.row+1, column: coord.column+1}
    }
    const diagFunctionArray = [diagUpperLeft, diagLowerLeft, diagUpperRight, diagLowerRight]
    return commonFunctionalityForRookAndBishop(coords, currentBoard, diagFunctionArray)
}

export const rookLikeMoves = (coords: ISquareCoordinate, currentBoard: Array<Array<IChessPiece | null>>) => {

    const up = (coord: ISquareCoordinate) : ISquareCoordinate => {
        return {...coord, row: coord.row-1}
    }

    const down = (coord: ISquareCoordinate) : ISquareCoordinate => {
        return {...coord, row: coord.row+1}
    }

    const left = (coord: ISquareCoordinate) : ISquareCoordinate => {
        return {...coord, column: coord.column-1}
    }

    const right = (coord: ISquareCoordinate) : ISquareCoordinate => {
        return {...coord, column: coord.column+1}
    }
    const straightFunctionArr = [up, down, left, right]
    return commonFunctionalityForRookAndBishop(coords, currentBoard, straightFunctionArr)
}

export const knightLikeMoves = (coords: ISquareCoordinate, currentBoard: Array<Array<IChessPiece | null>>) : Array<ISquareCoordinate>=> {
    const returnMovesArray : Array<ISquareCoordinate>= []
    const playerColor = returnColorOfPiece(returnPieceOnCoord(coords, currentBoard)!.name)

    const twoUpOneRight = {row: coords.row-2, column: coords.column+1}
    const twoUpOneLeft = {row: coords.row-2, column: coords.column-1}
    const twoDownOneRight = {row: coords.row+2, column: coords.column+1}
    const twoDownOneLeft = {row: coords.row+2, column: coords.column-1}
    const twoRightOneUp = {row: coords.row-1, column: coords.column+2}
    const twoRightOneDown = {row: coords.row+1, column: coords.column+2}
    const twoLeftOneUp = {row: coords.row-1, column: coords.column-2}
    const twoLeftOneDown = {row: coords.row+1, column: coords.column-2}

    const movesArray = [twoUpOneRight, twoUpOneLeft, twoDownOneLeft, twoDownOneRight, twoLeftOneDown, twoLeftOneUp, twoRightOneDown, twoRightOneUp]
    for (const move of movesArray){
      const isValidAndCapture = checkIfValidCoordAndCaptureForPieceColor(playerColor, move,currentBoard)
      if (isValidAndCapture.isValid){
        returnMovesArray.push(move)
      }
    }
    return returnMovesArray
}

export const generateIlVaticano =  (bishopLikeCoord : ISquareCoordinate, currentBoard: Array<Array<IChessPiece | null>>) : IilVaticanoReturnType => {
    const piece = returnPieceOnCoord(bishopLikeCoord, currentBoard)
    let returnIlVaticanoCheck : IilVaticanoReturnType = {ilVaticanoPossible: false, secondBishopLikeCoords: []}
    if (piece){
        const playerColor : PlayerColor = returnColorOfPiece(piece.name)
        let pawnToCheckFor: ChessPiecesName;
        let friendlyBishop: ChessPiecesName;

        if (playerColor === PlayerColor.black){
            pawnToCheckFor = ChessPiecesName.whitePawn
            friendlyBishop = ChessPiecesName.blackBishop
        }
        else{
            pawnToCheckFor = ChessPiecesName.blackPawn
            friendlyBishop = ChessPiecesName.whiteBishop
        }

        const leftSupposedBishopLikeCoord : ISquareCoordinate = {...bishopLikeCoord, column: bishopLikeCoord.column - 3}
        const rightSupposedBishopLikeCoord : ISquareCoordinate = {...bishopLikeCoord, column: bishopLikeCoord.column + 3}

       

        for (const supposedBishopCoord of [leftSupposedBishopLikeCoord, rightSupposedBishopLikeCoord]){
            let flag1 = false
            let flag2 = false
            if (checkIfCoordInBound(supposedBishopCoord)){
                const piece = returnPieceOnCoord(supposedBishopCoord, currentBoard)
                if (piece?.name === friendlyBishop){
                    flag1 = true
                }
                let firstBishopLikeFromLeft: ISquareCoordinate;
                let secondBishopLikeFromLeft: ISquareCoordinate;
                if (supposedBishopCoord.column < bishopLikeCoord.column){
                    firstBishopLikeFromLeft = supposedBishopCoord
                    secondBishopLikeFromLeft = bishopLikeCoord
                }
                else{
                    firstBishopLikeFromLeft = bishopLikeCoord
                    secondBishopLikeFromLeft = supposedBishopCoord
                }

                for (let columnOnly = firstBishopLikeFromLeft.column+1; columnOnly < secondBishopLikeFromLeft.column; columnOnly++ ){
                    const tempCoord: ISquareCoordinate = {...firstBishopLikeFromLeft, column: columnOnly}
                    const pieceOnTempCoord = returnPieceOnCoord(tempCoord, currentBoard)

                    if (pieceOnTempCoord){
                        if (pieceOnTempCoord.name === pawnToCheckFor){
                            flag2 = true
                        }
                    }
                    else{
                        flag2 = false
                        break
                    }
                }
                if (flag1 && flag2){
                    returnIlVaticanoCheck = {
                        ilVaticanoPossible: true,
                        secondBishopLikeCoords: [...returnIlVaticanoCheck.secondBishopLikeCoords, supposedBishopCoord],
                    }
                }
            }
        }
        return returnIlVaticanoCheck
    }
    else{

        return returnIlVaticanoCheck
    }
}