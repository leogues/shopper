import sharp from 'sharp'

export const sharpImageWithText = async (data: Buffer) =>
  await sharp(data).rotate().grayscale().normalize().toBuffer()
