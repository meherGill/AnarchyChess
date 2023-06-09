import { IChessPiece, IGeneratedMoves, IMoveHistory, ISquareCoordinate, IilVaticanoReturnType } from "@shared/types";
import { checkIfCoordInBound, checkIfSquareIsEmpty, getChessPieceNameFor, returnColorOfPiece, returnOpponentColor, _getPieceOnCoord } from "./ChessLogic";
import { ChessPiecesName, MoveAction, PlayerColor, TypeOfChessPiece } from "@enums";
import { checkIfGivenKingIsInCheck, checkIfGivenPositionIsInCheck } from "./checkForCheck";

export const checkIfPieceAtCoord = (pieceName: ChessPiecesName, coord: ISquareCoordinate, currentBoard: Array<Array<IChessPiece | null>>) : boolean => {
    if (!checkIfCoordInBound(coord)){
        return false
    }
    const piece = _getPieceOnCoord(coord,currentBoard)
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
        const piece = _getPieceOnCoord(coord, currentBoard)
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

export const pawnLikeMoves = ({ coord, currentBoard, lastMovePlayedArr }: { coord: ISquareCoordinate; currentBoard: Array<Array<IChessPiece | null>>; lastMovePlayedArr: Array<IMoveHistory>}) : Array<IGeneratedMoves> => {
    const piece = _getPieceOnCoord(coord, currentBoard)?.name
    let opponentPieceColor : PlayerColor; 
    let playerColor: PlayerColor;
    let returnCoordinatesArray: Array<IGeneratedMoves> = []
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
            returnCoordinatesArray.push({coord: newCoordOneStepForward});

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
                returnCoordinatesArray.push({coord: newCoordTwoStepForward});
            }
        }

        //START OF CODE
        // check if pawn can take enemy piece diagnally
        const newCoordDiagLeft = { ...coord };
        const newCoordDiagRight = { ...coord };

        opponentPieceColor = returnOpponentColor(piece)
        //populate newCoordDiagLeft and newCoordDiagRight
        if (typeOfPiece === PlayerColor.black) {
            newCoordDiagLeft.row = coord.row + 1;
            newCoordDiagLeft.column = coord.column - 1;
            newCoordDiagRight.row = coord.row + 1;
            newCoordDiagRight.column = coord.column + 1;
           

        } else if (typeOfPiece === PlayerColor.white) {
            newCoordDiagLeft.row = coord.row - 1;
            newCoordDiagLeft.column = coord.column - 1;
            newCoordDiagRight.row = coord.row - 1;
            newCoordDiagRight.column = coord.column + 1;
        

        } else {
            throw new Error("this shouldnt happen");
        }

        //iterate through the two diagnol columns to see if an opponent piece is present there
        [newCoordDiagLeft, newCoordDiagRight].forEach(
            (diagCooord) => {
                if (checkIfCoordInBound(diagCooord)) {
                    const piece =
                        _getPieceOnCoord(diagCooord, currentBoard);
                    if (piece) {
                        const pieceColor = returnColorOfPiece(
                            piece.name
                        );
                        if (pieceColor === opponentPieceColor) {
                            returnCoordinatesArray.push({coord: diagCooord});
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

            const lastMovePlayed = lastMovePlayedArr?.at(-1)
            if (opponentPieceColor === PlayerColor.black) {
                if (
                    lastMovePlayed?.from.row === 1 &&
                    lastMovePlayed?.to.row === 3 &&
                    lastMovePlayed.piece ===
                        ChessPiecesName.blackPawn
                ) {
                    if (
                        Math.abs(
                            coord.column -
                                lastMovePlayed.to.column
                        ) === 1
                    ) {
                        returnCoordinatesArray = [{
                            coord: {
                                row: lastMovePlayed.to.row - 1,
                                column: lastMovePlayed.to
                                    .column,
                            },
                            action: MoveAction.enPassant
                        }
                        ];
                    }
                }
            } else if (opponentPieceColor === PlayerColor.white) {
                if (
                    lastMovePlayed?.from.row === 6 &&
                    lastMovePlayed?.to.row === 4 &&
                    lastMovePlayed.piece ===
                        ChessPiecesName.whitePawn
                ) {
                    if (
                        Math.abs(
                            coord.column -
                                lastMovePlayed.to.column
                        ) === 1
                    ) {
                        returnCoordinatesArray = [{
                            coord:{
                                row: lastMovePlayed.to.row + 1,
                                column: lastMovePlayed.to
                                    .column,
                            },
                            action: MoveAction.enPassant
                        }
                        ];
                    }
                }
            }
        }

        //check for promotion
        let rowToCheckFor : number;
        if (playerColor === PlayerColor.white){
            rowToCheckFor = 0
        }
        else{
            rowToCheckFor = 7
        }

        returnCoordinatesArray = returnCoordinatesArray.flatMap((generatedMove) => {
            if (generatedMove.coord.row === rowToCheckFor){
                let knightMovesAtThatCoordForKnightBoost = knightLikeMoves(generatedMove.coord,currentBoard,playerColor).map(move => {
                    return {...move, action: MoveAction.knightBoost}
                })
                return [...knightMovesAtThatCoordForKnightBoost, {...generatedMove, action: MoveAction.pawnPromotionBishop}, 
                    {...generatedMove, action: MoveAction.pawnPromotionKnook}, 
                    {...generatedMove, action: MoveAction.pawnPromotionQueen}, 
                    {...generatedMove, action: MoveAction.pawnPromotionRook}]
            }
            else{
                return generatedMove
            }
        })
    }
    return returnCoordinatesArray    
}

export const kingLikeMoves = (coord: ISquareCoordinate, currentBoard: Array<Array<IChessPiece | null>>) : Array<IGeneratedMoves> => {
    const tempMovesArr = [1,-1, 0]
    const piece = _getPieceOnCoord(coord, currentBoard)?.name
    let returnCoordinatesArray : Array<IGeneratedMoves> = []
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
                            returnColorOfPiece(_getPieceOnCoord(newCoords, currentBoard)!.name) === opponentPieceColor
                        )
                    ){
                        returnCoordinatesArray.push({coord: newCoords})
                    }
                }
            }
        }
    }
    return returnCoordinatesArray
}

