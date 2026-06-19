<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
    <div class="max-w-lg text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">SM Notex</h1>
      <p class="text-gray-600 mb-8">
        A simple note-taking app for students. Your notes are saved right in your browser.
      </p>
      <NuxtLink
        to="/notes"
        class="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Start Adding Notes
      </NuxtLink>
    </div>
  </div>
</template>
