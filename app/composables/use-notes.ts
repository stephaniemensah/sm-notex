import type { Note, Folder, User } from '~/types/note'

const NOTES_STORAGE_KEY = 'sm-notex-notes'
const FOLDERS_STORAGE_KEY = 'sm-notex-folders'
const USER_STORAGE_KEY = 'sm-notex-user'

export function useNotes() {
  // Notes methods
  const getAll = (): Note[] => {
    if (import.meta.server) return []
    const raw = localStorage.getItem(NOTES_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  }

  const getById = (id: string): Note | null => {
    return getAll().find((n) => n.id === id) ?? null
  }

  const getByFolderId = (folderId: string | null): Note[] => {
    return getAll().filter((n) => n.folderId === folderId)
  }

  const save = (note: Note): void => {
    const notes = getAll()
    const index = notes.findIndex((n) => n.id === note.id)
    if (index >= 0) {
      notes[index] = { ...note, updatedAt: Date.now() }
    } else {
      notes.push(note)
    }
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
  }

  const remove = (id: string): void => {
    const notes = getAll().filter((n) => n.id !== id)
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
  }

  // Folders methods
  const getAllFolders = (): Folder[] => {
    if (import.meta.server) return []
    const raw = localStorage.getItem(FOLDERS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  }

  const getFolderById = (id: string): Folder | null => {
    return getAllFolders().find((f) => f.id === id) ?? null
  }

  const saveFolder = (folder: Folder): void => {
    const folders = getAllFolders()
    const index = folders.findIndex((f) => f.id === folder.id)
    if (index >= 0) {
      folders[index] = { ...folder, updatedAt: Date.now() }
    } else {
      folders.push(folder)
    }
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders))
  }

  const removeFolder = (id: string): void => {
    // Remove folder
    const folders = getAllFolders().filter((f) => f.id !== id)
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders))
    
    // Move notes in this folder to uncategorized
    const notes = getAll().map((n) => {
      if (n.folderId === id) {
        return { ...n, folderId: null, updatedAt: Date.now() }
      }
      return n
    })
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
  }

  const getNoteCountByFolder = (folderId: string | null): number => {
    return getAll().filter((n) => n.folderId === folderId).length
  }

  // User methods
  const getUser = (): User => {
    if (import.meta.server) return { name: '' }
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    return raw ? JSON.parse(raw) : { name: '' }
  }

  const saveUser = (user: User): void => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  }

  // Utility
  const createId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  }

  return {
    // Notes
    getAll,
    getById,
    getByFolderId,
    save,
    remove,
    // Folders
    getAllFolders,
    getFolderById,
    saveFolder,
    removeFolder,
    getNoteCountByFolder,
    // User
    getUser,
    saveUser,
    // Utility
    createId,
  }
}
