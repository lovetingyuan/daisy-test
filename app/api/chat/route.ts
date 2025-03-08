import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText, Message } from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json()
  const openrouter = createOpenRouter({
    apiKey: 'sk-or-v1-******',
  })
  const model = openrouter('google/gemini-2.0-flash-001')
  const result = streamText({
    model,
    system: 'help me to pass the front-end tech interview',
    messages,
  })

  return result.toDataStreamResponse()
}
