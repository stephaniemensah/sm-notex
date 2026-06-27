<template>
  <div class="flex flex-col flex-1 min-h-0">
    <div v-if="editor" class="flex-shrink-0">
      <!-- Toolbar toggle bar -->
      <div
        class="flex items-center justify-between px-3 py-1.5 border-b border-black/[0.06] cursor-pointer active:bg-black/[0.02]"
        @click="showToolbar = !showToolbar"
      >
        <span class="text-[11px] text-gray-400 font-medium">{{ showToolbar ? 'Formatting' : 'Show toolbar' }}</span>
        <svg
          class="w-4 h-4 text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': showToolbar }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      <!-- Collapsible toolbar -->
      <Transition name="toolbar">
        <div v-if="showToolbar" class="flex items-center gap-0.5 px-2 py-1.5 border-b border-black/[0.06] overflow-x-auto">
          <button
            v-for="action in formattingActions"
            :key="action.label"
            :title="action.label"
            class="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-semibold transition-all duration-100 active:scale-90"
            :class="action.isActive?.() ? 'bg-blue-500/10 text-blue-500' : 'text-gray-400 active:bg-black/[0.04]'"
            @click="action.command"
          >
            {{ action.icon }}
          </button>

          <div class="w-px h-4 bg-black/[0.06] mx-0.5 flex-shrink-0"></div>

          <button
            title="Insert Link"
            class="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 active:bg-black/[0.04] transition-all duration-100"
            @click="insertLink"
          >
            <UiIcon name="link" class="!w-3.5 !h-3.5" />
          </button>

          <button
            title="Insert Image"
            class="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 active:bg-black/[0.04] transition-all duration-100"
            @click="showImageModal = true"
          >
            <UiIcon name="image" class="!w-3.5 !h-3.5" />
          </button>

          <button
            title="Embed YouTube"
            class="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 active:bg-black/[0.04] transition-all duration-100"
            @click="insertYoutube"
          >
            <UiIcon name="youtube" class="!w-3.5 !h-3.5" />
          </button>

          <div class="w-px h-4 bg-black/[0.06] mx-0.5 flex-shrink-0"></div>

          <button
            title="AI Assistant"
            class="flex-shrink-0 h-7 px-2 rounded-lg flex items-center justify-center gap-1 text-[11px] font-semibold bg-gradient-to-r from-violet-500 to-purple-500 text-white active:scale-95 transition-all duration-100"
            @click="handleAi"
          >
            <UiIcon name="sparkles" class="!w-3 !h-3" />
            AI
          </button>
        </div>
      </Transition>
    </div>

    <EditorContent :editor="editor" class="flex-1 overflow-y-auto max-w-none px-4 py-4 focus:outline-none min-h-0" />

    <!-- Image Insert Modal -->
    <UiModal :show="showImageModal" title="Insert Image" @close="showImageModal = false">
      <div class="space-y-3">
        <label class="flex items-center gap-3 p-3 rounded-xl border border-black/[0.06] cursor-pointer active:bg-gray-50 transition-colors">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <UiIcon name="camera" class="!w-5 !h-5 text-blue-500" />
          </div>
          <div>
            <p class="text-[14px] font-medium text-gray-900">Upload from device</p>
            <p class="text-[12px] text-gray-400">JPG, PNG, GIF</p>
          </div>
          <input type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
        </label>

        <div class="p-3 rounded-xl border border-black/[0.06]">
          <p class="text-[13px] font-medium text-gray-700 mb-2">Paste image URL</p>
          <div class="flex gap-2">
            <input
              v-model="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="flex-1 h-10 px-3 rounded-lg bg-gray-50 border border-black/[0.06] text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 transition-colors"
              @keyup.enter="insertImageFromUrl"
            />
            <button
              class="h-10 px-4 rounded-lg bg-gray-900 text-white text-[13px] font-medium active:scale-95 transition-all disabled:opacity-40"
              :disabled="!imageUrl.trim()"
              @click="insertImageFromUrl"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </UiModal>

    <!-- AI Assistant Modal -->
    <UiModal :show="showAiModal" title="AI Assistant" @close="closeAiModal">
      <div class="space-y-3">
        <div v-if="!aiResult">
          <p class="text-[13px] text-gray-500 mb-3">What would you like help with?</p>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="action in aiActions"
              :key="action"
              class="p-3 rounded-xl border border-black/[0.06] text-left text-[13px] text-gray-700 active:bg-gray-50 transition-colors"
              @click="runAiAction(action)"
            >
              {{ action }}
            </button>
          </div>
          <div class="mt-3">
            <textarea
              v-model="aiPrompt"
              placeholder="Or type your own prompt..."
              rows="3"
              class="w-full px-3 py-2 rounded-xl bg-gray-50 border border-black/[0.06] text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 transition-colors resize-none"
            ></textarea>
            <button
              class="w-full mt-2 h-10 rounded-xl bg-gray-900 text-white text-[13px] font-medium active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              :disabled="!aiPrompt.trim() || aiLoading"
              @click="runAiCustom"
            >
              <span v-if="aiLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ aiLoading ? 'Thinking...' : 'Generate' }}
            </button>
          </div>
        </div>

        <div v-else>
          <div class="bg-gray-50 rounded-xl p-3 mb-3 text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">{{ aiResult }}</div>
          <div class="flex gap-2">
            <button
              class="flex-1 h-10 rounded-xl bg-gray-900 text-white text-[13px] font-medium active:scale-95 transition-all"
              @click="insertAiResult"
            >
              Insert
            </button>
            <button
              class="flex-1 h-10 rounded-xl bg-gray-100 text-gray-700 text-[13px] font-medium active:scale-95 transition-all"
              @click="aiResult = ''"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import ImageResize from 'tiptap-extension-resize-image'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps<{
  initialContent?: string
}>()

