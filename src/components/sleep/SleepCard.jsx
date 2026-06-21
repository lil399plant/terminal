import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const S = {
  card: {
    width: '100%',
    borderTop: '1px solid #222',
    paddingTop: '1.5rem',
  },
  label: {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.7rem',
    color: '#444',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    marginBottom: '1rem',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '0.6rem',
  },
  key: {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.75rem',
    color: '#555',
    letterSpacing: '0.1em',
  },
  value: {
    fontFamily: "'Courier New', monospace",
    fontSize: '1rem',
    color: '#FF6B00',
  },
  dimValue: {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.85rem',
    color: '#FF6B00',
    opacity: 0.6,
  },
  empty: {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.75rem',
    color: '#333',
    letterSpacing: '0.1em',
  },
  stagesWrap: {
    marginTop: '1.2rem',
    marginBottom: '0.6rem',
  },
  stagesBar: {
    display: 'flex',
    height: '6px',
    width: '100%',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '0.5rem',
    gap: '1px',
  },
  stagesLegend: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  legendItem: {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.65rem',
    color: '#555',
    letterSpacing: '0.08em',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  legendDot: (color) => ({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  }),
  source: {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.6rem',
    color: '#2a2a2a',
    letterSpacing: '0.1em',
    marginTop: '1.5rem',
  },
}

const STAGE_COLORS = {
  AsleepDeep: '#FF6B00',
  AsleepREM: '#ff9a44',
  AsleepCore: '#7a3800',
  InBed: '#1a1a1a',
  Awake: '#333',
}

const STAGE_LABELS = {
  AsleepDeep: 'Deep',
  AsleepREM: 'REM',
  AsleepCore: 'Core',
  InBed: 'In Bed',
  Awake: 'Awake',
}

function fmtMins(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

function fmtTime(isoStr) {
  return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

function parseSleepStages(rows) {
  const stages = { AsleepDeep: 0, AsleepREM: 0, AsleepCore: 0, Awake: 0, InBed: 0 }
  let earliest = null
  let latest = null

  for (const row of rows) {
    const stage = row.value?.value
    if (!stage) continue
    const t = new Date(row.recorded_at).getTime()
    if (!earliest || t < earliest) earliest = t
    if (!latest || t > latest) latest = t
    if (stage in stages) stages[stage] += 1
  }

  // Each row is typically one minute of data from Health Auto Export
  const totalTracked = Object.values(stages).reduce((a, b) => a + b, 0)
  const asleepMins = stages.AsleepDeep + stages.AsleepREM + stages.AsleepCore

  return { stages, totalTracked, asleepMins, earliest, latest }
}

export default function SleepCard({ date }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const start = `${date}T00:00:00`
      // Sleep from prior evening counts — look back 18h
      const fromDate = new Date(`${date}T12:00:00`)
      fromDate.setDate(fromDate.getDate() - 1)

      const [sleepRes, hrvRes, rrRes] = await Promise.all([
        supabase
          .from('health_metrics')
          .select('recorded_at, value')
          .eq('metric_name', 'sleep_analysis')
          .gte('recorded_at', fromDate.toISOString())
          .lt('recorded_at', `${date}T18:00:00`)
          .order('recorded_at', { ascending: true }),
        supabase
          .from('health_metrics')
          .select('recorded_at, value')
          .eq('metric_name', 'heart_rate_variability_sdnn')
          .gte('recorded_at', fromDate.toISOString())
          .lt('recorded_at', `${date}T18:00:00`),
        supabase
          .from('health_metrics')
          .select('recorded_at, value')
          .eq('metric_name', 'respiratory_rate')
          .gte('recorded_at', fromDate.toISOString())
          .lt('recorded_at', `${date}T18:00:00`),
      ])

      setData({
        sleep: sleepRes.data ?? [],
        hrv: hrvRes.data ?? [],
        rr: rrRes.data ?? [],
      })
      setLoading(false)
    }
    load()
  }, [date])

  if (loading) {
    return (
      <div style={S.card}>
        <p style={S.label}>Sleep</p>
        <p style={S.empty}>// loading...</p>
      </div>
    )
  }

  const hasSleep = data.sleep.length > 0
  if (!hasSleep) {
    return (
      <div style={S.card}>
        <p style={S.label}>Sleep</p>
        <p style={S.empty}>// no watch data yet</p>
      </div>
    )
  }

  const { stages, totalTracked, asleepMins, earliest, latest } = parseSleepStages(data.sleep)

  const avgHRV = data.hrv.length > 0
    ? Math.round(data.hrv.reduce((s, r) => s + (r.value?.Avg ?? 0), 0) / data.hrv.length)
    : null

  const avgRR = data.rr.length > 0
    ? (data.rr.reduce((s, r) => s + (r.value?.Avg ?? 0), 0) / data.rr.length).toFixed(1)
    : null

  const stageOrder = ['AsleepDeep', 'AsleepREM', 'AsleepCore', 'Awake']
  const presentStages = stageOrder.filter(s => stages[s] > 0)

  return (
    <div style={S.card}>
      <p style={S.label}>Sleep — Apple Watch</p>

      <div style={S.row}>
        <span style={S.key}>Duration</span>
        <span style={S.value}>{fmtMins(asleepMins)}</span>
      </div>
      {earliest && (
        <div style={S.row}>
          <span style={S.key}>Bedtime</span>
          <span style={S.dimValue}>{fmtTime(earliest)}</span>
        </div>
      )}
      {latest && (
        <div style={S.row}>
          <span style={S.key}>Wake</span>
          <span style={S.dimValue}>{fmtTime(latest)}</span>
        </div>
      )}
      {avgHRV !== null && (
        <div style={S.row}>
          <span style={S.key}>HRV</span>
          <span style={S.value}>{avgHRV} ms</span>
        </div>
      )}
      {avgRR !== null && (
        <div style={S.row}>
          <span style={S.key}>Resp. Rate</span>
          <span style={S.dimValue}>{avgRR} brpm</span>
        </div>
      )}

      {presentStages.length > 0 && (
        <div style={S.stagesWrap}>
          <span style={S.key}>Stages</span>
          <div style={S.stagesBar}>
            {presentStages.map(stage => (
              <div
                key={stage}
                style={{
                  flex: stages[stage],
                  background: STAGE_COLORS[stage],
                }}
              />
            ))}
          </div>
          <div style={S.stagesLegend}>
            {presentStages.map(stage => (
              <span key={stage} style={S.legendItem}>
                <span style={S.legendDot(STAGE_COLORS[stage])} />
                {STAGE_LABELS[stage]} {fmtMins(stages[stage])}
              </span>
            ))}
          </div>
        </div>
      )}

      <p style={S.source}>// apple watch · health auto export</p>
    </div>
  )
}
