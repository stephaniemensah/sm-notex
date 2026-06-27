<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-black/[0.06] z-40">
    <div class="max-w-lg mx-auto flex items-center justify-around h-14">
      <button
        class="flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-all"
        :class="active === 'home' ? 'text-gray-900' : 'text-gray-400'"
        @click="navigate('/notes')"
      >
        <UiIcon name="home" class="!w-5 !h-5" />
        <span class="text-[10px] font-medium">Home</span>
      </button>

      <button
        class="flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-all text-gray-400"
        @click="$emit('add')"
      >
        <div class="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center -mt-4">
          <UiIcon name="plus" class="!w-5 !h-5 text-white" />
        </div>
      </button>

      <button
        class="flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-all"
        :class="active === 'profile' ? 'text-gray-900' : 'text-gray-400'"
        @click="$emit('profile')"
      >
        <UiAvatar :name="userName" :image-url="userAvatar" size="sm" class="!w-6 !h-6" />
        <span class="text-[10px] font-medium">Profile</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
const router = useRouter()

defineProps<{
  active?: string
  userName: string
  userAvatar?: string
}>()

defineEmits<{
  add: []
  profile: []
}>()

function navigate(path: string) {
  router.replace(path)
}
</script>
