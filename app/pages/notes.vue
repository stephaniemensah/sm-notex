<template>
  <div class="min-h-screen bg-[#FAF8F5]">
    <div class="max-w-lg mx-auto px-5 pt-12 pb-24">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div></div>
        <button @click="openProfileModal" class="active:scale-95 transition-all">
          <UiAvatar :name="user.name" :image-url="user.avatar" size="md" />
        </button>
      </div>

      <!-- Greeting & Heading -->
      <div class="mb-6">
        <h1 class="text-[28px] font-bold text-gray-900 leading-snug">
          Capture your thoughts
        </h1>
      </div>

      <!-- Search Bar -->
      <div class="relative mb-5">
        <UiIcon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 !w-4 !h-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-black/[0.06] text-[14px] text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300 transition-colors"
        />
      </div>

      <!-- Tabs -->
      <div class="flex gap-6 mb-5 border-b border-black/[0.06]">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'pb-2.5 text-[14px] font-medium transition-all relative',
            activeTab === tab.id ? 'text-gray-900' : 'text-gray-400'
          ]"
        >
          {{ tab.label }}
          <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 rounded-full"></div>
        </button>
      </div>

      <!-- Folders Tab -->
      <div v-if="activeTab === 'folders'">
        <div v-if="folders.length === 0" class="text-center py-16">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UiIcon name="grid" class="!w-8 !h-8 text-gray-400" />
          </div>
          <p class="text-[14px] font-medium text-gray-900 mb-1">No folders yet</p>
          <p class="text-[13px] text-gray-400">Tap + to create your first folder.</p>
        </div>

        <div v-else-if="filteredFolders.length === 0" class="text-center py-16">
          <p class="text-[14px] font-medium text-gray-900 mb-1">No folders found</p>
          <p class="text-[13px] text-gray-400">Try a different search term.</p>
        </div>

        <div v-else class="grid grid-cols-2 gap-3">
          <NuxtLink
            v-for="folder in filteredFolders"
            :key="folder.id"
            :to="`/folder/${folder.id}`"
            class="bg-white rounded-2xl p-4 border border-black/[0.04] active:scale-[0.97] transition-all duration-150"
          >
            <div class="flex items-center gap-3 mb-3">
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center p-2.5"
                :style="{ backgroundColor: folder.color + '18', color: folder.color }"
              >
                <FolderIcon :name="folder.icon" />
              </div>
            </div>
            <h3 class="text-[14px] font-semibold text-gray-900 mb-0.5">{{ folder.name }}</h3>
            <p class="text-[12px] text-gray-400">{{ getNoteCountByFolder(folder.id) }} notes</p>
          </NuxtLink>
        </div>
      </div>

      <!-- Notes Tab -->
      <div v-if="activeTab === 'notes'">
        <div v-if="filteredNotes.length === 0" class="text-center py-16">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UiIcon name="document" class="!w-8 !h-8 text-gray-400" />
          </div>
          <p class="text-[14px] font-medium text-gray-900 mb-1">{{ searchQuery ? 'No notes found' : 'No notes yet' }}</p>
          <p class="text-[13px] text-gray-400">{{ searchQuery ? 'Try a different search term' : 'Tap + to create your first note.' }}</p>
        </div>

        <div v-else class="space-y-3">
          <NuxtLink
            v-for="(note, index) in filteredNotes"
            :key="note.id"
            :to="`/editor/${note.id}`"
            class="block rounded-2xl p-4 active:scale-[0.97] transition-all duration-150 border border-black/[0.04]"
            :style="{
              backgroundColor: stickyColors[index % stickyColors.length],
              transform: `rotate(${getRotation(index)}deg)`
            }"
          >
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-[14px] font-semibold text-gray-900 line-clamp-1">{{ note.title || 'Untitled' }}</h3>
              <UiIcon name="pin" class="!w-3.5 !h-3.5 text-gray-500 flex-shrink-0 -mt-0.5" />
            </div>
            <div class="relative h-[72px] overflow-hidden mb-2">
              <div class="prose prose-xs max-w-none text-[12px] text-gray-600 leading-relaxed [&_img]:h-12 [&_img]:w-auto [&_img]:rounded [&_img]:object-cover [&_p]:mb-1" v-html="note.content || '<span class=\'text-gray-400 italic\'>Empty note</span>'"></div>
              <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-current to-transparent pointer-events-none" :style="{ color: stickyColors[index % stickyColors.length] }"></div>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-[11px] text-gray-400">{{ formatDate(note.updatedAt) }}</p>
              <div v-if="note.tags && note.tags.length > 0" class="flex gap-1">
                <span v-for="tag in note.tags.slice(0, 2)" :key="tag" class="text-[10px] px-1.5 py-0.5 rounded-full bg-white/60 text-gray-600">{{ tag }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Bottom Nav -->
    <BottomNav active="home" :user-name="user.name" :user-avatar="user.avatar" @add="handleAdd" @profile="openProfileModal" />

    <!-- Create Folder Modal -->
    <UiModal :show="showFolderModal" title="New Folder" @close="closeFolderModal">
      <div class="space-y-3">
        <UiInput
          v-model="newFolder.name"
          label="Folder Name"
          placeholder="e.g., My Notes"
        />

        <div>
          <label class="block text-[12px] font-medium text-gray-500 mb-1.5">Icon</label>
          <div class="grid grid-cols-6 gap-1.5">
            <button
              v-for="icon in availableIcons"
              :key="icon"
              type="button"
              @click="newFolder.icon = icon"
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center p-2 transition-all',
                newFolder.icon === icon
                  ? 'bg-gray-900 text-white scale-105'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
              ]"
            >
              <FolderIcon :name="icon" />
            </button>
          </div>
        </div>

        <div>
          <label class="block text-[12px] font-medium text-gray-500 mb-1.5">Color</label>
          <div class="grid grid-cols-6 gap-1.5">
            <button
              v-for="color in availableColors"
              :key="color"
              @click="newFolder.color = color"
              :class="[
                'w-10 h-10 rounded-full transition-all',
                newFolder.color === color ? 'ring-2 ring-offset-2 ring-gray-900 scale-105' : ''
              ]"
              :style="{ backgroundColor: color }"
            ></button>
          </div>
        </div>

        <UiButton
          variant="primary"
          size="md"
          class="w-full"
          :disabled="!newFolder.name.trim()"
          @click="createFolder"
        >
          Create
        </UiButton>
      </div>
    </UiModal>

    <!-- Update Profile Modal -->
    <UiModal :show="showProfileModal" title="Update Profile" @close="showProfileModal = false">
      <form @submit.prevent="updateProfile" class="space-y-3">
        <div class="flex justify-center mb-3">
          <div class="relative inline-block">
            <UiAvatar
              :name="editedUser.name || 'You'"
              :image-url="editedAvatarDataUrl || user.avatar || undefined"
              size="lg"
            />
            <label class="absolute -bottom-0.5 -right-0.5 w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center cursor-pointer active:bg-gray-800 transition-colors ring-2 ring-white">
              <UiIcon name="camera" class="!w-3.5 !h-3.5 text-white" />
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
          label="Email (Optional)"
          type="email"
          placeholder="your@email.com"
        />

        <UiButton
          type="submit"
          variant="primary"
          size="md"
          class="w-full"
          :disabled="!editedUser.name.trim()"
        >
          Update
        </UiButton>

        <button
          type="button"
          class="w-full flex items-center justify-center gap-2 py-2.5 text-[13px] font-medium text-red-500 active:bg-red-50 rounded-xl transition-colors mt-2"
          @click="handleLogout"
        >
          <UiIcon name="logout" class="!w-4 !h-4" />
          Logout
        </button>
      </form>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { Note, Folder, User } from '~/types/note'

