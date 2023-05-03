import { IChessPiece, ISquareCoordinate, IilVaticanoReturnType } from "@shared/types";
import { checkIfCoordInBound, getChessPieceNameFor, returnColorOfPiece, returnOpponentColor, returnPieceOnCoord, returnTypeAndColorOfPiece } from "./ChessLogic";
import { ChessPiecesName, PlayerColor, TypeOfChessPiece } from "@enums";
import { checkIfPieceAtCoord, kingLikeMoves, knightLikeMoves, pawnLikeMoves, rookLikeMoves, vanillaBishopLikeMoves } from "./moveGeneratingFunctions";

const rookMovesForCheck = rookLikeMoves;
const bishopMovesForCheck = vanillaBishopLikeMoves;
const knightMovesForCheck = knightLikeMoves;
const kingMovesForCheck = kingLikeMoves;
//knook and queen are already handled by combination of rook , bishop and knight hence no need to add that
export const checkIfGivenKingIsInCheck = (givenKingPosition: ISquareCoordinate, currentBoard: Array<Array<IChessPiece | null>>) : {inCheck: boolean, threatAt: ISquareCoordinate | null}=> {
    const kingPiece = returnPieceOnCoord(givenKingPosition, currentBoard)

    if (kingPiece){
        const returnValue = {
            inCheck: false,
            threatAt: null as ISquareCoordinate | null
        }
        
        const kingColor = returnColorOfPiece(kingPiece.name)
        const opponentColor = returnOpponentColor(kingPiece.name)

        const possibleRookMovesAtKingsCoord = rookMovesForCheck(givenKingPosition, currentBoard)
        const possibleBishopMovesAtKingsCoord = bishopMovesForCheck(givenKingPosition, currentBoard)
        const possibleKnightMovesAtKingsCoord = knightMovesForCheck(givenKingPosition, currentBoard)
        const possibleKingMovesAtKingsCoord = kingMovesForCheck(givenKingPosition, currentBoard)


        //check for rook, knook and queen
        let threatPresent: boolean = false
        for (const coord of possibleRookMovesAtKingsCoord){
            
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
        for (const coord of possibleKnightMovesAtKingsCoord){
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
        for (const coord of possibleBishopMovesAtKingsCoord){
            
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
        for (const coord of possibleKingMovesAtKingsCoord){
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
        const coord1: ISquareCoordinate = {...givenKingPosition};
        const coord2: ISquareCoordinate = {...givenKingPosition};
        coord1.column = coord1.column - 1
        coord2.column = coord2.column + 1
        let possiblePawnToLookOutForCoords: Array<ISquareCoordinate> = []
        if (kingColor === PlayerColor.white){    
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
    else{
        return {
            inCheck: false,
            threatAt: null
        }
    }
}