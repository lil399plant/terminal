import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const body = await req.json()
  console.log('shortcuts-sync body:', JSON.stringify(body))

  // Echo mode: return the raw body so we can inspect what Shortcuts sends
  return new Response(JSON.stringify({ received: body }), { status: 200 })

  const rows = []

  for (const [metricName, samples] of Object.entries(body)) {
    if (!Array.isArray(samples)) continue
    for (const s of samples) {
      rows.push({
        metric_name: metricName,
        recorded_at: new Date(s.start ?? s.date).toISOString(),
        value: s,
        source: 'Apple Watch',
      })
    }
  }

  if (rows.length === 0) {
    return new Response(JSON.stringify({ inserted: 0 }), { status: 200 })
  }

  const { error } = await supabase
    .from('health_metrics')
    .upsert(rows, { onConflict: 'metric_name,recorded_at' })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ inserted: rows.length }), { status: 200 })
}

export const config = { runtime: 'edge' }
