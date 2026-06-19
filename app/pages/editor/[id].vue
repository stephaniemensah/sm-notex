<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between mb-6">
        <NuxtLink to="/notes" class="text-sm text-gray-500 hover:text-gray-700">
          Back to Notes
        </NuxtLink>
        <button
          class="text-sm text-red-500 hover:text-red-700 font-medium"
          @click="handleDelete"
        >
          Delete
        </button>
      </div>

      <RichTextEditor
        v-if="loaded"
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
