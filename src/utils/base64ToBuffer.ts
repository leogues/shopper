type DecodedFile = {
  mimeType: string
  data: Buffer
}

export const decodeBase64File = (value: string): DecodedFile => {
  const [mimeTypePart, base64Data] = value.split(';base64,')
  if (!mimeTypePart || !base64Data) {
    throw new Error('Invalid Base64 file format')
  }

  const mimeType = mimeTypePart.replace('data:', '')
  const data = Buffer.from(base64Data, 'base64')

  return { mimeType, data }
}
