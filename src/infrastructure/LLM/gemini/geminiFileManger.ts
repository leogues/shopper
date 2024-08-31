import { GoogleAIFileManager } from '@google/generative-ai/server'

export class GeminiFileManager {
  private readonly fileManager: GoogleAIFileManager
  constructor(apiKey: string) {
    this.fileManager = new GoogleAIFileManager(apiKey)
  }

  async upload(filePath: string, mimeType: string) {
    return this.fileManager.uploadFile(filePath, {
      mimeType,
    })
  }
}
