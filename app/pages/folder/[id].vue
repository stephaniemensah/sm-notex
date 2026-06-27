<template>
  <div class="min-h-screen bg-[#FAF8F5]">
    <div class="max-w-lg mx-auto px-5 pt-12 pb-24">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <NuxtLink to="/notes" class="flex items-center gap-1.5 text-gray-900 active:scale-95 transition-all">
          <UiIcon name="back" />
          <span class="text-[14px] font-medium">Back</span>
        </NuxtLink>
        <div class="flex items-center gap-1">
          <UiButton
            variant="ghost"
            size="xs"
            class="!px-2 !py-2 rounded-xl"
            :class="showSearch ? '!bg-gray-900 !text-white' : '!bg-gray-100'"
            @click="toggleSearch"
          >
            <UiIcon :name="showSearch ? 'close' : 'search'" class="!w-[18px] !h-[18px]" />
          </UiButton>

          <div class="relative" ref="menuRef">
            <UiButton variant="ghost" size="xs" class="!px-2 !py-2 rounded-xl !bg-gray-100" @click.stop="showMenu = !showMenu">
              <UiIcon name="dots" class="!w-[18px] !h-[18px] text-gray-500" />
            </UiButton>
            <div
              v-if="showMenu"
              class="absolute top-full right-0 mt-1 bg-white rounded-xl border border-black/[0.06] py-1 w-40 z-20"
            >
              <UiButton variant="ghost" size="xs" class="w-full !justify-start !px-3 !py-2 !rounded-none text-[13px]" @click="openEditModal">
                <UiIcon name="edit" class="!w-4 !h-4 text-gray-500" />
                Edit Folder
              </UiButton>
              <UiButton variant="ghost" size="xs" class="w-full !justify-start !px-3 !py-2 !rounded-none text-[13px] text-red-500" @click="deleteFolder">
                <UiIcon name="trash" class="!w-4 !h-4" />
                Delete Folder
              </UiButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Bar -->
      <div v-if="showSearch" class="mb-5">
        <UiSearchInput v-model="searchQuery" placeholder="Search in folder..." ref="searchInput" />
      </div>

      <!-- Folder Info -->
      <div v-if="folder" class="mb-6">
        <div class="flex items-center gap-3 mb-1">
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center p-2.5"
            :style="{ backgroundColor: folder.color + '18', color: folder.color }"
          >
            <FolderIcon :name="folder.icon" />
          </div>
          <div>
            <h1 class="text-[22px] font-bold text-gray-900">{{ folder.name }}</h1>
            <div class="flex items-center gap-1.5 text-[12px] text-gray-400 mt-0.5">
              <UiAvatar :name="user.name" :image-url="user.avatar" size="xs" />
              <span class="text-gray-500 font-medium">{{ user.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes list -->
      <div v-if="filteredNotes.length === 0" class="text-center py-16">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UiIcon name="document" class="!w-8 !h-8 text-gray-400" />
        </div>
        <p class="text-[14px] font-medium text-gray-900 mb-1">{{ searchQuery ? 'No notes found' : 'No notes in this folder' }}</p>
        <p class="text-[13px] text-gray-400">{{ searchQuery ? 'Try a different search term.' : 'Tap + to add a note.' }}</p>
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

    <!-- Bottom Nav -->
    <BottomNav active="folders" :user-name="user.name" :user-avatar="user.avatar" @add="createNote" @profile="router.push('/notes')" />

    <!-- Edit Folder Modal -->
    <UiModal :show="showEditModal" title="Edit Folder" @close="showEditModal = false">
      <div class="space-y-3">
        <UiInput
          v-model="editForm.name"
          label="Folder Name"
          placeholder="Folder name"
        />

        <div>
          <label class="block text-[12px] font-medium text-gray-500 mb-1.5">Icon</label>
          <div class="grid grid-cols-6 gap-1.5">
            <button
              v-for="icon in availableIcons"
              :key="icon"
              type="button"
              @click="editForm.icon = icon"
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center p-2 transition-all',
                editForm.icon === icon ? 'bg-gray-900 text-white scale-105' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
              ]"
            >
              <FolderIcon :name="icon" />
            </button>
          </div>
        </div>

        <div>
          <label class="block text-[12px] font-medium text-gray-500 mb-1.5">Color</label>
          <div class="grid grid-cols-8 gap-1.5">
            <button
              v-for="color in availableColors"
              :key="color"
              type="button"
              @click="editForm.color = color"
              :class="['w-8 h-8 rounded-full transition-all', editForm.color === color ? 'ring-2 ring-offset-2 ring-gray-900 scale-105' : '']"
              :style="{ backgroundColor: color }"
            />
          </div>
        </div>

        <UiButton
          variant="primary"
          size="md"
          class="w-full"
          :disabled="!editForm.name.trim()"
          @click="saveEdit"
        >
          Save
        </UiButton>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { Note, Folder } from '~/types/note'

const route = useRoute()
const router = useRouter()
const { getByFolderId, getFolderById, saveFolder, removeFolder, getUser } = useNotes()

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

const folderId = computed(() => route.params.id as string)
const folder = ref<Folder | null>(null)
const notes = ref<Note[]>([])
const showMenu = ref(false)
const showSearch = ref(false)
const showEditModal = ref(false)
const searchQuery = ref('')
const user = ref(getUser())
const menuRef = ref<HTMLElement | null>(null)
const searchInput = ref<{ inputRef: HTMLInputElement | null } | null>(null)

const availableIcons = ['document', 'check', 'book', 'chart', 'library', 'lightbulb', 'target', 'star', 'fire', 'briefcase', 'palette', 'music']
const availableColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

const editForm = ref({ name: '', icon: 'document', color: '#3B82F6' })

const filteredNotes = computed(() => {
  if (!searchQuery.value.trim()) return notes.value
  const q = searchQuery.value.toLowerCase()
  return notes.value.filter(n =>
    n.title?.toLowerCase().includes(q) ||
    n.content?.toLowerCase().includes(q) ||
    n.tags?.some((t: string) => t.toLowerCase().includes(q))
  )
})

function getRotation(index: number): string {
  const rotations = ['-1', '0.5', '-0.5', '1', '-0.8', '0.8', '-0.3', '0.3']
  return rotations[index % rotations.length] || '0'
}

onMounted(() => {
  folder.value = getFolderById(folderId.value)
  if (!folder.value) {
    router.push('/notes')
    return
  }
  notes.value = getByFolderId(folderId.value).sort((a, b) => b.updatedAt - a.updatedAt)
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('keydown', handleKeydown)
})

function handleClickOutside(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    showMenu.value = false
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (showEditModal.value) { showEditModal.value = false; return }
    if (showSearch.value) { showSearch.value = false; searchQuery.value = ''; return }
  }
}

function toggleSearch() {
  showSearch.value = !showSearch.value
  if (!showSearch.value) searchQuery.value = ''
  else nextTick(() => searchInput.value?.inputRef?.focus())
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short',
  })
}

function createNote() {
  router.push(`/editor?folder=${folderId.value}`)
}

function openEditModal() {
  showMenu.value = false
  if (!folder.value) return
  editForm.value = { name: folder.value.name, icon: folder.value.icon, color: folder.value.color }
  showEditModal.value = true
}

function saveEdit() {
  if (!folder.value || !editForm.value.name.trim()) return
  const updated: Folder = {
    ...folder.value,
    name: editForm.value.name.trim(),
    icon: editForm.value.icon,
    color: editForm.value.color,
    updatedAt: Date.now()
  }
  saveFolder(updated)
  folder.value = updated
  showEditModal.value = false
}

function deleteFolder() {
  showMenu.value = false
  if (confirm(`Delete "${folder.value?.name}"? Notes inside will become uncategorized.`)) {
    removeFolder(folderId.value)
    router.push('/notes')
  }
}
</script>
