export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { description } = await req.json()
  if (!description?.trim()) {
    return new Response(JSON.stringify({ error: 'No description provided' }), { status: 400 })
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: `Estimate the nutritional content of this meal: "${description}"

Respond with ONLY a JSON object, no explanation:
{"calories": <number>, "protein": <number in grams>, "carbs": <number in grams>, "fat": <number in grams>}`,
      }],
    }),
  })

  const data = await response.json()
  const text = data.content?.[0]?.text ?? ''

  try {
    const match = text.match(/\{[^}]+\}/)
    const nutrition = JSON.parse(match[0])
    return new Response(JSON.stringify(nutrition), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to parse estimate' }), { status: 500 })
  }
}
