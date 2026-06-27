export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const { prompt, context } = body

  if (!prompt) {
    throw createError({ statusCode: 400, statusMessage: 'Prompt is required' })
  }

  const apiKey = config.geminiApiKey as string
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Gemini API key not configured. Value: ' + JSON.stringify(Object.keys(config)) })
  }

  const systemPrompt = `You are a helpful writing assistant inside a note-taking app. 
The user is writing a note. You help them improve, expand, rewrite, or generate content.
Always respond with ONLY the content to insert — no explanations, no markdown formatting, no code blocks.
Keep the same language as the user's input.
If the user asks a question, answer it concisely within the context of their note.`

  const fullPrompt = context
    ? `${systemPrompt}\n\nCurrent note content:\n${context}\n\nUser request: ${prompt}`
    : `${systemPrompt}\n\nUser request: ${prompt}`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw createError({ statusCode: response.status, statusMessage: error })
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

  return { text }
})
