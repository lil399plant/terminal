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
  const metrics = body?.data?.metrics
  if (!Array.isArray(metrics)) {
    return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 })
  }

  const rows = []
  for (const metric of metrics) {
    if (!Array.isArray(metric.data)) continue
    for (const point of metric.data) {
      const { date, ...value } = point
      rows.push({
        metric_name: metric.name,
        units: metric.units ?? null,
        recorded_at: new Date(date).toISOString(),
        value,
        source: point.source ?? null,
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
    console.error('Supabase upsert error:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ inserted: rows.length }), { status: 200 })
}

export const config = { runtime: 'edge' }