const emit = defineEmits<{
  update: [content: string]
}>()

const showImageModal = ref(false)
const imageUrl = ref('')
const showToolbar = ref(false)
const showAiModal = ref(false)
const aiPrompt = ref('')
const aiResult = ref('')
const aiLoading = ref(false)

const aiActions = [
  'Improve writing',
  'Fix grammar',
  'Make it shorter',
  'Make it longer',
  'Simplify',
  'Add more detail',
]

const editor = useEditor({
  content: props.initialContent || '',
  extensions: [
    StarterKit,
    Link.configure({ openOnClick: false }),
    ImageResize.configure({
      inline: false,
      allowBase64: true,
      minWidth: 100,
      maxWidth: 800,
    }),
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
      editor.value.commands.setContent(val)
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

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !editor.value) return
  const reader = new FileReader()
  reader.onload = () => {
    editor.value!.chain().focus().setImage({ src: reader.result as string }).run()
    showImageModal.value = false
  }
  reader.readAsDataURL(file)
}

function insertImageFromUrl() {
  if (!imageUrl.value.trim() || !editor.value) return
  editor.value.chain().focus().setImage({ src: imageUrl.value.trim() }).run()
  imageUrl.value = ''
  showImageModal.value = false
}

function insertYoutube() {
  const url = window.prompt('Enter YouTube video URL:')
  if (url && editor.value) {
    editor.value.commands.setYoutubeVideo({ src: url })
  }
}

function handleAi() {
  aiPrompt.value = ''
  aiResult.value = ''
  showAiModal.value = true
}

function closeAiModal() {
  showAiModal.value = false
  aiPrompt.value = ''
  aiResult.value = ''
  aiLoading.value = false
}

function getCurrentContent(): string {
  if (!editor.value) return ''
  return editor.value.getText() || ''
}

async function runAiAction(action: string) {
  const content = getCurrentContent()
  if (!content.trim()) {
    aiPrompt.value = 'Write something about: ' + action
    await runAiCustom()
    return
  }
  aiLoading.value = true
  aiPrompt.value = action
  try {
    const result = await $fetch<{ text: string }>('/api/ai', {
      method: 'POST',
      body: { prompt: action, context: content },
    })
    aiResult.value = result.text
  } catch (e: any) {
    aiResult.value = 'Error: ' + (e.data?.statusMessage || e.message || 'Failed to get AI response')
  } finally {
    aiLoading.value = false
  }
}

async function runAiCustom() {
  if (!aiPrompt.value.trim()) return
  aiLoading.value = true
  const content = getCurrentContent()
  try {
    const result = await $fetch<{ text: string }>('/api/ai', {
      method: 'POST',
      body: { prompt: aiPrompt.value, context: content },
    })
    aiResult.value = result.text
  } catch (e: any) {
    aiResult.value = 'Error: ' + (e.data?.statusMessage || e.message || 'Failed to get AI response')
  } finally {
    aiLoading.value = false
  }
}

function insertAiResult() {
  if (!editor.value || !aiResult.value) return
  editor.value.chain().focus().insertContent(aiResult.value).run()
  closeAiModal()
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
.tiptap {
  outline: none;
  min-height: 300px;
}

.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.tiptap h1 {
  font-size: 2em;
  font-weight: 700;
  margin: 0.5em 0;
}

.tiptap h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin: 0.4em 0;
}

.tiptap ul {
  list-style-type: disc;
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.tiptap ol {
  list-style-type: decimal;
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.tiptap ul li,
.tiptap ol li {
  margin: 0.25em 0;
}

.tiptap blockquote {
  border-left: 3px solid #e5e7eb;
  padding-left: 1em;
  margin: 0.5em 0;
  color: #6b7280;
  font-style: italic;
}

.tiptap pre {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 0.75em 1em;
  margin: 0.5em 0;
  font-family: monospace;
  font-size: 0.9em;
  overflow-x: auto;
}

.tiptap code {
  background: #f3f4f6;
  border-radius: 4px;
  padding: 0.15em 0.3em;
  font-family: monospace;
  font-size: 0.9em;
}

.tiptap pre code {
  background: none;
  padding: 0;
}

.tiptap hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1em 0;
}

.tiptap img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  cursor: grab;
  transition: box-shadow 0.2s, outline 0.15s;
}

.tiptap img:hover {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.tiptap img:active {
  cursor: grabbing;
}

.tiptap img.ProseMirror-selectednode {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

.ProseMirror .resize-handle {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 14px;
  height: 14px;
  background: #3B82F6;
  border-radius: 50%;
  cursor: se-resize;
  border: 2px solid white;
  z-index: 10;
}

.ProseMirror .resize-handle::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
}

.ProseMirror img.ProseMirror-selectednode {
  position: relative;
}

.toolbar-enter-active,
.toolbar-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.toolbar-enter-from,
.toolbar-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  border-bottom-width: 0;
}

.toolbar-enter-to,
.toolbar-leave-from {
  opacity: 1;
  max-height: 60px;
}
</style>
