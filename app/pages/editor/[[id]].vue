<template>
  <div class="h-screen flex flex-col bg-[#f2f2f7]">
    <!-- Top bar -->
    <div class="flex items-center justify-between px-3 py-2 border-b border-black/[0.06] bg-white/70 backdrop-blur-xl flex-shrink-0">
      <UiButton variant="ghost" size="xs" @click="router.back()">
        <UiIcon name="back" />
        <span class="text-[14px]">Back</span>
      </UiButton>

      <UiButton
        v-if="noteId"
        variant="ghost"
        size="xs"
        class="text-red-500"
        @click="handleDelete"
      >
        Delete
      </UiButton>
    </div>

    <!-- Body -->
    <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
      <!-- Title -->
      <div class="px-4 pt-4 pb-2 flex-shrink-0">
        <input
          v-model="title"
          type="text"
          placeholder="Title"
          class="w-full text-[24px] font-bold text-gray-900 border-none outline-none placeholder-gray-300 bg-transparent leading-tight"
          @input="debouncedSave"
        />
      </div>

      <!-- Meta row -->
      <div class="px-4 pb-3 space-y-1 border-b border-black/[0.06]">
        <div class="flex items-center gap-2 text-[12px]">
          <span class="text-gray-400 w-24">Created by</span>
          <div class="flex items-center gap-1">
            <UiAvatar :name="user.name" :image-url="user.avatar" size="xs" />
            <span class="text-gray-900 font-medium">{{ user.name }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 text-[12px]">
          <span class="text-gray-400 w-24">Last Modified</span>
          <span class="text-gray-600">{{ formatDate(updatedAt) }}</span>
        </div>

        <!-- Tags row -->
        <div class="flex items-start gap-2 text-[12px] pt-1">
          <span class="text-gray-400 w-24 pt-0.5">Tags</span>
          <div class="flex flex-wrap gap-1 flex-1">
            <UiBadge
              v-for="(tag, i) in tags"
              :key="i"
              variant="dark"
            >
              {{ tag }}
              <button @click="removeTag(i)" class="ml-0.5 hover:text-red-300 transition-colors">
                <svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </UiBadge>
            <button
              v-if="!showTagInput"
              @click="openTagInput"
              class="inline-flex items-center gap-0.5 text-[11px] px-2 py-0.5 bg-black/[0.04] text-gray-500 rounded-md hover:bg-black/[0.06] transition-colors border border-black/[0.04]"
            >
              <UiIcon name="plus" class="!w-3 !h-3" />
              Add
            </button>
            <input
              v-else
              v-model="newTag"
              ref="tagInput"
              type="text"
              placeholder="Tag..."
              class="text-[11px] px-2 py-0.5 bg-black/[0.03] rounded-md border border-black/[0.06] outline-none focus:border-blue-400 w-20"
              @keyup.enter="addTag"
              @keyup.escape="cancelTagInput"
              @blur="addTag"
            />
          </div>
        </div>

        <!-- Folder row -->
        <div class="flex items-center gap-2 text-[12px] pt-1">
          <span class="text-gray-400 w-24">Folder</span>
          <select
            v-model="selectedFolder"
            @change="debouncedSave"
            class="flex-1 bg-transparent text-gray-900 border-none outline-none text-[12px] cursor-pointer"
          >
            <option :value="null">Uncategorized</option>
            <option v-for="f in folders" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
        </div>
      </div>

      <!-- Rich text editor -->
      <RichTextEditor
        :initial-content="content"
        @update="handleContentUpdate"
      />
    </div>
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

onMounted(() => {
  if (!user.value.name) {
    router.push('/')
    return
  }

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
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag)
    debouncedSave()
  }
  newTag.value = ''
  showTagInput.value = false
}

function cancelTagInput() {
  newTag.value = ''
  showTagInput.value = false
}

function removeTag(i: number) {
  tags.value.splice(i, 1)
  debouncedSave()
}

function handleContentUpdate(html: string) {
  content.value = html
  debouncedSave()
}

let saveTimer: ReturnType<typeof setTimeout> | null = null
function debouncedSave() {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(persistNote, 500)
}

function persistNote() {
  const id = noteId.value || pendingId.value || (pendingId.value = createId())
  const now = Date.now()

  const note: Note = {
    id,
    title: title.value,
    content: content.value,
    tags: [...tags.value],
    folderId: selectedFolder.value,
    createdAt: noteId.value ? createdAt.value : now,
    updatedAt: now,
    createdBy: user.value.name,
  }

  save(note)
  updatedAt.value = now

  if (!noteId.value) {
    router.replace(`/editor/${id}`)
  }
}

function handleDelete() {
  if (noteId.value && confirm('Delete this note?')) {
    remove(noteId.value)
    router.push('/notes')
  }
}
</script>
