<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white/50 backdrop-blur-xl border-t border-white/30 z-40 safe-area-bottom">
    <div class="max-w-lg mx-auto flex items-center justify-around h-[68px] px-6">
      <button
        class="flex flex-col items-center justify-center gap-1 w-14 py-1 transition-all duration-150"
        :class="active === 'home' ? 'text-pink-600' : 'text-pink-300 hover:text-pink-400'"
        @click="navigate('/notes')"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" :stroke-width="active === 'home' ? 2.5 : 2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <span class="text-[10px] font-semibold">Home</span>
      </button>

      <button
        class="flex flex-col items-center justify-center -mt-5"
        @click="$emit('add')"
      >
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-500 flex items-center justify-center shadow-[0_4px_16px_rgba(244,114,182,0.35)] active:scale-90 transition-transform duration-150">
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
      </button>

      <button
        class="flex flex-col items-center justify-center gap-1 w-14 py-1 transition-all duration-150"
        :class="active === 'profile' ? 'text-pink-600' : 'text-pink-300 hover:text-pink-400'"
        @click="$emit('profile')"
      >
        <UiAvatar :name="userName" :image-url="userAvatar" size="sm" class="!w-6 !h-6" />
        <span class="text-[10px] font-semibold">Profile</span>
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

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
