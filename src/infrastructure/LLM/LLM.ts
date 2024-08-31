import { Prompt } from './gemini/gemini'
import { FilePrompt } from './gemini/geminiPromptManager'

export interface PromptManager {
  createPromptPayload(text: string, filePrompt?: FilePrompt): Promise<Prompt>
}

export interface ModelIA {
  executePrompt(prompt: Prompt): Promise<string>
}
