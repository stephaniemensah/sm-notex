<template>
  <div class="h-screen flex flex-col">
    <!-- Top bar -->
    <UiTopBar>
      <span v-if="saveStatus" class="text-[10px] text-pink-400 font-medium transition-opacity" :class="saveStatus === 'Saving...' ? 'opacity-100' : 'opacity-60'">
        {{ saveStatus }}
      </span>
      <button
        v-if="noteId"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-pink-500 hover:bg-pink-50 transition-all active:scale-95"
        @click="showDeleteConfirm = true"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>
    </UiTopBar>

    <!-- Body -->
    <div class="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div class="max-w-2xl mx-auto w-full px-6 py-8">
        <!-- Title -->
        <input
          v-model="title"
          type="text"
          placeholder="Untitled"
          class="w-full text-[28px] font-bold text-[#1C1917] border-none outline-none placeholder-[#D6D3D1] bg-transparent leading-tight tracking-tight mb-6"
          @input="debouncedSave"
        />

        <!-- Meta -->
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-[#A8A29E] mb-8 pb-6 border-b border-[#F5F5F4]">
          <div class="flex items-center gap-1.5">
            <UiAvatar :name="user.name" :image-url="user.avatar" size="xs" />
            <span class="font-medium text-[#78716C]">{{ user.name }}</span>
          </div>
          <span>{{ formatDate(updatedAt) }}</span>

          <!-- Folder select -->
          <select
            v-model="selectedFolder"
            @change="debouncedSave"
            class="bg-white/50 backdrop-blur-sm text-pink-500 rounded-lg px-2 py-1 border border-white/30 outline-none text-[11px] font-medium cursor-pointer"
          >
            <option :value="null">No folder</option>
            <option v-for="f in folders" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap items-center gap-1.5 mb-8">
          <span
            v-for="(tag, i) in tags"
            :key="i"
            class="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/50 backdrop-blur-sm text-pink-500 border border-white/30"
          >
            {{ tag }}
            <button @click="removeTag(i)" class="hover:text-pink-600 transition-colors ml-0.5">
              <svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
          <button
            v-if="!showTagInput"
            @click="openTagInput"
            class="inline-flex items-center gap-0.5 text-[10px] font-medium px-2 py-0.5 rounded-md border border-dashed border-[#E7E5E4] text-[#A8A29E] hover:border-[#D6D3D1] hover:text-[#78716C] transition-colors"
          >
            <svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add tag
          </button>
          <input
            v-else
            v-model="newTag"
            ref="tagInput"
            type="text"
            placeholder="Tag..."
            class="text-[10px] px-2 py-0.5 rounded-md border border-[#E7E5E4] outline-none focus:border-[#7C3AED] w-20 font-medium"
            @keyup.enter="addTag"
            @keyup.escape="cancelTagInput"
            @blur="addTag"
          />
        </div>

        <!-- Editor -->
        <RichTextEditor
          :initial-content="content"
          @update="handleContentUpdate"
        />
      </div>
    </div>

    <!-- Delete Confirm -->
    <UiConfirmDialog
      :show="showDeleteConfirm"
      title="Delete note"
      message="This action cannot be undone. The note will be permanently removed."
      @confirm="handleDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { Note, Folder } from '~/types/note'

const route = useRoute()
const router = useRouter()
const { getById, save, remove, createId, getAllFolders, getUser } = useNotes()

const noteId = computed(() => route.params.id as string | undefined)

const title = ref('')
const content = ref('')
const tags = ref<string[]>([])
const selectedFolder = ref<string | null>(null)
const folders = ref<Folder[]>([])
const showTagInput = ref(false)
const newTag = ref('')
const tagInput = ref<HTMLInputElement | null>(null)
const updatedAt = ref(Date.now())
const createdAt = ref(Date.now())
const user = ref(getUser())
const pendingId = ref('')
const showDeleteConfirm = ref(false)
const saveStatus = ref('')

onMounted(() => {
  if (!user.value.name) { router.push('/'); return }
  folders.value = getAllFolders()

  const folderQuery = route.query.folder as string | undefined
  if (folderQuery) selectedFolder.value = folderQuery

  if (noteId.value) {
    const note = getById(noteId.value)
    if (note) {
      title.value = note.title || ''
      content.value = note.content || ''
      tags.value = note.tags || []
      selectedFolder.value = note.folderId ?? null
      updatedAt.value = note.updatedAt
      createdAt.value = note.createdAt
    } else {
      router.replace('/notes')
    }
  }
})

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

function openTagInput() {
  showTagInput.value = true
  nextTick(() => tagInput.value?.focus())
}

function addTag() {
  const tag = newTag.value.trim()
  if (tag && !tags.value.includes(tag)) { tags.value.push(tag); debouncedSave() }
  newTag.value = ''
  showTagInput.value = false
}

function cancelTagInput() { newTag.value = ''; showTagInput.value = false }

function removeTag(i: number) { tags.value.splice(i, 1); debouncedSave() }

function handleContentUpdate(html: string) { content.value = html; debouncedSave() }

let saveTimer: ReturnType<typeof setTimeout> | null = null
function debouncedSave() {
  saveStatus.value = 'Saving...'
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => { persistNote(); saveStatus.value = 'Saved'; setTimeout(() => { saveStatus.value = '' }, 1500) }, 500)
}

function persistNote() {
  const id = noteId.value || pendingId.value || (pendingId.value = createId())
  const now = Date.now()
  const note: Note = {
    id, title: title.value, content: content.value, tags: [...tags.value],
    folderId: selectedFolder.value, createdAt: noteId.value ? createdAt.value : now,
    updatedAt: now, createdBy: user.value.name,
  }
  save(note)
  updatedAt.value = now
  if (!noteId.value) router.replace(`/editor/${id}`)
}

function handleDelete() {
  if (noteId.value) { remove(noteId.value); router.push('/notes') }
  showDeleteConfirm.value = false
}
</script>
