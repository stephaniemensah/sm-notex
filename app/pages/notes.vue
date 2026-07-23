<template>
  <div class="min-h-screen">
    <div class="max-w-lg mx-auto px-5 pt-12 pb-28">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <p class="text-[11px] text-pink-400 font-medium uppercase tracking-wider mb-1">{{ greeting }}</p>
          <h1 class="text-[26px] font-bold tracking-tight">
            <span class="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent">My Notes</span>
          </h1>
        </div>
        <button @click="openProfileModal" class="transition-transform active:scale-95">
          <UiAvatar :name="user.name" :image-url="user.avatar" size="md" />
        </button>
      </div>

      <!-- Search -->
      <div class="mb-6">
        <UiSearchInput v-model="searchQuery" placeholder="Search notes and folders..." />
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 p-1 bg-white/50 backdrop-blur-sm rounded-xl mb-6 border border-white/30">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 py-2 text-[12px] font-semibold rounded-lg transition-all duration-200',
            activeTab === tab.id
              ? 'bg-white/80 text-pink-600 shadow-[0_2px_8px_rgba(244,114,182,0.15)]'
              : 'text-pink-400 hover:text-pink-600'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Folders Tab -->
      <div v-if="activeTab === 'folders'">
        <div v-if="folders.length === 0">
          <EmptyState
            icon="grid"
            title="No folders yet"
            description="Create your first folder to organize your notes."
          />
        </div>

        <div v-else-if="filteredFolders.length === 0">
          <EmptyState
            icon="search"
            title="No folders found"
            description="Try a different search term."
          />
        </div>

        <div v-else class="grid grid-cols-2 gap-3 stagger">
          <FolderCard
            v-for="folder in filteredFolders"
            :key="folder.id"
            :to="`/folder/${folder.id}`"
            :title="folder.name"
            :icon="folder.icon"
            :color="folder.color"
            :count="getNoteCountByFolder(folder.id)"
          />
        </div>
      </div>

      <!-- Notes Tab -->
      <div v-if="activeTab === 'notes'">
        <div v-if="filteredNotes.length === 0">
          <EmptyState
            icon="document"
            :title="searchQuery ? 'No notes found' : 'No notes yet'"
            :description="searchQuery ? 'Try a different search term.' : 'Tap the + button to create your first note.'"
          />
        </div>

        <div v-else class="space-y-2 stagger">
          <NoteCard
            v-for="(note, index) in filteredNotes"
            :key="note.id"
            :to="`/editor/${note.id}`"
            :title="note.title"
            :content="note.content"
            :tags="note.tags"
            :updated-at="note.updatedAt"
            :index="index"
          />
        </div>
      </div>
    </div>

    <!-- Bottom Nav -->
    <BottomNav active="home" :user-name="user.name" :user-avatar="user.avatar" @add="showFolderModal = true" @profile="openProfileModal" />

    <!-- Create Folder Modal -->
    <UiModal :show="showFolderModal" title="New Folder" @close="closeFolderModal">
      <div class="space-y-4">
        <UiInput
          v-model="newFolder.name"
          label="Folder name"
          placeholder="e.g., Meeting notes"
        />

        <div>
          <label class="block text-[11px] font-semibold text-pink-400 uppercase tracking-wider mb-2">Icon</label>
          <div class="grid grid-cols-6 gap-1.5">
            <button
              v-for="icon in availableIcons"
              :key="icon"
              type="button"
              @click="newFolder.icon = icon"
                :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center p-2 transition-all duration-150',
                  newFolder.icon === icon
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md'
                    : 'bg-white/50 backdrop-blur-sm text-pink-400 hover:bg-white/70'
                ]"
            >
              <FolderIcon :name="icon" />
            </button>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-pink-400 uppercase tracking-wider mb-2">Color</label>
          <div class="flex gap-2">
            <button
              v-for="color in availableColors"
              :key="color"
              @click="newFolder.color = color"
              :class="[
                'w-8 h-8 rounded-lg transition-all duration-150',
                newFolder.color === color ? 'ring-2 ring-offset-2 ring-pink-400 scale-110' : 'hover:scale-105'
              ]"
              :style="{ backgroundColor: color }"
            ></button>
          </div>
        </div>

        <UiButton
          size="md"
          class="w-full mt-2"
          :disabled="!newFolder.name.trim()"
          @click="createFolder"
        >
          Create folder
        </UiButton>
      </div>
    </UiModal>

    <!-- Profile Modal -->
    <UiModal :show="showProfileModal" title="Profile" @close="showProfileModal = false">
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div class="flex justify-center mb-2">
          <div class="relative">
            <UiAvatar
              :name="editedUser.name || 'You'"
              :image-url="editedAvatarDataUrl || user.avatar || undefined"
              size="xl"
            />
            <label class="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center cursor-pointer hover:from-pink-500 hover:to-rose-500 transition-all shadow-lg ring-2 ring-white">
              <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
              <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
            </label>
          </div>
        </div>

        <UiInput
          v-model="editedUser.name"
          label="Name"
          placeholder="Your name"
          required
        />

        <UiInput
          v-model="editedUser.email"
          label="Email (optional)"
          type="email"
          placeholder="you@example.com"
        />

        <UiButton
          type="submit"
          size="md"
          class="w-full"
          :disabled="!editedUser.name.trim()"
        >
          Save changes
        </UiButton>

        <button
          type="button"
          class="w-full flex items-center justify-center gap-2 py-2.5 text-[12px] font-medium text-pink-500 hover:bg-pink-50 rounded-xl transition-colors mt-1"
          @click="handleLogout"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Sign out
        </button>
      </form>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { Note, Folder, User } from '~/types/note'

