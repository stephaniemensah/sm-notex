<template>
  <div>
    <div v-if="editor" class="flex flex-wrap items-center gap-1 border border-gray-200 rounded-t-lg px-3 py-2 bg-gray-50">
      <button
        v-for="action in formattingActions"
        :key="action.label"
        :title="action.label"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors"
        :class="{ 'bg-gray-200 text-blue-600': action.isActive?.() }"
        @click="action.command"
      >
        <span class="text-sm font-medium" v-html="action.icon"></span>
      </button>

      <div class="w-px h-5 bg-gray-300 mx-1"></div>

      <button
        title="Insert Link"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors"
        @click="insertLink"
      >
        <span class="text-sm font-medium">Link</span>
      </button>

      <button
        title="Insert Image"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors"
        @click="insertImage"
      >
        <span class="text-sm font-medium">Image</span>
      </button>

      <button
        title="Embed YouTube"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors"
        @click="insertYoutube"
      >
        <span class="text-sm font-medium">YT</span>
      </button>

      <div class="w-px h-5 bg-gray-300 mx-1"></div>

      <button
        title="AI Assistant"
        class="p-1.5 rounded hover:bg-blue-100 text-blue-600 transition-colors font-semibold"
        @click="handleAi"
      >
        <span class="text-sm">AI</span>
      </button>
    </div>

    <EditorContent :editor="editor" class="prose prose-sm max-w-none border border-t-0 border-gray-200 rounded-b-lg p-4 min-h-[400px] focus:outline-none" />
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
    { label: 'Blockquote', icon: 'BQ', isActive: () => e.isActive('blockquote'), command: () => e.chain().focus().toggleBlockquote().run() },
    { label: 'Code', icon: 'CD', isActive: () => e.isActive('codeBlock'), command: () => e.chain().focus().toggleCodeBlock().run() },
    { label: 'Horizontal Rule', icon: 'HR', isActive: () => false, command: () => e.chain().focus().setHorizontalRule().run() },
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