const router = useRouter()
const { getAll, getAllFolders, getFolderById, saveFolder, getNoteCountByFolder, createId, getUser, saveUser } = useNotes()
const { initializeDefaultFolders } = useInit()
const { migrateNotes, migrateFolders } = useMigration()

const tabs = [
  { id: 'folders' as const, label: 'Folders' },
  { id: 'notes' as const, label: 'Notes' },
]

const stickyColors = [
  '#E8F5E9', // mint
  '#FCE4EC', // pink
  '#E3F2FD', // blue
  '#FFF9C4', // yellow
  '#F3E5F5', // purple
  '#E0F7FA', // cyan
  '#FBE9E7', // peach
  '#F1F8E9', // lime
]

const activeTab = ref<'notes' | 'folders'>('folders')
const notes = ref<Note[]>([])
const folders = ref<Folder[]>([])
const showFolderModal = ref(false)
const showProfileModal = ref(false)
const searchQuery = ref('')
const user = ref(getUser())
const editedAvatarDataUrl = ref('')

const newFolder = ref({
  name: '',
  icon: 'document',
  color: '#3B82F6'
})

const editedUser = ref({
  name: user.value.name,
  email: user.value.email || ''
})

const availableIcons = ['document', 'check', 'book', 'chart', 'library', 'lightbulb', 'target', 'star', 'fire', 'briefcase', 'palette', 'music']
const availableColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

