<template>
  <div class="min-h-screen flex flex-col">
    <!-- Welcome Screen -->
    <div v-if="!showSetup" class="flex-1 flex flex-col items-center justify-center px-8 relative overflow-hidden">
      <!-- Floating decorative blobs -->
      <div class="absolute top-16 left-8 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-24 right-6 w-48 h-48 bg-purple-300/15 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/3 right-12 w-24 h-24 bg-rose-200/25 rounded-full blur-2xl animate-pulse" style="animation-delay: 0.5s"></div>
      <div class="absolute bottom-1/3 left-12 w-20 h-20 bg-fuchsia-200/20 rounded-full blur-2xl animate-pulse" style="animation-delay: 1.5s"></div>

      <!-- Sparkle decorations -->
      <div class="absolute top-24 right-20 text-pink-300 text-xl animate-bounce" style="animation-delay: 0.3s">&#10022;</div>
      <div class="absolute top-36 left-16 text-purple-300 text-sm animate-bounce" style="animation-delay: 0.8s">&#10022;</div>
      <div class="absolute bottom-32 left-20 text-rose-300 text-lg animate-bounce" style="animation-delay: 1.2s">&#10022;</div>
      <div class="absolute bottom-40 right-16 text-fuchsia-300 text-xs animate-bounce" style="animation-delay: 0.6s">&#10022;</div>
      <div class="absolute top-1/2 left-8 text-pink-200 text-2xl animate-bounce" style="animation-delay: 1.8s">&#10022;</div>

      <div class="relative z-10 text-center max-w-sm">
        <!-- Frosted glass card -->
        <div class="bg-white/60 backdrop-blur-xl rounded-[28px] p-8 shadow-[0_8px_32px_rgba(244,114,182,0.12)] border border-white/50">
          <!-- App icon -->
          <div class="w-20 h-20 rounded-[22px] bg-gradient-to-br from-pink-400 via-rose-400 to-fuchsia-500 flex items-center justify-center mx-auto mb-6 shadow-[0_12px_32px_rgba(244,114,182,0.35)] ring-4 ring-white/50">
            <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>

          <h1 class="text-[36px] font-bold tracking-tight mb-3 leading-tight">
            <span class="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent">SM Notes</span>
          </h1>
          <p class="text-[14px] text-pink-400/80 leading-relaxed mb-8 max-w-[260px] mx-auto">
            Capture ideas, organize thoughts, and never lose a brilliant insight again.
          </p>

          <button
            class="w-full h-12 rounded-2xl bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-500 text-white font-semibold text-[14px] shadow-[0_8px_24px_rgba(244,114,182,0.35)] hover:shadow-[0_12px_32px_rgba(244,114,182,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            @click="startSetup"
          >
            Get started
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <p class="text-[11px] text-pink-300 mt-6">&copy; {{ new Date().getFullYear() }} Stephanie Mensah</p>
        </div>
      </div>
    </div>

    <!-- Setup Screen -->
    <div v-else class="flex-1 flex flex-col relative overflow-hidden">
      <!-- Background decorations -->
      <div class="absolute top-20 left-8 w-32 h-32 bg-pink-200/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-8 w-40 h-40 bg-purple-200/15 rounded-full blur-3xl"></div>

      <!-- Top bar -->
      <UiTopBar custom-back @back="showSetup = false" />

      <div class="relative z-10 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full px-6">
        <!-- Frosted glass card -->
        <div class="bg-white/60 backdrop-blur-xl rounded-[28px] p-8 shadow-[0_8px_32px_rgba(244,114,182,0.12)] border border-white/50">
          <!-- Avatar -->
          <div class="flex justify-center mb-6">
            <div class="relative">
              <UiAvatar
                :name="userName || 'You'"
                :image-url="avatarDataUrl || undefined"
                size="xl"
                class="ring-4 ring-pink-200"
              />
              <label class="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center cursor-pointer hover:from-pink-500 hover:to-rose-500 transition-all shadow-lg ring-2 ring-white">
                <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
                <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
              </label>
            </div>
          </div>

          <div class="text-center mb-6">
            <h2 class="text-[22px] font-bold mb-1">
              <span class="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent">Welcome aboard</span>
            </h2>
            <p class="text-[13px] text-pink-400/70">Let's personalize your experience</p>
          </div>

          <form @submit.prevent="handleSetup" class="space-y-4">
            <UiInput
              v-model="userName"
              label="Your name"
              placeholder="Enter your full name"
              required
            />

            <UiInput
              v-model="userEmail"
              label="Email (optional)"
              type="email"
              placeholder="you@example.com"
            />

            <button
              type="submit"
              class="w-full h-12 rounded-2xl bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-500 text-white font-semibold text-[14px] shadow-[0_8px_24px_rgba(244,114,182,0.35)] hover:shadow-[0_12px_32px_rgba(244,114,182,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-4 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center"
              :disabled="!userName.trim()"
            >
              Start taking notes
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { getUser, saveUser } = useNotes()

const showSetup = ref(false)
const userName = ref('')
const userEmail = ref('')
const avatarDataUrl = ref('')

onMounted(() => {
  const user = getUser()
  if (user && user.name && user.name !== 'Floyd Lawton') {
    router.replace('/notes')
  }
})

function handleAvatarUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    avatarDataUrl.value = reader.result as string
  }
  reader.readAsDataURL(file)
}

function startSetup() {
  showSetup.value = true
}

function handleSetup() {
  if (!userName.value.trim()) return

  saveUser({
    name: userName.value.trim(),
    email: userEmail.value.trim() || undefined,
    avatar: avatarDataUrl.value || undefined,
  })

  router.push('/notes')
}
</script>
