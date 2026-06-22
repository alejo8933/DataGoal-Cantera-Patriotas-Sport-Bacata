/**
 * Generador y validador de Matriz de Seguridad 5x5
 */
export type Matrix = number[][]

const ROWS = 5
const COLS = 5
const COL_LETTERS = ['A', 'B', 'C', 'D', 'E']

export function generateSecurityMatrix(seed?: number): Matrix {
  const rand = seed != null ? mulberry32(seed) : Math.random
  const matrix: Matrix = []
  for (let r = 0; r < ROWS; r++) {
    const row: number[] = []
    for (let c = 0; c < COLS; c++) {
      // números entre 0 y 9
      row.push(Math.floor(rand() * 10))
    }
    matrix.push(row)
  }
  return matrix
}

export function parsePosition(pos: string) {
  // acepta formatos como A1, B3, C2 (letra+numero)
  if (!pos || typeof pos !== 'string') return null
  const letter = pos[0].toUpperCase()
  const num = Number(pos.slice(1))
  const col = COL_LETTERS.indexOf(letter)
  const row = Number.isFinite(num) ? num - 1 : -1
  if (col < 0 || row < 0 || row >= ROWS) return null
  return { row, col }
}

export function validateMatrixPositions(matrix: Matrix, positions: string[], values: (number | string)[]) {
  if (!Array.isArray(positions) || !Array.isArray(values) || positions.length !== values.length) return false
  for (let i = 0; i < positions.length; i++) {
    const p = parsePosition(positions[i])
    if (!p) return false
    const expected = matrix[p.row][p.col]
    const provided = Number(values[i])
    if (Number.isNaN(provided) || expected !== provided) return false
  }
  return true
}

// small seeded RNG for deterministic matrices when needed
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function formatMatrixForDisplay(matrix: Matrix) {
  // returns array of strings like ['A1:3','A2:7',...]
  const out: string[] = []
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      out.push(`${COL_LETTERS[c]}${r + 1}:${matrix[r][c]}`)
    }
  }
  return out
}
