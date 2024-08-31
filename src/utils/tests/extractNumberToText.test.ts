import { describe, expect, test } from 'vitest'
import { extractNumbers } from '../extractNumberToText'

describe('extractNumbers', () => {
  test('should extract numbers text with space', () => {
    const input = '111111 '

    const output = extractNumbers(input)

    expect(output).toEqual([111111])
  })

  test('should extract numbers text with "\\n"', () => {
    const input = '22222 \\n'

    const output = extractNumbers(input)

    expect(output).toEqual([22222])
  })

  test('should extract numbers text', () => {
    const input = 'foo 33333 \\t'

    const output = extractNumbers(input)

    expect(output).toEqual([33333])
  })

  test('should return an empty array if no numbers are found', () => {
    const input = 'no numbers'

    const output = extractNumbers(input)

    expect(output).toEqual([])
  })
})
