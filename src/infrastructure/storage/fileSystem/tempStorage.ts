import { promises as fs } from 'fs'
import path from 'path'
import { FilePayload, TempStorage } from '../storage'

const TEMP_DIR = 'temp'

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

  public async write(file: FilePayload): Promise<string> {
    const { buffer, mimeType, fileId } = file
    const fileExtension = this.extractFileExtension(mimeType)
    const fileName = `${fileId}.${fileExtension}`
    const filePath = path.join(this.tempDir, fileName)

    try {
      await fs.writeFile(filePath, buffer)
      return filePath
    } catch (error) {
      throw error
    }
  }

  public async delete(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.error(error)
    }
  }
}
