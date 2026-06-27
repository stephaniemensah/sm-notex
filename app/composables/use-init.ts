import type { Folder } from '~/types/note'

export function useInit() {
  const { getAllFolders, saveFolder, createId } = useNotes()

  const initializeDefaultFolders = () => {
    if (import.meta.server) return
    
    const folders = getAllFolders()
    if (folders.length === 0) {
      const defaultFolders: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>[] = [
        { name: 'My Notes', icon: 'document', color: '#3B82F6' },
        { name: 'To-do list', icon: 'check', color: '#10B981' },
        { name: 'Journal', icon: 'book', color: '#F59E0B' },
        { name: 'Projects', icon: 'chart', color: '#8B5CF6' },
        { name: 'Reading List', icon: 'library', color: '#EC4899' },
      ]

      defaultFolders.forEach((folder) => {
        const now = Date.now()
        saveFolder({
          ...folder,
          id: createId(),
          createdAt: now,
          updatedAt: now,
        })
      })
    }
  }

  return { initializeDefaultFolders }
}