const router = useRouter()
const { getAll, getAllFolders, saveFolder, getNoteCountByFolder, createId, getUser, saveUser } = useNotes()
const { initializeDefaultFolders } = useInit()
const { migrateNotes, migrateFolders } = useMigration()

const tabs = [
  { id: 'folders' as const, label: 'Folders' },
  { id: 'notes' as const, label: 'Notes' },
]

const activeTab = ref<'notes' | 'folders'>('folders')
const notes = ref<Note[]>([])
const folders = ref<Folder[]>([])
const showFolderModal = ref(false)
const showProfileModal = ref(false)
const searchQuery = ref('')
const user = ref(getUser())
const editedAvatarDataUrl = ref('')

const newFolder = ref({ name: '', icon: 'document', color: '#EC4899' })
const editedUser = ref({ name: user.value.name, email: user.value.email || '' })

const availableIcons = ['document', 'check', 'book', 'chart', 'library', 'lightbulb', 'target', 'star', 'fire', 'briefcase', 'palette', 'music']
const availableColors = ['#EC4899', '#F43F5E', '#D946EF', '#8B5CF6', '#6366F1', '#06B6D4', '#10B981', '#F59E0B']

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const filteredNotes = computed(() => {
  if (!searchQuery.value.trim()) return notes.value
  const q = searchQuery.value.toLowerCase()
  return notes.value.filter(n =>
    n.title?.toLowerCase().includes(q) ||
    n.content?.toLowerCase().includes(q) ||
    n.tags?.some(t => t.toLowerCase().includes(q))
  )
})

const filteredFolders = computed(() => {
  if (!searchQuery.value.trim()) return folders.value
  const q = searchQuery.value.toLowerCase()
  return folders.value.filter(f => f.name.toLowerCase().includes(q))
})

onMounted(() => {
  migrateNotes()
  migrateFolders()
  initializeDefaultFolders()
  notes.value = getAll().sort((a, b) => b.updatedAt - a.updatedAt)
  folders.value = getAllFolders().sort((a, b) => b.updatedAt - a.updatedAt)
  user.value = getUser()
  if (!user.value.name) router.push('/')
})

function handleAvatarUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { editedAvatarDataUrl.value = reader.result as string }
  reader.readAsDataURL(file)
}

function createFolder() {
  if (!newFolder.value.name.trim()) return
  const folder: Folder = {
    id: createId(),
    name: newFolder.value.name.trim(),
    icon: newFolder.value.icon,
    color: newFolder.value.color,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  saveFolder(folder)
  folders.value = getAllFolders().sort((a, b) => b.updatedAt - a.updatedAt)
  closeFolderModal()
}

function closeFolderModal() {
  showFolderModal.value = false
  newFolder.value = { name: '', icon: 'document', color: '#EC4899' }
}

function openProfileModal() {
  editedUser.value = { name: user.value.name, email: user.value.email || '' }
  editedAvatarDataUrl.value = ''
  showProfileModal.value = true
}

function updateProfile() {
  if (!editedUser.value.name.trim()) return
  const updatedUser: User = {
    name: editedUser.value.name.trim(),
    email: editedUser.value.email.trim() || undefined,
    avatar: editedAvatarDataUrl.value || user.value.avatar || undefined,
  }
  saveUser(updatedUser)
  user.value = updatedUser
  showProfileModal.value = false
  notes.value = getAll().sort((a, b) => b.updatedAt - a.updatedAt)
}

function handleLogout() {
  if (confirm('Are you sure you want to sign out? Your notes will remain saved locally.')) {
    saveUser({ name: '' })
    router.push('/')
  }
  showProfileModal.value = false
}
</script>
