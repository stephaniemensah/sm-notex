<template>
  <div class="min-h-screen bg-[#f2f2f7]">
    <div class="max-w-lg mx-auto px-5 pt-14 pb-24">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-[34px] font-bold text-gray-900 tracking-tight">My Notes</h1>
        <NuxtLink
          to="/editor"
          class="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all duration-200 shadow-sm shadow-blue-500/20"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </NuxtLink>
      </div>

      <div v-if="notes.length === 0" class="text-center py-24">
        <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p class="text-[17px] font-medium text-gray-900 mb-1">No notes yet</p>
        <p class="text-[15px] text-gray-400">Tap + to create your first note.</p>
      </div>

      <div v-else class="space-y-3">
        <NuxtLink
          v-for="note in notes"
          :key="note.id"
          :to="`/editor/${note.id}`"
          class="block bg-white rounded-2xl p-4 hover:shadow-md active:scale-[0.98] transition-all duration-200"
        >
          <div class="text-gray-900 text-[15px] leading-relaxed line-clamp-2" v-html="note.content || '<span class=\'text-gray-300 italic\'>Empty note</span>'"></div>
          <p class="text-[13px] text-gray-300 mt-3">
            {{ formatDate(note.updatedAt) }}
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
