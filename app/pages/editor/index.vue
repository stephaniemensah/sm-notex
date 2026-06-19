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
        v-if="isEditing"
        class="text-[15px] text-red-500 font-medium active:scale-95 transition-all"
        @click="handleDelete"
      >
        Delete
      </button>
    </div>

    <div class="flex-1 overflow-y-auto">
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
