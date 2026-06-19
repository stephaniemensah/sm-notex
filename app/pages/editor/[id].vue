<template>
  <div class="h-screen flex flex-col bg-white">
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
      <NuxtLink to="/notes" class="text-[17px] text-blue-500 font-medium active:scale-95 transition-all">
        <svg class="w-5 h-5 inline-block mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Notes
      </NuxtLink>
      <button
        class="text-[15px] text-red-500 font-medium active:scale-95 transition-all"
        @click="handleDelete"
      >
        Delete
      </button>
    </div>

    <div v-if="loaded" class="flex-1 overflow-y-auto">
      <RichTextEditor
        :initial-content="initialContent"
        @update="handleUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { getById, save, remove } = useNotes()

const noteId = route.params.id as string
const loaded = ref(false)
const initialContent = ref('')

onMounted(() => {
  const note = getById(noteId)
  if (note) {
    initialContent.value = note.content
    loaded.value = true
  } else {
    router.replace('/notes')
  }
})

function handleUpdate(content: string) {
  const note = getById(noteId)
  if (note) {
    save({ ...note, content, updatedAt: Date.now() })
  }
}

function handleDelete() {
  if (confirm('Delete this note?')) {
    remove(noteId)
    router.push('/notes')
  }
}
</script>
