const S = {
  card: {
    width: '100%',
    maxWidth: '360px',
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
  empty: {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.75rem',
    color: '#333',
    letterSpacing: '0.1em',
  },
}

function calcHours(bedtime, waketime) {
  const [bh, bm] = bedtime.split(':').map(Number)
  const [wh, wm] = waketime.split(':').map(Number)
  let mins = (wh * 60 + wm) - (bh * 60 + bm)
  if (mins < 0) mins += 24 * 60
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export default function SleepCard({ entry }) {
  if (!entry) {
    return (
      <div style={S.card}>
        <p style={S.label}>Today's Sleep</p>
        <p style={S.empty}>// no entry yet</p>
      </div>
    )
  }

  const { bedtime, waketime, quality } = entry
  const hours = calcHours(bedtime, waketime)

  return (
    <div style={S.card}>
      <p style={S.label}>Today's Sleep</p>
      <div style={S.row}>
        <span style={S.key}>Duration</span>
        <span style={S.value}>{hours}</span>
      </div>
      <div style={S.row}>
        <span style={S.key}>Bedtime</span>
        <span style={S.value}>{bedtime}</span>
      </div>
      <div style={S.row}>
        <span style={S.key}>Wake</span>
        <span style={S.value}>{waketime}</span>
      </div>
      <div style={S.row}>
        <span style={S.key}>Quality</span>
        <span style={S.value}>{'█'.repeat(quality)}{'░'.repeat(5 - quality)}</span>
      </div>
    </div>
  )
}
