export interface Note {
  id: string
  title: string
  content: string
  folderId: string | null
  tags: string[]
  createdAt: number
  updatedAt: number
  createdBy?: string
}

export interface Folder {
  id: string
  name: string
  icon: string
  color: string
  createdAt: number
  updatedAt: number
}

export interface User {
  name: string
  email?: string
  avatar?: string
}
