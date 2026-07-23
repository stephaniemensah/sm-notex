<template>
  <div class="min-h-screen">
    <!-- Top bar -->
    <UiTopBar back-to="/notes">
      <button
        class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
        :class="showSearch ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white' : 'bg-white/50 backdrop-blur-sm text-pink-400 hover:bg-white/70 border border-white/30'"
        @click="toggleSearch"
      >
        <svg v-if="!showSearch" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="relative" ref="menuRef">
        <button
          class="w-8 h-8 rounded-lg bg-white/50 backdrop-blur-sm flex items-center justify-center text-pink-400 hover:bg-white/70 transition-all border border-white/30"
          @click.stop="showMenu = !showMenu"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
        </button>
        <Transition name="scale">
          <div
            v-if="showMenu"
            class="absolute top-full right-0 mt-2 bg-white/60 backdrop-blur-xl rounded-xl border border-white/50 py-1 w-40 z-20 shadow-[0_4px_16px_rgba(244,114,182,0.15)]"
          >
            <button
              class="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-pink-600 hover:bg-pink-50 transition-colors"
              @click="openEditModal"
            >
              <svg class="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit folder
            </button>
            <button
              class="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-pink-500 hover:bg-pink-50 transition-colors"
              @click="deleteFolder"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Delete folder
            </button>
          </div>
        </Transition>
      </div>
    </UiTopBar>

    <div class="max-w-lg mx-auto px-5 pt-6 pb-28">
      <!-- Search -->
      <div v-if="showSearch" class="mb-5">
        <UiSearchInput v-model="searchQuery" placeholder="Search in folder..." ref="searchInput" />
      </div>

      <!-- Folder Info -->
      <div v-if="folder" class="mb-8">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center p-2.5"
            :style="{ backgroundColor: folder.color + '14', color: folder.color }"
          >
            <FolderIcon :name="folder.icon" />
          </div>
          <div>
            <h1 class="text-[22px] font-bold text-[#1C1917] tracking-tight">{{ folder.name }}</h1>
            <p class="text-[12px] text-pink-400 mt-0.5">{{ notes.length }} {{ notes.length === 1 ? 'note' : 'notes' }}</p>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="filteredNotes.length === 0">
        <EmptyState
          icon="document"
          :title="searchQuery ? 'No notes found' : 'No notes in this folder'"
          :description="searchQuery ? 'Try a different search term.' : 'Tap the + button to add a note.'"
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

    <!-- Bottom Nav -->
    <BottomNav active="home" :user-name="user.name" :user-avatar="user.avatar" @add="createNote" @profile="router.push('/notes')" />

    <!-- Edit Modal -->
    <UiModal :show="showEditModal" title="Edit Folder" @close="showEditModal = false">
      <div class="space-y-4">
        <UiInput v-model="editForm.name" label="Folder name" placeholder="Folder name" />

        <div>
          <label class="block text-[11px] font-semibold text-[#78716C] uppercase tracking-wider mb-2">Icon</label>
          <div class="grid grid-cols-6 gap-1.5">
            <button
              v-for="icon in availableIcons"
              :key="icon"
              @click="editForm.icon = icon"
              :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center p-2 transition-all duration-150',
                editForm.icon === icon ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md' : 'bg-white/50 text-pink-400 hover:bg-white/70'
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
              @click="editForm.color = color"
              :class="['w-8 h-8 rounded-lg transition-all', editForm.color === color ? 'ring-2 ring-offset-2 ring-pink-400 scale-110' : 'hover:scale-105']"
              :style="{ backgroundColor: color }"
            />
          </div>
        </div>

        <UiButton size="md" class="w-full" :disabled="!editForm.name.trim()" @click="saveEdit">
          Save changes
        </UiButton>
      </div>
    </UiModal>

    <!-- Delete Confirm -->
    <UiConfirmDialog
      :show="showDeleteConfirm"
      title="Delete folder"
      :message="deleteMessage"
      @confirm="confirmDeleteFolder"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { Note, Folder } from '~/types/note'

const route = useRoute()
const router = useRouter()
const { getByFolderId, getFolderById, saveFolder, removeFolder, getUser } = useNotes()

const folderId = computed(() => route.params.id as string)
const folder = ref<Folder | null>(null)
const notes = ref<Note[]>([])
const showMenu = ref(false)
const showSearch = ref(false)
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const searchQuery = ref('')
const user = ref(getUser())
const menuRef = ref<HTMLElement | null>(null)
const searchInput = ref<{ inputRef: HTMLInputElement | null } | null>(null)

const availableIcons = ['document', 'check', 'book', 'chart', 'library', 'lightbulb', 'target', 'star', 'fire', 'briefcase', 'palette', 'music']
const availableColors = ['#7C3AED', '#2563EB', '#059669', '#D97706', '#DC2626', '#DB2777', '#0891B2', '#EA580C']
const editForm = ref({ name: '', icon: 'document', color: '#7C3AED' })

const deleteMessage = computed(() =>
  `This will delete "${folder.value?.name}" and move all its notes to uncategorized.`
)

const filteredNotes = computed(() => {
  if (!searchQuery.value.trim()) return notes.value
  const q = searchQuery.value.toLowerCase()
  return notes.value.filter(n =>
    n.title?.toLowerCase().includes(q) ||
    n.content?.toLowerCase().includes(q) ||
    n.tags?.some((t: string) => t.toLowerCase().includes(q))
  )
})

onMounted(() => {
  folder.value = getFolderById(folderId.value)
  if (!folder.value) { router.push('/notes'); return }
  notes.value = getByFolderId(folderId.value).sort((a, b) => b.updatedAt - a.updatedAt)
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) showMenu.value = false
}

function toggleSearch() {
  showSearch.value = !showSearch.value
  if (!showSearch.value) searchQuery.value = ''
  else nextTick(() => searchInput.value?.inputRef?.focus())
}

function createNote() { router.push(`/editor?folder=${folderId.value}`) }

function openEditModal() {
  showMenu.value = false
  if (!folder.value) return
  editForm.value = { name: folder.value.name, icon: folder.value.icon, color: folder.value.color }
  showEditModal.value = true
}

function saveEdit() {
  if (!folder.value || !editForm.value.name.trim()) return
  const updated: Folder = { ...folder.value, name: editForm.value.name.trim(), icon: editForm.value.icon, color: editForm.value.color, updatedAt: Date.now() }
  saveFolder(updated)
  folder.value = updated
  showEditModal.value = false
}

function deleteFolder() { showMenu.value = false; showDeleteConfirm.value = true }

function confirmDeleteFolder() {
  removeFolder(folderId.value)
  showDeleteConfirm.value = false
  router.push('/notes')
}
</script>
