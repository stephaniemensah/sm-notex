<template>
  <div class="min-h-screen bg-[#f2f2f7] flex flex-col items-center justify-center px-6">
    <div class="text-center max-w-sm">
      <div class="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-[22px] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/20">
        <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      </div>

      <h1 class="text-[34px] font-bold text-gray-900 tracking-tight mb-2">SM Notex</h1>
      <p class="text-[17px] text-gray-500 leading-relaxed mb-10">
        Your notes, saved right in your browser. Simple, fast, and always with you.
      </p>

      <NuxtLink
        to="/notes"
        class="block w-full bg-blue-500 text-white text-[17px] font-semibold py-3.5 rounded-2xl hover:bg-blue-600 active:scale-[0.98] transition-all duration-200 shadow-sm"
      >
        Start Adding Notes
      </NuxtLink>
    </div>
  </div>
</template>
