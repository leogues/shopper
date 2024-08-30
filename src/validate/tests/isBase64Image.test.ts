import { describe, expect, it } from 'vitest'
import { isBase64Image } from '../isBase64Image'

describe('isBase64Image', () => {
  it('should return true for a valid base64 image string', () => {
    const input =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAALCAYAAAB8MH3LAAAAOElEQVR42mP8z8AARgAq+0'
    expect(isBase64Image(input)).toBe(true)
  })

  it('should return false for an invalid base64 image string', () => {
    const input = 'data:image/png;base64,invalidBase64String'
    expect(isBase64Image(input)).toBe(false)
  })

  it('should return false for a non-string value', () => {
    const input = 123
    expect(isBase64Image(input)).toBe(false)
  })

  it('should return false for a base64 string without data URI prefix', () => {
    const input =
      'iVBORw0KGgoAAAANSUhEUgAAABQAAAALCAYAAAB8MH3LAAAAOElEQVR42mP8z8AARgAq+0'
    expect(isBase64Image(input)).toBe(false)
  })
})
