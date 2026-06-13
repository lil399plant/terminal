const PREFIX = 'terminal:'

export function getEntry(module, date) {
  try {
    const raw = localStorage.getItem(`${PREFIX}${module}:${date}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setEntry(module, date, data) {
  localStorage.setItem(`${PREFIX}${module}:${date}`, JSON.stringify(data))
}

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}
