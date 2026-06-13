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
  desc: {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.7rem',
    color: '#444',
    marginBottom: '0.75rem',
    lineHeight: 1.5,
  },
  empty: {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.75rem',
    color: '#333',
    letterSpacing: '0.1em',
  },
}

export default function NutritionCard({ entry }) {
  if (!entry) {
    return (
      <div style={S.card}>
        <p style={S.label}>Today's Nutrition</p>
        <p style={S.empty}>// no entry yet</p>
      </div>
    )
  }

  const { description, calories, protein, carbs, fat } = entry

  return (
    <div style={S.card}>
      <p style={S.label}>Today's Nutrition</p>
      {description && <p style={S.desc}>"{description}"</p>}
      {calories != null && (
        <div style={S.row}><span style={S.key}>Calories</span><span style={S.value}>{calories} kcal</span></div>
      )}
      {protein != null && (
        <div style={S.row}><span style={S.key}>Protein</span><span style={S.value}>{protein}g</span></div>
      )}
      {carbs != null && (
        <div style={S.row}><span style={S.key}>Carbs</span><span style={S.value}>{carbs}g</span></div>
      )}
      {fat != null && (
        <div style={S.row}><span style={S.key}>Fat</span><span style={S.value}>{fat}g</span></div>
      )}
    </div>
  )
}
