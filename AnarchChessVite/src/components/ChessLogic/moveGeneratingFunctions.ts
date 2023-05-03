import { IChessPiece, IMoveHistory, ISquareCoordinate, IilVaticanoReturnType } from "@shared/types";
import { checkIfCoordInBound, checkIfSquareIsEmpty, returnColorOfPiece, returnOpponentColor, returnPieceOnCoord, returnTypeAndColorOfPiece } from "./ChessLogic";
import { ChessPiecesName, PlayerColor } from "@enums";

export const checkIfPieceAtCoord = (pieceName: ChessPiecesName, coord: ISquareCoordinate, currentBoard: Array<Array<IChessPiece | null>>) : boolean => {
    if (!checkIfCoordInBound(coord)){
        return false
    }
    const piece = returnPieceOnCoord(coord,currentBoard)
    if (!piece){
        return false
    }

    if (piece.name === pieceName){
        return true
    }
    else{
        return false
    }
}

export const checkIfValidCoordAndCaptureForPieceColor = (playerColor: PlayerColor, coord: ISquareCoordinate, currentBoard:Array<Array<IChessPiece| null>>) : {isValid: boolean, capture: boolean} => {
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

export const pawnLikeMoves = (coord: ISquareCoordinate, currentBoard: Array<Array<IChessPiece | null>>, lastBlackMovePlayedArr: Array<IMoveHistory>, lastWhiteMovePlayedArr: Array<IMoveHistory>) : Array<ISquareCoordinate> => {
    const piece = returnPieceOnCoord(coord, currentBoard)?.name
    let opponentPieceColor : PlayerColor; 
    let playerColor: PlayerColor;
    let returnCoordinatesArray: Array<ISquareCoordinate> = []
    if (piece){
        const newCoordOneStepForward: ISquareCoordinate = {
            ...coord,
        };
        const typeOfPiece = returnColorOfPiece(piece);

        if (typeOfPiece === PlayerColor.black) {
            newCoordOneStepForward.row = coord.row + 1;
            playerColor = PlayerColor.black
        } else {
            newCoordOneStepForward.row = coord.row - 1;
            playerColor = PlayerColor.white
        }

        //check if pawn can move one step forward
        //inside this if is the logic for the pawn moving two steps forward
        if (
            checkIfCoordInBound(newCoordOneStepForward) &&
            checkIfSquareIsEmpty(newCoordOneStepForward, currentBoard)
        ) {
            returnCoordinatesArray.push(newCoordOneStepForward);

            //check if pawn can move two steps:
            //writing it inside this if condition because pawn cant move two steps
            //if the square infront of it is not clear, therefore if the parent if fails, then
            //no need to check for two steps
            const newCoordTwoStepForward = { ...coord };
            if (
                typeOfPiece === PlayerColor.black &&
                coord.row === 1
            ) {
                newCoordTwoStepForward.row = coord.row + 2;
            } else if (
                typeOfPiece === PlayerColor.white &&
                coord.row === 6
            ) {
                newCoordTwoStepForward.row = coord.row - 2;
            }
            if (checkIfSquareIsEmpty(newCoordTwoStepForward, currentBoard)) {
                returnCoordinatesArray.push(newCoordTwoStepForward);
            }
        }

        //START OF CODE
        // check if pawn can take enemy piece diagnally
        const newCoordDiagLeft = { ...coord };
        const newCoordDiagRight = { ...coord };

        opponentPieceColor = returnOpponentColor(piece)
        //populate newCoordDiagLeft and newCoordDiagRight
        if (typeOfPiece === PlayerColor.black) {
            newCoordDiagLeft.row = newCoordDiagLeft.row + 1;
            newCoordDiagLeft.column = newCoordDiagLeft.column - 1;
            newCoordDiagRight.row = newCoordDiagLeft.column =
                newCoordDiagLeft.row + 1;
            newCoordDiagRight.column = newCoordDiagRight.column + 1;
           

        } else if (typeOfPiece === PlayerColor.white) {
            newCoordDiagLeft.row = newCoordDiagLeft.row - 1;
            newCoordDiagLeft.column = newCoordDiagLeft.column - 1;
            newCoordDiagRight.row = newCoordDiagRight.row - 1;
            newCoordDiagRight.column = newCoordDiagRight.column + 1;
        

        } else {
            throw new Error("this shouldnt happen");
        }

        //iterate through the two diagnol columns to see if an opponent piece is present there
        [newCoordDiagLeft, newCoordDiagRight].forEach(
            (diagCooord) => {
                if (checkIfCoordInBound(diagCooord)) {
                    const piece =
                        returnPieceOnCoord(diagCooord, currentBoard);
                    if (piece) {
                        const pieceColor = returnColorOfPiece(
                            piece.name
                        );
                        if (pieceColor === opponentPieceColor) {
                            returnCoordinatesArray.push(diagCooord);
                        }
                    }
                }
            }
        );

        // END IF PAWN CAN TAKE PIECE DIAGONALLY 
        

        //check if PAWN CAN EN PASSANTE
        let enPassantableCheck1 = false;
        if (returnColorOfPiece(piece) === PlayerColor.black) {
            if (coord.row === 4) {
                enPassantableCheck1 = true;
            }
        } else if (
            returnColorOfPiece(piece) === PlayerColor.white
        ) {
            if (coord.row === 3) {
                enPassantableCheck1 = true;
            }
        }
        if (enPassantableCheck1) {
            const lastWhiteMovePlayed =
                lastWhiteMovePlayedArr?.at(-1);
            const lastBlackMovePlayed =
                lastBlackMovePlayedArr?.at(-1);
            if (opponentPieceColor === PlayerColor.black) {
                if (
                    lastBlackMovePlayed?.from.row === 1 &&
                    lastBlackMovePlayed?.to.row === 3 &&
                    lastBlackMovePlayed.piece ===
                        ChessPiecesName.blackPawn
                ) {
                    if (
                        Math.abs(
                            coord.column -
                                lastBlackMovePlayed.to.column
                        ) === 1
                    ) {
                        returnCoordinatesArray = [
                            {
                                row: lastBlackMovePlayed.to.row - 1,
                                column: lastBlackMovePlayed.to
                                    .column,
                            },
                        ];
                    }
                }
            } else if (opponentPieceColor === PlayerColor.white) {
                if (
                    lastWhiteMovePlayed?.from.row === 6 &&
                    lastWhiteMovePlayed?.to.row === 4 &&
                    lastWhiteMovePlayed.piece ===
                        ChessPiecesName.whitePawn
                ) {
                    if (
                        Math.abs(
                            coord.column -
                                lastWhiteMovePlayed.to.column
                        ) === 1
                    ) {
                        returnCoordinatesArray = [
                            {
                                row: lastWhiteMovePlayed.to.row - 1,
                                column: lastWhiteMovePlayed.to
                                    .column,
                            },
                        ];
                    }
                }
            }
        }
    }
    return returnCoordinatesArray    
}

export const kingLikeMoves = (coord: ISquareCoordinate, currentBoard: Array<Array<IChessPiece | null>>) => {
    const tempMovesArr = [1,-1, 0]
    const piece = returnPieceOnCoord(coord, currentBoard)?.name
    let returnCoordinatesArray = []
    if (piece){
        const opponentPieceColor = returnOpponentColor(piece)
        for (let rowOffset of tempMovesArr){
            for (let columnOffset of tempMovesArr){
                if (rowOffset === 0 && columnOffset === 0) {
                    // no offset to either row or column means that this square is the one with the king on it
                    // so we skip it
                    continue
                }
                else{
                    const newCoords = {...coord}
                    newCoords.column += columnOffset
                    newCoords.row += rowOffset
    
                    //check for c2 square, c2 is row: 5, column 2
                    if (newCoords.column === 2 && newCoords.row === 5){
                        continue
                    }
                    if (checkIfCoordInBound(newCoords) && 
                        (
                            checkIfSquareIsEmpty(newCoords, currentBoard) ||
                            returnColorOfPiece(returnPieceOnCoord(newCoords, currentBoard)!.name) === opponentPieceColor
                        )
                    ){
                        returnCoordinatesArray.push(newCoords)
                    }
                }
            }
        }
    }
    return returnCoordinatesArray
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