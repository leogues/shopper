export const extractNumbers = (text: string): number[] => {
  const numberPattern = /\d+(\.\d+)?/g

  const matches = text.match(numberPattern)

  return matches ? matches.map(Number) : []
}
