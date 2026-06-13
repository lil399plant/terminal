import { useState } from 'react'
import { setEntry, getTodayKey } from '../../data/storage'

const BRISTOL = [
  { n: 1, label: 'Separate hard lumps' },
  { n: 2, label: 'Lumpy sausage' },
  { n: 3, label: 'Cracked sausage' },
  { n: 4, label: 'Smooth sausage' },
  { n: 5, label: 'Soft blobs' },
  { n: 6, label: 'Fluffy, mushy' },
  { n: 7, label: 'Watery, no solids' },
]

const S = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    width: '100%',
    maxWidth: '360px',
  },
  sectionLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.75rem',
    color: '#666',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: '0.75rem',
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  option: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 0.6rem',
    border: `1px solid ${active ? '#FF6B00' : '#222'}`,
    cursor: 'pointer',
    background: 'transparent',
    textAlign: 'left',
    width: '100%',
  }),
  num: (active) => ({
    fontFamily: "'Courier New', monospace",
    fontSize: '1rem',
    color: active ? '#000' : '#555',
    background: active ? '#FF6B00' : 'transparent',
    width: '1.6rem',
    height: '1.6rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),
  optLabel: (active) => ({
    fontFamily: "'Courier New', monospace",
    fontSize: '0.75rem',
    color: active ? '#FF6B00' : '#444',
    letterSpacing: '0.05em',
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

export default function PoopForm({ onSave }) {
  const [selected, setSelected] = useState(null)
  const [saved, setSaved] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (selected == null) return
    const entry = { type: selected, loggedAt: Date.now() }
    setEntry('poop', getTodayKey(), entry)
    setSaved(true)
    onSave?.(entry)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form style={S.form} onSubmit={handleSubmit}>
      <div>
        <p style={S.sectionLabel}>Bristol Stool Scale</p>
        <div style={S.options}>
          {BRISTOL.map(({ n, label }) => (
            <button
              key={n}
              type="button"
              style={S.option(selected === n)}
              onClick={() => setSelected(n)}
            >
              <span style={S.num(selected === n)}>{n}</span>
              <span style={S.optLabel(selected === n)}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <button type="submit" style={S.submit}>Log</button>
      {saved && <p style={S.saved}>// saved</p>}
    </form>
  )
}
