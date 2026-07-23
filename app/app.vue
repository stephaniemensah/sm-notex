<template>
  <div class="min-h-screen font-sans antialiased text-[#1C1917] relative">
    <!-- Background Image -->
    <div
      class="fixed inset-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1920&q=80&auto=format&fit=crop')"
    ></div>
    <!-- Semi-transparent overlay for readability -->
    <div class="fixed inset-0 bg-white/70 backdrop-blur-[2px]"></div>
    <!-- Content -->
    <div class="relative z-10">
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </div>
  </div>
</template>
