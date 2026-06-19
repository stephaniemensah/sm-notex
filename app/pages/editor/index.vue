<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between mb-6">
        <NuxtLink to="/notes" class="text-sm text-gray-500 hover:text-gray-700">
          Back to Notes
        </NuxtLink>
        <button
          v-if="isEditing"
          class="text-sm text-red-500 hover:text-red-700 font-medium"
          @click="handleDelete"
        >
          Delete
        </button>
      </div>

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
const { getById, save, remove, createId } = useNotes()

const noteId = computed(() => route.params.id as string | undefined)
const isEditing = computed(() => !!noteId.value)
const initialContent = ref('')

onMounted(() => {
  if (noteId.value) {
    const note = getById(noteId.value)
    if (note) {
      initialContent.value = note.content
    } else {
      router.replace('/notes')
    }
  }
})

function handleUpdate(content: string) {
  const id = noteId.value || createId()
  save({ id, content, createdAt: Date.now(), updatedAt: Date.now() })

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
