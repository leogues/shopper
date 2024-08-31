import { describe, expect, test } from 'vitest'
import { decodeBase64File } from '../base64ToBuffer'

describe('decodeBase64File', () => {
  test('should decode base64 file', () => {
    const input =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAALCAYAAAB8MH3LAAAAOElEQVR42mP8z8AARgAq+0'

    const output = decodeBase64File(input)

    expect(output.mimeType).toBe('image/png')
    expect(output.data).toBeInstanceOf(Buffer)
  })

  test('should error for an empty base64 image data', () => {
    const input = 'data:image/png;base64,'

    expect(() => decodeBase64File(input)).toThrow('Invalid Base64 file format')
  })

  test('should throw error for a base64 string without data URI prefix', () => {
    const input =
      'iVBORw0KGgoAAAANSUhEUgAAABQAAAALCAYAAAB8MH3LAAAAOElEQVR42mP8z8AARgAq+0'

    expect(() => decodeBase64File(input)).toThrow('Invalid Base64 file format')
  })
})