const filteredNotes = computed(() => {
  if (!searchQuery.value.trim()) return notes.value
  const query = searchQuery.value.toLowerCase()
  return notes.value.filter(note => {
    const titleMatch = note.title?.toLowerCase().includes(query)
    const contentMatch = note.content?.toLowerCase().includes(query)
    const tagsMatch = note.tags?.some(tag => tag.toLowerCase().includes(query))
    return titleMatch || contentMatch || tagsMatch
  })
})

const filteredFolders = computed(() => {
  if (!searchQuery.value.trim()) return folders.value
  const query = searchQuery.value.toLowerCase()
  return folders.value.filter(folder =>
    folder.name.toLowerCase().includes(query)
  )
})

function getRotation(index: number): string {
  const rotations = ['-1', '0.5', '-0.5', '1', '-0.8', '0.8', '-0.3', '0.3']
  return rotations[index % rotations.length] || '0'
}

onMounted(() => {
  migrateNotes()
  migrateFolders()
  initializeDefaultFolders()
  notes.value = getAll().sort((a, b) => b.updatedAt - a.updatedAt)
  folders.value = getAllFolders().sort((a, b) => b.updatedAt - a.updatedAt)
  user.value = getUser()

  if (!user.value.name) {
    router.push('/')
    return
  }
})

function formatDate(ts: number): string {
  const date = new Date(ts)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short'
  }).toUpperCase()
}

function handleAvatarUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    editedAvatarDataUrl.value = reader.result as string
  }
  reader.readAsDataURL(file)
}

function handleAdd() {
  showFolderModal.value = true
}

function createNote() {
  router.push('/editor')
}

function createFolder() {
  if (!newFolder.value.name.trim()) return

  const folder: Folder = {
    id: createId(),
    name: newFolder.value.name.trim(),
    icon: newFolder.value.icon,
    color: newFolder.value.color,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }

  saveFolder(folder)
  folders.value = getAllFolders().sort((a, b) => b.updatedAt - a.updatedAt)
  closeFolderModal()
}

function closeFolderModal() {
  showFolderModal.value = false
  newFolder.value = { name: '', icon: 'document', color: '#3B82F6' }
}

function openProfileModal() {
  editedUser.value = {
    name: user.value.name,
    email: user.value.email || ''
  }
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
  if (confirm('Are you sure you want to logout? Your notes will remain saved locally.')) {
    saveUser({ name: '' })
    router.push('/')
  }
  showProfileModal.value = false
}
</script>
