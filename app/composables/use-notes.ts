const STORAGE_KEY = 'sm-notex-notes'

export function useNotes() {
  const getAll = (): Note[] => {
    if (import.meta.server) return []
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  }

  const getById = (id: string): Note | null => {
    return getAll().find((n) => n.id === id) ?? null
  }

  const save = (note: Note): void => {
    const notes = getAll()
    const index = notes.findIndex((n) => n.id === note.id)
    if (index >= 0) {
      notes[index] = { ...note, updatedAt: Date.now() }
    } else {
      notes.push(note)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }

  const remove = (id: string): void => {
    const notes = getAll().filter((n) => n.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }

  const createId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  }

  return { getAll, getById, save, remove, createId }
}