const commonFunctionalityForRookAndBishop = (coords: ISquareCoordinate, currentBoard: Array<Array<IChessPiece| null>>,functionArray: Array<Function>) : Array<IGeneratedMoves>=> {
    const returnArray : Array<IGeneratedMoves> = []
    const playerColor = returnColorOfPiece(_getPieceOnCoord(coords, currentBoard)!.name)
    for (let func of functionArray){
        let newCoords: ISquareCoordinate = {...coords}
        while (true){
            newCoords = func(newCoords)
            const isValidMoveAndCapture = checkIfValidCoordAndCaptureForPieceColor(playerColor,newCoords,currentBoard)
            if (isValidMoveAndCapture.isValid){
                returnArray.push({coord: {...newCoords}})
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

export const vanillaBishopLikeMoves = (coords: ISquareCoordinate, currentBoard: Array<Array<IChessPiece | null>>) : Array<IGeneratedMoves>=> {
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

export const rookLikeMoves = (coords: ISquareCoordinate, currentBoard: Array<Array<IChessPiece | null>>) : Array<IGeneratedMoves>=> {

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

export const knightLikeMoves = (coords: ISquareCoordinate, currentBoard: Array<Array<IChessPiece | null>>, playerColor?: PlayerColor) : Array<IGeneratedMoves>=> {
    if (!playerColor){
        playerColor = returnColorOfPiece(_getPieceOnCoord(coords, currentBoard)!.name)
    }
    const returnMovesArray : Array<IGeneratedMoves>= []
    // const playerColor = returnColorOfPiece(_getPieceOnCoord(coords, currentBoard)!.name)

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
        returnMovesArray.push({coord: move})
      }
    }
    return returnMovesArray
}

export const generateIlVaticano =  (bishopLikeCoord : ISquareCoordinate, currentBoard: Array<Array<IChessPiece | null>>) : IilVaticanoReturnType => {
    const piece = _getPieceOnCoord(bishopLikeCoord, currentBoard)
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
                const piece = _getPieceOnCoord(supposedBishopCoord, currentBoard)
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
                    const pieceOnTempCoord = _getPieceOnCoord(tempCoord, currentBoard)

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
                        secondBishopLikeCoords: [...returnIlVaticanoCheck.secondBishopLikeCoords, {coord: supposedBishopCoord, action: MoveAction.ilVaticano}],
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

export const returnCastlingCoord = (givenKingPosition: ISquareCoordinate, currentBoard: Array<Array<IChessPiece | null>>) : Array<IGeneratedMoves> => {
    const castlingCoordArray : Array<IGeneratedMoves> = []
    const kingPiece = _getPieceOnCoord(givenKingPosition, currentBoard)
    if (!kingPiece){
        throw new Error("this shouldn't happen, givenKingPosition should point to the king");    
    }

    //check if kingPiece has moved at all
    if (kingPiece.lastPosition){
        return castlingCoordArray
    }

    // check if king is currently in check
    const checkResults = checkIfGivenKingIsInCheck(givenKingPosition, currentBoard)
    if (checkResults.inCheck){
        return castlingCoordArray
    }

    // const kingColor = returnColorOfPiece(kingPiece.name)
    // let castlingCoords = []
    // To Check:
    // - if king is moving through a check
    // - if there is a rook present in the first or the last column of its respective rank
    // - if there are no pieces present between the rook and the king
    // - if the rook hasnt moved yet either

    const rookRow: number = givenKingPosition.row
    const kingColor = returnColorOfPiece(kingPiece.name)

    const coordOfShortSideCastlingRook = {row: rookRow, column: 0}
    const coordOfLongSideCastlingRook = {row: rookRow, column: 7}
    
    for (let coordOfCastlingRook of [coordOfShortSideCastlingRook, coordOfLongSideCastlingRook]){
        let addThisCoord = false //if this coord will be appened to the array that is returned or not
        
        const castlingPiece = _getPieceOnCoord(coordOfCastlingRook, currentBoard)
    
        if (!castlingPiece) continue //if there is no piece there
        if (castlingPiece.name !== getChessPieceNameFor(TypeOfChessPiece.Rook, kingColor)) continue //if the piece is not a rook
        if (castlingPiece.lastPosition) continue //if the piece has moved
        
        let coordOfPieceOnLeft: ISquareCoordinate
        let coordOfPieceOnRight: ISquareCoordinate
        let coordToReturn: ISquareCoordinate;

        if (coordOfCastlingRook.column < givenKingPosition.column){
            coordOfPieceOnLeft = {...coordOfCastlingRook}
            coordOfPieceOnRight = {...givenKingPosition}
            coordToReturn = {...givenKingPosition, column: givenKingPosition.column - 2}
        }
        else{
            coordOfPieceOnLeft = {...givenKingPosition}
            coordOfPieceOnRight = {...coordOfCastlingRook}
            coordToReturn = {...givenKingPosition, column: givenKingPosition.column + 2}
        }

        for (let columnVal = coordOfPieceOnLeft.column+1; columnVal < coordOfPieceOnRight.column; columnVal++){
            const coordBetweenKingAndRook : ISquareCoordinate = {...givenKingPosition, column: columnVal}
            const pieceBetweenKingAndRook = _getPieceOnCoord(coordBetweenKingAndRook, currentBoard)
            if (pieceBetweenKingAndRook){ 
                // this means that its a non null value, hence there is piece present
                addThisCoord = false
                break
            }

            //only for the two squares next to king, see if it will move through a check
            if (Math.abs(columnVal - givenKingPosition.column) <= 2){
                const checkVal = checkIfGivenPositionIsInCheck(coordBetweenKingAndRook, kingColor, currentBoard)
                if (checkVal.inCheck) {
                    addThisCoord = false
                    break
                }
            }
            addThisCoord = true
        }
        if (addThisCoord){
            castlingCoordArray.push({coord: coordToReturn, action: MoveAction.horizontalCastling})
        }
    }
  

    return castlingCoordArray

}