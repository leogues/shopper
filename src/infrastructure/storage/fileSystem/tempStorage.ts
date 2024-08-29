import crypto from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'
import { TempStorage } from '../storage'

const TEMP_DIR = 'uploads'

export class TempFileStorage implements TempStorage {
  private readonly tempDir: string

  constructor() {
    this.tempDir = TEMP_DIR
    this.ensureDirectoryExists()
  }

  private async ensureDirectoryExists(): Promise<void> {
    try {
      await fs.mkdir(this.tempDir, { recursive: true })
    } catch (error) {
      throw error
    }
  }

  private extractFileExtension(mimeType: string): string {
    return mimeType.split('/')[1] || ''
  }

  public async write(buffer: Buffer, mimeType: string): Promise<string> {
    const fileExtension = this.extractFileExtension(mimeType)
    const fileName = `${crypto.randomUUID()}.${fileExtension}`
    const filePath = path.join(this.tempDir, fileName)

    try {
      await fs.writeFile(filePath, buffer)
      return filePath
    } catch (error) {
      throw error
    }
  }

  public async delete(fileName: string): Promise<void> {
    const filePath = path.join(this.tempDir, fileName)

    try {
      await fs.unlink(filePath)
    } catch (error) {
      throw error
    }
  }
}
