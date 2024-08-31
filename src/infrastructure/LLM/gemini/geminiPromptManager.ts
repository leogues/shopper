import { PromptManager } from '../LLM'
import { Prompt } from './gemini'
import { GeminiFileManager } from './geminiFileManger'

export type FilePrompt = {
  filePath: string
  mimeType: string
}

export class GeminiPromptManager implements PromptManager {
  private readonly geminiFileManager: GeminiFileManager
  constructor(geminiFileManager: GeminiFileManager) {
    this.geminiFileManager = geminiFileManager
  }

  async createPromptPayload(
    text: string,
    filePrompt?: FilePrompt
  ): Promise<Prompt> {
    const file = filePrompt ? await this.uploadFile(filePrompt) : undefined
    return [file, { text }].filter(Boolean)
  }

  private async uploadFile(filePrompt: FilePrompt) {
    const { filePath, mimeType } = filePrompt

    const uploadResponse = await this.geminiFileManager.upload(
      filePath,
      mimeType
    )

    return {
      fileData: {
        mimeType,
        fileUri: uploadResponse.file.uri,
      },
    }
  }
}
