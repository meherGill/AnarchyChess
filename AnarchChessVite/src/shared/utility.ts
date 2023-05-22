import { IChessPiece, IGeneratedMoves } from "./types";

export const makeDeepCopyOfPiece = (piece: IChessPiece | null) : IChessPiece | null=> {
    if (piece){
        const copy = {...piece}
        if (piece.lastPosition){
            copy.lastPosition!.row = piece.lastPosition!.row
            copy.lastPosition!.column = piece.lastPosition!.column
        }
        else{
            copy.lastPosition = null
        }
        return copy
    }
    else{
        return null
    }
}

import { ISquareCoordinate } from "./types";

export const areCoordsEqual = (coord1: ISquareCoordinate, coord2: ISquareCoordinate) => {
    return ((coord1.row === coord2.row) && (coord1.column === coord2.column))
}

class CoordMapper<K,V> extends Map {

    constructor(){
        super()
    }
    set = (k: ISquareCoordinate, v: Array<IGeneratedMoves>) => {
        const stringifiedKey = JSON.stringify(k)
        return super.set(stringifiedKey,v)
    }

    get = (k: ISquareCoordinate) => {
        const stringifiedKey = JSON.stringify(k)
        return super.get(stringifiedKey)
    }

    * keys() : any { //find a better way, returning any because thats the only way to fix the linting error
        const parentKeyIterator = super.keys();
        for (const key of parentKeyIterator){
            yield JSON.parse(key)
         }
    }

    * entries(): any {
    const parentEntriesIterator = super.entries();
    for (const [key, value] of parentEntriesIterator){
         yield [JSON.parse(key), value]
    }
  }
}
export {CoordMapper}