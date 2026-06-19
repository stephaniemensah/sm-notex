<template>
  <div class="flex flex-col h-full">
    <div v-if="editor" class="flex items-center gap-0.5 px-3 py-2.5 border-b border-gray-100 overflow-x-auto flex-shrink-0">
      <button
        v-for="action in formattingActions"
        :key="action.label"
        :title="action.label"
        class="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-semibold transition-all duration-150"
        :class="action.isActive?.() ? 'bg-blue-50 text-blue-500' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'"
        @click="action.command"
      >
        {{ action.icon }}
      </button>

      <div class="w-px h-5 bg-gray-200 mx-1 flex-shrink-0"></div>

      <button
        title="Insert Link"
        class="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-150"
        @click="insertLink"
      >
        <svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
      </button>

      <button
        title="Insert Image"
        class="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-150"
        @click="insertImage"
      >
        <svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
      </button>

      <button
        title="Embed YouTube"
        class="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-150"
        @click="insertYoutube"
      >
        <svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg>
      </button>

      <div class="w-px h-5 bg-gray-200 mx-1 flex-shrink-0"></div>

      <button
        title="AI Assistant"
        class="flex-shrink-0 h-9 px-3 rounded-xl flex items-center justify-center gap-1.5 text-[13px] font-semibold bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 active:scale-95 transition-all duration-150 shadow-sm shadow-purple-500/20"
        @click="handleAi"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
        AI
      </button>
    </div>

    <EditorContent :editor="editor" class="flex-1 overflow-y-auto prose prose-sm max-w-none p-6 focus:outline-none" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps<{
  initialContent?: string
}>()

const emit = defineEmits<{
  update: [content: string]
}>()

const editor = useEditor({
  content: props.initialContent || '',
  extensions: [
    StarterKit,
    Link.configure({ openOnClick: false }),
    Image,
    Youtube,
    Placeholder.configure({ placeholder: 'Start writing...' }),
  ],
  onUpdate: ({ editor }) => {
    emit('update', editor.getHTML())
  },
})

watch(() => props.initialContent, (val) => {
  if (editor.value && val !== undefined) {
    const current = editor.value.getHTML()
    if (val !== current) {
      editor.value.commands.setContent(val, false)
    }
  }
})

const formattingActions = computed(() => {
  if (!editor.value) return []
  const e = editor.value
  return [
    { label: 'Bold', icon: 'B', isActive: () => e.isActive('bold'), command: () => e.chain().focus().toggleBold().run() },
    { label: 'Italic', icon: 'I', isActive: () => e.isActive('italic'), command: () => e.chain().focus().toggleItalic().run() },
    { label: 'Strike', icon: 'S', isActive: () => e.isActive('strike'), command: () => e.chain().focus().toggleStrike().run() },
    { label: 'Heading 1', icon: 'H1', isActive: () => e.isActive('heading', { level: 1 }), command: () => e.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: 'Heading 2', icon: 'H2', isActive: () => e.isActive('heading', { level: 2 }), command: () => e.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'Bullet List', icon: 'UL', isActive: () => e.isActive('bulletList'), command: () => e.chain().focus().toggleBulletList().run() },
    { label: 'Ordered List', icon: 'OL', isActive: () => e.isActive('orderedList'), command: () => e.chain().focus().toggleOrderedList().run() },
    { label: 'Blockquote', icon: '"', isActive: () => e.isActive('blockquote'), command: () => e.chain().focus().toggleBlockquote().run() },
    { label: 'Code', icon: '<>', isActive: () => e.isActive('codeBlock'), command: () => e.chain().focus().toggleCodeBlock().run() },
    { label: 'Horizontal Rule', icon: '---', isActive: () => false, command: () => e.chain().focus().setHorizontalRule().run() },
  ]
})

function insertLink() {
  const url = window.prompt('Enter URL:')
  if (url && editor.value) {
    editor.value.chain().focus().setLink({ href: url }).run()
  }
}

function insertImage() {
  const url = window.prompt('Enter image URL:')
  if (url && editor.value) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

function insertYoutube() {
  const url = window.prompt('Enter YouTube video URL:')
  if (url && editor.value) {
    editor.value.commands.setYoutubeVideo({ src: url })
  }
}

function handleAi() {
  alert('AI assistant coming soon!')
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>
