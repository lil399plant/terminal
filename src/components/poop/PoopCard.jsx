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
  sub: {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.7rem',
    color: '#444',
    marginTop: '0.2rem',
  },
  empty: {
    fontFamily: "'Courier New', monospace",
    fontSize: '0.75rem',
    color: '#333',
    letterSpacing: '0.1em',
  },
}

export default function PoopCard({ entry }) {
  if (!entry) {
    return (
      <div style={S.card}>
        <p style={S.label}>Today's Poop</p>
        <p style={S.empty}>// no entry yet</p>
      </div>
    )
  }

  const bristol = BRISTOL.find(b => b.n === entry.type)

  return (
    <div style={S.card}>
      <p style={S.label}>Today's Poop</p>
      <div style={S.row}>
        <span style={S.key}>Bristol Type</span>
        <span style={S.value}>{entry.type}</span>
      </div>
      {bristol && <p style={S.sub}>// {bristol.label.toLowerCase()}</p>}
    </div>
  )
}
