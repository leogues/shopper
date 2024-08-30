import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai'
import { ModelIA } from '../LLM'

type Image = {
  fileData: {
    mimeType: string
    fileUri: string
  }
}

type Text = {
  text: string
}

type PromptItem = Image | Text

export type Prompt = PromptItem[]

const MODEL = 'gemini-1.5-flash'

export class GeminiIA implements ModelIA {
  private readonly model: GenerativeModel
  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey)
    this.model = genAI.getGenerativeModel({
      model: MODEL,
    })
  }

  async executePrompt(prompt: Prompt) {
    const generateContentResult = await this.model.generateContent(prompt)

    return generateContentResult.response.text()
  }
}
