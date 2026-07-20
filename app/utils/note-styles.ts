import { tokens } from './tokens'

export const STICKY_COLORS = tokens.color.note

const ROTATIONS = ['-0.5', '0.3', '-0.3', '0.5', '-0.2', '0.2', '-0.1', '0.1']

export function getRotation(index: number): string {
  return ROTATIONS[index % ROTATIONS.length] || '0'
}
