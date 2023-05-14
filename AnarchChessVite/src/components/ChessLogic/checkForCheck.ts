import { IChessPiece, ISquareCoordinate } from "@shared/types";
import { checkIfCoordInBound, getChessPieceNameFor, returnColorOfPiece, _getPieceOnCoord, _setPieceOnCoord } from "./ChessLogic";
import { PlayerColor, TypeOfChessPiece } from "@enums";
import { checkIfPieceAtCoord, kingLikeMoves, knightLikeMoves, rookLikeMoves, vanillaBishopLikeMoves } from "./moveGeneratingFunctions";

export const checkIfGivenPositionIsInCheck = (givenPosition: ISquareCoordinate, friendlyColor: PlayerColor, currentBoard: Array<Array<IChessPiece| null>>) : {inCheck: boolean, threatAt: ISquareCoordinate | null} => {
        
        let checkToSwapValues = false
        const valueAtGivenPosition = _getPieceOnCoord(givenPosition, currentBoard)

        // if we are checking a 'check' on an EMPTY SQUARE, then we give it a fake piece, a pawn of that color
        // and we check how many pieces are threatening it
        // After the function is finished we replace the pawn with the piece that was supposed to be there 
        // and that is whatever value is denoting an empty piece 
        if (!valueAtGivenPosition){
            checkToSwapValues = true
            const temoraryPieceToSet = getChessPieceNameFor(TypeOfChessPiece.Pawn, friendlyColor)
            _setPieceOnCoord(givenPosition, {name: temoraryPieceToSet, lastPosition: null}, currentBoard) 
        }

        const auxillaryFunction = () => {
            const returnValue = {
                inCheck: false,
                threatAt: null as ISquareCoordinate | null
            }
            
            let opponentColor: PlayerColor
            if (friendlyColor === PlayerColor.white){
                opponentColor = PlayerColor.black
            }
            else{
                opponentColor = PlayerColor.white
            }

            const possibleRookMovesAtKingsCoord = rookLikeMoves(givenPosition, currentBoard)
            const possibleBishopMovesAtKingsCoord = vanillaBishopLikeMoves(givenPosition, currentBoard)
            const possibleKnightMovesAtKingsCoord = knightLikeMoves(givenPosition, currentBoard)
            const possibleKingMovesAtKingsCoord = kingLikeMoves(givenPosition, currentBoard)


            //check for rook, knook and queen
            let threatPresent: boolean = false

            for (const generatedMove of possibleRookMovesAtKingsCoord){
                const coord = generatedMove.coord
                const rookPieceName = getChessPieceNameFor(TypeOfChessPiece.Rook, opponentColor)
                const knookPieceName = getChessPieceNameFor(TypeOfChessPiece.Knook, opponentColor)
                const queenPieceName = getChessPieceNameFor(TypeOfChessPiece.Queen, opponentColor)

                threatPresent = checkIfPieceAtCoord(rookPieceName, coord,currentBoard) || 
                                        checkIfPieceAtCoord(knookPieceName, coord, currentBoard) ||
                                        checkIfPieceAtCoord(queenPieceName, coord, currentBoard)
                if (threatPresent){
                    returnValue.inCheck = true
                    returnValue.threatAt = coord
                    break
                }
            }
            if (threatPresent) return returnValue

            //check for knook, and knight
            for (const generatedMove of possibleKnightMovesAtKingsCoord){
                const coord = generatedMove.coord
                const knightPieceName = getChessPieceNameFor(TypeOfChessPiece.Knight, opponentColor)
                const knookPieceName = getChessPieceNameFor(TypeOfChessPiece.Knook, opponentColor)

                threatPresent = checkIfPieceAtCoord(knightPieceName, coord,currentBoard) || 
                                    checkIfPieceAtCoord(knookPieceName, coord, currentBoard)

                if (threatPresent){
                    returnValue.inCheck = true
                    returnValue.threatAt = coord
                    break
                }
            }

            if (threatPresent) return returnValue

            //check for bishop, and queen
            for (const generatedMove of possibleBishopMovesAtKingsCoord){
                const coord = generatedMove.coord
                const bishopPieceName = getChessPieceNameFor(TypeOfChessPiece.Bishop, opponentColor)
                const queenPieceName = getChessPieceNameFor(TypeOfChessPiece.Queen, opponentColor)

                threatPresent = checkIfPieceAtCoord(bishopPieceName, coord,currentBoard) || 
                                    checkIfPieceAtCoord(queenPieceName, coord, currentBoard)

                if (threatPresent){
                    returnValue.inCheck = true
                    returnValue.threatAt = coord
                    break
                }
            }

            if (threatPresent) return returnValue

            //check for king
            for (const generatedMove of possibleKingMovesAtKingsCoord){
                const coord = generatedMove.coord
                const kingPieceName = getChessPieceNameFor(TypeOfChessPiece.King, opponentColor)
                threatPresent = checkIfPieceAtCoord(kingPieceName, coord, currentBoard)
                if (threatPresent){
                    returnValue.inCheck = true
                    returnValue.threatAt = coord
                    break
                }
            }
            if (threatPresent) return returnValue

            //check for pawn
            const coord1: ISquareCoordinate = {...givenPosition};
            const coord2: ISquareCoordinate = {...givenPosition};
            coord1.column = coord1.column - 1
            coord2.column = coord2.column + 1
            let possiblePawnToLookOutForCoords: Array<ISquareCoordinate> = []
            if (friendlyColor === PlayerColor.white){    
                coord1.row = coord1.row-1
                coord2.row = coord2.row-1
            }
            else{
                coord1.row = coord1.row+1
                coord2.row = coord2.row+1
            }

            if (checkIfCoordInBound(coord1)){
                possiblePawnToLookOutForCoords.push(coord1)
            }
            if (checkIfCoordInBound(coord2)){
                possiblePawnToLookOutForCoords.push(coord2)
            }

            for (let coord of possiblePawnToLookOutForCoords){
                const pawnPieceName = getChessPieceNameFor(TypeOfChessPiece.Pawn, opponentColor)
                threatPresent = checkIfPieceAtCoord(pawnPieceName,coord,currentBoard)
                if (threatPresent){
                    returnValue.inCheck = true
                    returnValue.threatAt = coord
                    break;
                }
            } 
            
            if (threatPresent) return returnValue

            return returnValue
        }

        const returnVal = auxillaryFunction()
        if (checkToSwapValues){
            // this means, we swapped values on the square and now we swap them back
            _setPieceOnCoord(givenPosition, valueAtGivenPosition, currentBoard)
        }

        return returnVal
}

export const checkIfGivenKingIsInCheck = (givenKingPosition: ISquareCoordinate, currentBoard: Array<Array<IChessPiece | null>>) : {inCheck: boolean, threatAt: ISquareCoordinate | null}=> {
    const kingPiece = _getPieceOnCoord(givenKingPosition, currentBoard)
    
    if (kingPiece){
        const friendlyColor = returnColorOfPiece(kingPiece.name)
        return checkIfGivenPositionIsInCheck(givenKingPosition, friendlyColor, currentBoard)
    }
    else{
        return {
            inCheck: false,
            threatAt: null
        }
    }
}