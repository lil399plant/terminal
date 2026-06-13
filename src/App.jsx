import { useState } from 'react'
import SleepForm from './components/sleep/SleepForm'
import SleepCard from './components/sleep/SleepCard'
import { getEntry, getTodayKey } from './data/storage'

const S = {
  page: {
    minHeight: '100dvh',
    backgroundColor: '#000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '3rem 1.5rem 2rem',
    boxSizing: 'border-box',
  },
  header: {
    width: '100%',
    maxWidth: '360px',
    marginBottom: '2.5rem',
  },
  title: {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.75rem',
    color: '#FF6B00',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    margin: 0,
  },
  subtitle: {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.65rem',
    color: '#333',
    letterSpacing: '0.15em',
    margin: '0.3rem 0 0',
  },
  divider: {
    width: '100%',
    maxWidth: '360px',
    marginBottom: '2rem',
  },
}

export default function App() {
  const [sleepEntry, setSleepEntry] = useState(
    () => getEntry('sleep', getTodayKey())
  )

  function handleSleepSave(entry) {
    setSleepEntry(entry)
  }

  return (
    <div style={S.page}>
      <header style={S.header}>
        <p style={S.title}>TERMINAL v1.0</p>
        <p style={S.subtitle}>// {getTodayKey()}</p>
      </header>

      <div style={S.divider}>
        <SleepCard entry={sleepEntry} />
      </div>

      <SleepForm onSave={handleSleepSave} />
    </div>
  )
}
