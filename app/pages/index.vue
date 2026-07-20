<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Welcome Screen -->
    <div v-if="!showSetup" class="flex-1 flex flex-col items-center justify-center px-8 relative overflow-hidden">
      <!-- Subtle gradient background -->
      <div class="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-amber-50/30"></div>

      <!-- Decorative elements -->
      <div class="absolute top-20 left-10 w-32 h-32 bg-violet-100/40 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-40 h-40 bg-amber-100/30 rounded-full blur-3xl"></div>

      <div class="relative z-10 text-center max-w-sm">
        <!-- App icon -->
        <div class="w-16 h-16 rounded-[18px] bg-[#1C1917] flex items-center justify-center mx-auto mb-8 shadow-[0_8px_24px_rgba(28,25,23,0.15)]">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>

        <h1 class="text-[32px] font-bold text-[#1C1917] tracking-tight mb-3 leading-tight">
          SM Notes
        </h1>
        <p class="text-[14px] text-[#78716C] leading-relaxed mb-10 max-w-[260px] mx-auto">
          Capture ideas, organize thoughts, and never lose a brilliant insight again.
        </p>

        <UiButton
          size="lg"
          class="w-full"
          @click="startSetup"
        >
          Get started
          <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </UiButton>

        <p class="text-[11px] text-[#D6D3D1] mt-8">&copy; {{ new Date().getFullYear() }} Stephanie Mensah</p>
      </div>
    </div>

    <!-- Setup Screen -->
    <div v-else class="flex-1 flex flex-col px-6 pt-12 pb-8">
      <button
        class="flex items-center gap-1 text-[#78716C] hover:text-[#1C1917] transition-colors mb-8 w-fit"
        @click="showSetup = false"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        <span class="text-[13px] font-medium">Back</span>
      </button>

      <div class="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <!-- Avatar -->
        <div class="flex justify-center mb-8">
          <div class="relative">
            <UiAvatar
              :name="userName || 'You'"
              :image-url="avatarDataUrl || undefined"
              size="xl"
              class="ring-4 ring-[#F5F5F4]"
            />
            <label class="absolute -bottom-1 -right-1 w-8 h-8 bg-[#1C1917] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#292524] transition-colors shadow-lg ring-2 ring-white">
              <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
              <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
            </label>
          </div>
        </div>

        <div class="text-center mb-8">
          <h2 class="text-[22px] font-bold text-[#1C1917] mb-1">Welcome aboard</h2>
          <p class="text-[13px] text-[#78716C]">Let's personalize your experience</p>
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

          <UiButton
            type="submit"
            size="lg"
            class="w-full mt-6"
            :disabled="!userName.trim()"
          >
            Start taking notes
          </UiButton>
        </form>
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
