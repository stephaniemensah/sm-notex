<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-end justify-center"
      @click.self="$emit('close')"
    >
      <div class="absolute inset-0 bg-black/40 transition-opacity" @click="$emit('close')"></div>

      <div
        ref="sheetRef"
        class="relative bg-white/90 backdrop-blur-2xl w-full max-w-lg rounded-t-3xl z-10 touch-pan-y"
        :class="{ 'transition-transform duration-300': !isDragging }"
        :style="isDragging ? { transform: `translateY(${dragY}px)` } : {}"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend="onTouchEnd"
      >
        <!-- Drag handle -->
        <div class="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing" @mousedown="onDragStart">
          <div class="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <!-- Title -->
        <div v-if="title" class="flex items-center justify-between px-5 pb-3">
          <h3 class="text-[17px] font-semibold text-gray-900">{{ title }}</h3>
          <button
            class="w-7 h-7 flex items-center justify-center rounded-full bg-black/[0.04] active:bg-black/[0.08] transition-colors"
            @click="$emit('close')"
          >
            <UiIcon name="close" class="!w-4 !h-4 text-gray-500" />
          </button>
        </div>

        <!-- Content -->
        <div class="px-5 pb-8 max-h-[70vh] overflow-y-auto">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  title?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const sheetRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const dragY = ref(0)
const startY = ref(0)

function close() {
  emit('close')
}

function onTouchStart(e: TouchEvent) {
  if (!e.touches[0]) return
  startY.value = e.touches[0].clientY
  isDragging.value = true
}

function onTouchMove(e: TouchEvent) {
  if (!e.touches[0]) return
  const delta = e.touches[0].clientY - startY.value
  if (delta > 0) {
    dragY.value = delta
  }
}

function onTouchEnd() {
  isDragging.value = false
  if (dragY.value > 100) {
    dragY.value = 0
    close()
  } else {
    dragY.value = 0
  }
}

function onDragStart(e: MouseEvent) {
  startY.value = e.clientY
  isDragging.value = true
  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
}

function onDragMove(e: MouseEvent) {
  const delta = e.clientY - startY.value
  if (delta > 0) {
    dragY.value = delta
  }
}

function onDragEnd() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
  if (dragY.value > 100) {
    dragY.value = 0
    close()
  } else {
    dragY.value = 0
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
})
</script>
