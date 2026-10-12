import { store } from '../data/store'
import type { StockMovement } from '../data/types'
import { generateId } from '../utils/generateId'

type StockMovementInput = Omit<StockMovement, 'id'>

export function recordStockMovement(input: StockMovementInput): StockMovement {
  const movement = { ...input, id: generateId('movement') }
  store.stockMovements.unshift(movement)
  return movement
}