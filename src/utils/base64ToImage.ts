type Base64Image = {
  mimeType: string
  data: Buffer
}

export const base64ToImage = (value: string): Base64Image => {
  const [mimeTypePart, base64Data] = value.split(';base64,')
  if (!mimeTypePart || !base64Data) {
    throw new Error('Invalid Base64 image format')
  }

  const mimeType = mimeTypePart.replace('data:', '')
  const data = Buffer.from(base64Data, 'base64')

  return { mimeType, data }
}
