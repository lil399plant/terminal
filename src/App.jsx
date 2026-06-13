import { useState } from 'react'
import SleepForm from './components/sleep/SleepForm'
import SleepCard from './components/sleep/SleepCard'
import NutritionForm from './components/nutrition/NutritionForm'
import NutritionCard from './components/nutrition/NutritionCard'
import PoopForm from './components/poop/PoopForm'
import PoopCard from './components/poop/PoopCard'
import { getEntry, getTodayKey } from './data/storage'

const TABS = ['sleep', 'nutrition', 'poop']

const S = {
  page: {
    minHeight: '100dvh',
    backgroundColor: '#000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  header: {
    width: '100%',
    maxWidth: '360px',
    padding: '3rem 1.5rem 1.5rem',
    boxSizing: 'border-box',
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
  tabBar: {
    width: '100%',
    maxWidth: '360px',
    display: 'flex',
    borderBottom: '1px solid #222',
    padding: '0 1.5rem',
    boxSizing: 'border-box',
    marginBottom: '2rem',
  },
  tab: (active) => ({
    fontFamily: "'Courier New', monospace",
    fontSize: '0.7rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: active ? '#FF6B00' : '#333',
    background: 'transparent',
    border: 'none',
    borderBottom: `2px solid ${active ? '#FF6B00' : 'transparent'}`,
    padding: '0.6rem 0',
    marginRight: '1.5rem',
    cursor: 'pointer',
  }),
  content: {
    width: '100%',
    maxWidth: '360px',
    padding: '0 1.5rem 3rem',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
}

export default function App() {
  const today = getTodayKey()
  const [tab, setTab] = useState('sleep')
  const [sleepEntry, setSleepEntry] = useState(() => getEntry('sleep', today))
  const [nutritionEntry, setNutritionEntry] = useState(() => getEntry('nutrition', today))
  const [poopEntry, setPoopEntry] = useState(() => getEntry('poop', today))

  return (
    <div style={S.page}>
      <header style={S.header}>
        <p style={S.title}>TERMINAL v1.0</p>
        <p style={S.subtitle}>// {today}</p>
      </header>

      <nav style={S.tabBar}>
        {TABS.map(t => (
          <button key={t} style={S.tab(tab === t)} onClick={() => setTab(t)}>{t}</button>
        ))}
      </nav>

      <div style={S.content}>
        {tab === 'sleep' && (
          <>
            <SleepCard entry={sleepEntry} />
            <SleepForm onSave={setSleepEntry} />
          </>
        )}
        {tab === 'nutrition' && (
          <>
            <NutritionCard entry={nutritionEntry} />
            <NutritionForm onSave={setNutritionEntry} />
          </>
        )}
        {tab === 'poop' && (
          <>
            <PoopCard entry={poopEntry} />
            <PoopForm onSave={setPoopEntry} />
          </>
        )}
      </div>
    </div>
  )
}
