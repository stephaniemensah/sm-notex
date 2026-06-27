<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden bg-[#F5E6A3]">
    <!-- Paper lines -->
    <div class="absolute inset-0">
      <div
        v-for="i in 40"
        :key="i"
        class="absolute left-0 right-0 h-px bg-[#E8D48B]/60"
        :style="{ top: `${i * 28}px` }"
      ></div>
    </div>

    <!-- Red margin line -->
    <div class="absolute top-0 bottom-0 left-[72px] w-px bg-red-300/50"></div>

    <!-- Spiral binding holes -->
    <div class="absolute left-0 top-0 bottom-0 w-[72px] flex flex-col justify-start pt-4 gap-[28px]">
      <div v-for="i in 20" :key="i" class="w-5 h-5 rounded-full bg-white/60 border border-[#D4C07A] ml-3"></div>
    </div>

    <!-- Diagonal NOTES text -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
      <div class="relative w-full h-full">
        <span
          v-for="i in 4"
          :key="i"
          class="absolute font-black italic text-[120px] leading-none tracking-tighter text-[#C4A84D]/30"
          :style="{
            top: `${10 + i * 18}%`,
            left: '50%',
            transform: `translateX(-50%) rotate(-${15 + i * 2}deg)`,
            fontSize: `${100 + i * 15}px`,
          }"
        >NOTES</span>
      </div>
    </div>

    <!-- Welcome Screen -->
    <div v-if="!showSetup" class="relative z-10 flex flex-col items-center justify-end min-h-screen pb-16 px-8">
      <h1 class="text-[36px] font-bold text-gray-900 tracking-tight mb-2 text-center">SM NOTES</h1>
      <p class="text-[14px] text-gray-500 mb-6 text-center">Simple, fast, always with you.</p>

      <button
        class="h-12 px-8 rounded-full bg-gray-900 text-white font-semibold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition-all duration-150 mb-6"
        @click="startSetup"
      >
        Get Started
      </button>

      <p class="text-[11px] text-gray-400 text-center">&copy; {{ new Date().getFullYear() }} Stephanie Mensah</p>
    </div>

    <!-- User Setup Screen -->
    <div v-else class="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
      <button class="mb-6 text-gray-700 flex items-center gap-1.5 active:scale-95 transition-all" @click="showSetup = false">
        <UiIcon name="back" class="!w-4 !h-4" />
        <span class="text-[14px]">Back</span>
      </button>

      <div class="w-full max-w-sm bg-white rounded-3xl p-6">
        <div class="text-center mb-5">
          <div class="relative inline-block mb-3">
            <UiAvatar
              :name="userName || 'You'"
              :image-url="avatarDataUrl || undefined"
              size="lg"
              class="mx-auto"
            />
            <label class="absolute -bottom-0.5 -right-0.5 w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center cursor-pointer active:bg-gray-800 transition-colors ring-2 ring-white">
              <UiIcon name="camera" class="!w-3.5 !h-3.5 text-white" />
              <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
            </label>
          </div>

          <h2 class="text-[20px] font-bold text-gray-900 mb-1">Welcome!</h2>
          <p class="text-[13px] text-gray-500">Let's set up your profile</p>
        </div>

        <form @submit.prevent="handleSetup" class="space-y-3">
          <UiInput
            v-model="userName"
            label="Your Name"
            placeholder="Enter your name"
            required
          />

          <UiInput
            v-model="userEmail"
            label="Email (Optional)"
            type="email"
            placeholder="your@email.com"
          />

          <UiButton
            type="submit"
            variant="primary"
            size="lg"
            class="w-full mt-1"
            :disabled="!userName.trim()"
          >
            Start Taking Notes
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
