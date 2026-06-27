export function useMigration() {
  const migrateNotes = () => {
    if (import.meta.server) return

    const NOTES_KEY = 'sm-notex-notes'
    const MIGRATION_KEY = 'sm-notex-migrated'
    
    // Check if migration already done
    if (localStorage.getItem(MIGRATION_KEY)) return
    
    const raw = localStorage.getItem(NOTES_KEY)
    if (!raw) {
      localStorage.setItem(MIGRATION_KEY, 'true')
      return
    }

    try {
      const notes = JSON.parse(raw)
      const migratedNotes = notes.map((note: any) => {
        // If note already has new structure, keep it
        if (note.title !== undefined) return note
        
        // Migrate old note format
        return {
          ...note,
          title: 'Untitled',
          folderId: null,
          tags: [],
          createdBy: '',
        }
      })

      localStorage.setItem(NOTES_KEY, JSON.stringify(migratedNotes))
      localStorage.setItem(MIGRATION_KEY, 'true')
    } catch (e) {
      console.error('Migration failed:', e)
    }
  }

  const migrateFolders = () => {
    if (import.meta.server) return

    const FOLDERS_KEY = 'sm-notex-folders'
    const FOLDER_MIGRATION_KEY = 'sm-notex-folders-migrated'
    
    // Check if migration already done
    if (localStorage.getItem(FOLDER_MIGRATION_KEY)) return
    
    const raw = localStorage.getItem(FOLDERS_KEY)
    if (!raw) {
      localStorage.setItem(FOLDER_MIGRATION_KEY, 'true')
      return
    }

    try {
      const folders = JSON.parse(raw)
      
      // Emoji to icon name mapping
      const emojiMap: Record<string, string> = {
        '📝': 'document',
        '✅': 'check',
        '📔': 'book',
        '📊': 'chart',
        '📚': 'library',
        '💡': 'lightbulb',
        '🎯': 'target',
        '⭐': 'star',
        '🔥': 'fire',
        '💼': 'briefcase',
        '🎨': 'palette',
        '🎵': 'music'
      }
      
      const migratedFolders = folders.map((folder: any) => {
        // If icon is an emoji, convert it
        if (emojiMap[folder.icon]) {
          return {
            ...folder,
            icon: emojiMap[folder.icon]
          }
        }
        return folder
      })

      localStorage.setItem(FOLDERS_KEY, JSON.stringify(migratedFolders))
      localStorage.setItem(FOLDER_MIGRATION_KEY, 'true')
    } catch (e) {
      console.error('Folder migration failed:', e)
    }
  }

  return { migrateNotes, migrateFolders }
}
