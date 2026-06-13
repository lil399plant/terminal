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
  textarea: {
    background: 'transparent',
    border: '1px solid #333',
    borderRadius: 0,
    color: '#FF6B00',
    fontFamily: "'Courier New', monospace",
    fontSize: '0.95rem',
    padding: '0.6rem',
    outline: 'none',
    width: '100%',
    resize: 'none',
    minHeight: '72px',
    boxSizing: 'border-box',
  },
  estimateBtn: {
    background: 'transparent',
    border: '1px solid #333',
    color: '#666',
    fontFamily: "'Courier New', monospace",
    fontSize: '0.8rem',
    letterSpacing: '0.12em',
    padding: '0.5rem',
    cursor: 'pointer',
    textTransform: 'uppercase',
  },
  row: {
    display: 'flex',
    gap: '1rem',
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.4rem',
    borderBottom: '1px solid #333',
  },
  input: {
    background: 'transparent',
    border: 'none',
    color: '#FF6B00',
    fontFamily: "'Courier New', monospace",
    fontSize: '1.1rem',
    padding: '0.4rem 0',
    outline: 'none',
    width: '100%',
  },
  unit: {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.7rem',
    color: '#444',
    whiteSpace: 'nowrap',
  },
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
  status: {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.75rem',
    color: '#FF6B00',
    letterSpacing: '0.1em',
    textAlign: 'center',
    opacity: 0.7,
  },
}

export default function NutritionForm({ onSave }) {
  const [description, setDescription] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  async function handleEstimate() {
    if (!description.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/estimate-nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setCalories(String(data.calories ?? ''))
      setProtein(String(data.protein ?? ''))
      setCarbs(String(data.carbs ?? ''))
      setFat(String(data.fat ?? ''))
    } catch {
      setError('// estimate failed')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!calories && !protein && !carbs && !fat) return

    const entry = {
      description,
      calories: calories ? Number(calories) : null,
      protein: protein ? Number(protein) : null,
      carbs: carbs ? Number(carbs) : null,
      fat: fat ? Number(fat) : null,
      loggedAt: Date.now(),
    }
    setEntry('nutrition', getTodayKey(), entry)
    setSaved(true)
    onSave?.(entry)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form style={S.form} onSubmit={handleSubmit}>
      <label style={S.label}>
        What did you eat today?
        <textarea
          style={S.textarea}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="e.g. chicken breast, rice, broccoli, protein shake"
        />
      </label>

      <button type="button" style={S.estimateBtn} onClick={handleEstimate} disabled={loading}>
        {loading ? '// estimating...' : '→ Estimate with AI'}
      </button>

      {error && <p style={{ ...S.status, color: '#555' }}>{error}</p>}

      <div style={S.row}>
        <label style={{ ...S.label, flex: 1 }}>
          Calories
          <div style={S.inputWrap}>
            <input type="number" inputMode="numeric" style={S.input}
              value={calories} onChange={e => setCalories(e.target.value)} placeholder="—" />
            <span style={S.unit}>kcal</span>
          </div>
        </label>
        <label style={{ ...S.label, flex: 1 }}>
          Protein
          <div style={S.inputWrap}>
            <input type="number" inputMode="numeric" style={S.input}
              value={protein} onChange={e => setProtein(e.target.value)} placeholder="—" />
            <span style={S.unit}>g</span>
          </div>
        </label>
      </div>

      <div style={S.row}>
        <label style={{ ...S.label, flex: 1 }}>
          Carbs
          <div style={S.inputWrap}>
            <input type="number" inputMode="numeric" style={S.input}
              value={carbs} onChange={e => setCarbs(e.target.value)} placeholder="—" />
            <span style={S.unit}>g</span>
          </div>
        </label>
        <label style={{ ...S.label, flex: 1 }}>
          Fat
          <div style={S.inputWrap}>
            <input type="number" inputMode="numeric" style={S.input}
              value={fat} onChange={e => setFat(e.target.value)} placeholder="—" />
            <span style={S.unit}>g</span>
          </div>
        </label>
      </div>

      <button type="submit" style={S.submit}>Log Nutrition</button>
      {saved && <p style={S.status}>// saved</p>}
    </form>
  )
}
