import { useState } from 'react'
import { setEntry, getTodayKey } from '../../data/storage'

const S = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    width: '100%',
    maxWidth: '360px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    fontFamily: "'Courier New', monospace",
    fontSize: '0.75rem',
    color: '#666',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
  input: {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #333',
    color: '#FF6B00',
    fontFamily: "'Courier New', monospace",
    fontSize: '1.25rem',
    padding: '0.4rem 0',
    outline: 'none',
    width: '100%',
    colorScheme: 'dark',
  },
  row: {
    display: 'flex',
    gap: '1rem',
  },
  qualityWrap: {
    display: 'flex',
    gap: '0.75rem',
    paddingTop: '0.25rem',
  },
  dot: (active) => ({
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    border: `1px solid ${active ? '#FF6B00' : '#333'}`,
    background: active ? '#FF6B00' : 'transparent',
    color: active ? '#000' : '#555',
    fontFamily: "'Courier New', monospace",
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  submit: {
    background: 'transparent',
    border: '1px solid #FF6B00',
    color: '#FF6B00',
    fontFamily: "'Courier New', monospace",
    fontSize: '0.85rem',
    letterSpacing: '0.15em',
    padding: '0.75rem',
    cursor: 'pointer',
    textTransform: 'uppercase',
    marginTop: '0.5rem',
  },
  saved: {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.75rem',
    color: '#FF6B00',
    letterSpacing: '0.1em',
    textAlign: 'center',
    opacity: 0.7,
  },
}

export default function SleepForm({ onSave }) {
  const [bedtime, setBedtime] = useState('')
  const [waketime, setWaketime] = useState('')
  const [quality, setQuality] = useState(null)
  const [saved, setSaved] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!bedtime || !waketime || !quality) return

    const entry = { bedtime, waketime, quality, loggedAt: Date.now() }
    setEntry('sleep', getTodayKey(), entry)
    setSaved(true)
    onSave?.(entry)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form style={S.form} onSubmit={handleSubmit}>
      <div style={S.row}>
        <label style={S.label}>
          Bedtime
          <input
            type="time"
            style={S.input}
            value={bedtime}
            onChange={e => setBedtime(e.target.value)}
          />
        </label>
        <label style={S.label}>
          Wake
          <input
            type="time"
            style={S.input}
            value={waketime}
            onChange={e => setWaketime(e.target.value)}
          />
        </label>
      </div>

      <div style={S.label}>
        Quality
        <div style={S.qualityWrap}>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              style={S.dot(quality === n)}
              onClick={() => setQuality(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" style={S.submit}>Log Sleep</button>
      {saved && <p style={S.saved}>// saved</p>}
    </form>
  )
}
