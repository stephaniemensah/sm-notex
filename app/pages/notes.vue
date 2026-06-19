<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-gray-900">My Notes</h1>
        <NuxtLink
          to="/editor"
          class="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          + New Note
        </NuxtLink>
      </div>

      <div v-if="notes.length === 0" class="text-center py-20 text-gray-500">
        <p class="text-lg mb-2">No notes yet</p>
        <p class="text-sm">Click "New Note" to get started.</p>
      </div>

      <div v-else class="grid gap-4">
        <NuxtLink
          v-for="note in notes"
          :key="note.id"
          :to="`/editor/${note.id}`"
          class="block border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <div class="text-gray-900 line-clamp-2" v-html="note.content || '<em>Empty note</em>'"></div>
          <p class="text-xs text-gray-400 mt-3">
            Last updated {{ formatDate(note.updatedAt) }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const notes = ref<Note[]>([])
const { getAll } = useNotes()

onMounted(() => {
  notes.value = getAll().sort((a, b) => b.updatedAt - a.updatedAt)
})

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>
