<template>
  <div class="flex flex-col flex-1 min-h-0">
    <div v-if="editor" class="flex-shrink-0 mb-4">
      <!-- Toolbar -->
      <div class="flex items-center gap-0.5 p-1 bg-white/50 backdrop-blur-sm rounded-xl overflow-x-auto border border-white/30">
        <button
          v-for="action in formattingActions"
          :key="action.label"
          :title="action.label"
          class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-semibold transition-all duration-100 active:scale-90"
          :class="action.isActive?.() ? 'bg-pink-50 text-pink-600 shadow-[0_1px_2px_rgba(244,114,182,0.15)]' : 'text-pink-400 hover:bg-pink-50/60'"
          @click="action.command"
        >
          {{ action.icon }}
        </button>

        <div class="w-px h-5 bg-pink-200 mx-1 flex-shrink-0"></div>

        <button
          title="Insert Link"
          class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-pink-400 hover:bg-pink-50/60 transition-all duration-100"
          @click="insertLink"
        >
          <UiIcon name="link" class="!w-4 !h-4" />
        </button>

        <button
          title="Insert Image"
          class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-pink-400 hover:bg-pink-50/60 transition-all duration-100"
          @click="showImageModal = true"
        >
          <UiIcon name="image" class="!w-4 !h-4" />
        </button>

        <button
          title="Embed YouTube"
          class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-pink-400 hover:bg-pink-50/60 transition-all duration-100"
          @click="insertYoutube"
        >
          <UiIcon name="youtube" class="!w-4 !h-4" />
        </button>

        <div class="w-px h-5 bg-[#E7E5E4] mx-1 flex-shrink-0"></div>

        <button
          title="AI Assistant"
          class="flex-shrink-0 h-8 px-2.5 rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-semibold bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-500 text-white active:scale-95 transition-all duration-100 shadow-[0_1px_3px_rgba(244,114,182,0.25)]"
          @click="handleAi"
        >
          <UiIcon name="sparkles" class="!w-3.5 !h-3.5" />
          AI
        </button>
      </div>
    </div>

    <EditorContent :editor="editor" class="flex-1 overflow-y-auto max-w-none focus:outline-none min-h-0 tiptap" />

    <!-- Image Modal -->
    <UiModal :show="showImageModal" title="Insert image" @close="showImageModal = false">
      <div class="space-y-4">
        <label class="flex items-center gap-3 p-3.5 rounded-xl border border-white/50 cursor-pointer hover:bg-white/50 transition-colors">
          <div class="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0">
            <UiIcon name="camera" class="!w-5 !h-5 text-pink-400" />
          </div>
          <div>
            <p class="text-[13px] font-medium text-[#1C1917]">Upload from device</p>
            <p class="text-[11px] text-pink-400/70">JPG, PNG, GIF</p>
          </div>
          <input type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
        </label>

        <div class="p-3.5 rounded-xl border border-[#E7E5E4]">
          <p class="text-[12px] font-medium text-[#78716C] mb-2">Or paste image URL</p>
          <div class="flex gap-2">
            <input
              v-model="imageUrl"
              type="url"
              placeholder="https://..."
              class="flex-1 h-9 px-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/50 text-[13px] text-[#1C1917] placeholder-pink-300 outline-none focus:border-pink-300 focus:bg-white/70 transition-all"
              @keyup.enter="insertImageFromUrl"
            />
            <UiButton size="sm" :disabled="!imageUrl.trim()" @click="insertImageFromUrl">
              Add
            </UiButton>
          </div>
        </div>
      </div>
    </UiModal>

    <!-- AI Modal -->
    <UiModal :show="showAiModal" title="AI Assistant" @close="closeAiModal">
      <div class="space-y-4">
        <div v-if="!aiResult">
          <p class="text-[12px] text-pink-400/70 mb-3">What would you like help with?</p>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="action in aiActions"
              :key="action"
              class="p-3 rounded-xl border border-white/50 text-left text-[12px] font-medium text-[#1C1917] hover:bg-white/50 transition-colors"
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
              class="w-full px-3.5 py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-white/50 text-[13px] text-[#1C1917] placeholder-pink-300 outline-none focus:border-pink-300 focus:bg-white/70 transition-all resize-none"
            ></textarea>
            <UiButton
              size="md"
              class="w-full mt-2"
              :loading="aiLoading"
              :disabled="!aiPrompt.trim() || aiLoading"
              @click="runAiCustom"
            >
              {{ aiLoading ? 'Thinking...' : 'Generate' }}
            </UiButton>
          </div>
        </div>

        <div v-else>
          <div class="bg-white/50 backdrop-blur-sm rounded-xl p-3.5 mb-3 text-[13px] text-[#1C1917] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto border border-white/30">{{ aiResult }}</div>
          <div class="flex gap-2">
            <UiButton variant="secondary" size="md" class="flex-1" @click="aiResult = ''">
              Discard
            </UiButton>
            <UiButton size="md" class="flex-1" @click="insertAiResult">
              Insert
            </UiButton>
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

const props = defineProps<{ initialContent?: string }>()
const emit = defineEmits<{ update: [content: string] }>()

const showImageModal = ref(false)
const imageUrl = ref('')
const showAiModal = ref(false)
const aiPrompt = ref('')
const aiResult = ref('')
const aiLoading = ref(false)

const aiActions = ['Improve writing', 'Fix grammar', 'Make it shorter', 'Make it longer', 'Simplify', 'Add more detail']

const editor = useEditor({
  content: props.initialContent || '',
  extensions: [
    StarterKit,
    Link.configure({ openOnClick: false }),
    ImageResize.configure({ inline: false, allowBase64: true, minWidth: 100, maxWidth: 800 }),
    Youtube,
    Placeholder.configure({ placeholder: 'Start writing...' }),
  ],
  onUpdate: ({ editor }) => emit('update', editor.getHTML()),
})

watch(() => props.initialContent, (val) => {
  if (editor.value && val !== undefined && val !== editor.value.getHTML()) {
    editor.value.commands.setContent(val)
  }
})

const formattingActions = computed(() => {
  if (!editor.value) return []
  const e = editor.value
  return [
    { label: 'Bold', icon: 'B', isActive: () => e.isActive('bold'), command: () => e.chain().focus().toggleBold().run() },
    { label: 'Italic', icon: 'I', isActive: () => e.isActive('italic'), command: () => e.chain().focus().toggleItalic().run() },
    { label: 'Strike', icon: 'S', isActive: () => e.isActive('strike'), command: () => e.chain().focus().toggleStrike().run() },
    { label: 'H1', icon: 'H1', isActive: () => e.isActive('heading', { level: 1 }), command: () => e.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: 'H2', icon: 'H2', isActive: () => e.isActive('heading', { level: 2 }), command: () => e.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'Bullet list', icon: 'UL', isActive: () => e.isActive('bulletList'), command: () => e.chain().focus().toggleBulletList().run() },
    { label: 'Ordered list', icon: 'OL', isActive: () => e.isActive('orderedList'), command: () => e.chain().focus().toggleOrderedList().run() },
    { label: 'Quote', icon: '"', isActive: () => e.isActive('blockquote'), command: () => e.chain().focus().toggleBlockquote().run() },
    { label: 'Code', icon: '<>', isActive: () => e.isActive('codeBlock'), command: () => e.chain().focus().toggleCodeBlock().run() },
    { label: 'Divider', icon: '---', isActive: () => false, command: () => e.chain().focus().setHorizontalRule().run() },
  ]
})

function insertLink() {
  const url = window.prompt('Enter URL:')
  if (url && editor.value) editor.value.chain().focus().setLink({ href: url }).run()
}

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !editor.value) return
  const reader = new FileReader()
  reader.onload = () => { editor.value!.chain().focus().setImage({ src: reader.result as string }).run(); showImageModal.value = false }
  reader.readAsDataURL(file)
}

function insertImageFromUrl() {
  if (!imageUrl.value.trim() || !editor.value) return
  editor.value.chain().focus().setImage({ src: imageUrl.value.trim() }).run()
  imageUrl.value = ''; showImageModal.value = false
}

function insertYoutube() {
  const url = window.prompt('Enter YouTube URL:')
  if (url && editor.value) editor.value.commands.setYoutubeVideo({ src: url })
}

function handleAi() { aiPrompt.value = ''; aiResult.value = ''; showAiModal.value = true }
function closeAiModal() { showAiModal.value = false; aiPrompt.value = ''; aiResult.value = ''; aiLoading.value = false }
function getCurrentContent() { return editor.value?.getText() || '' }

async function runAiAction(action: string) {
  const content = getCurrentContent()
  if (!content.trim()) { aiPrompt.value = 'Write something about: ' + action; await runAiCustom(); return }
  aiLoading.value = true; aiPrompt.value = action
  try {
    const result = await $fetch<{ text: string }>('/api/ai', { method: 'POST', body: { prompt: action, context: content } })
    aiResult.value = result.text
  } catch (e: any) { aiResult.value = 'Error: ' + (e.data?.statusMessage || e.message || 'Failed') }
  finally { aiLoading.value = false }
}

async function runAiCustom() {
  if (!aiPrompt.value.trim()) return
  aiLoading.value = true
  try {
    const result = await $fetch<{ text: string }>('/api/ai', { method: 'POST', body: { prompt: aiPrompt.value, context: getCurrentContent() } })
    aiResult.value = result.text
  } catch (e: any) { aiResult.value = 'Error: ' + (e.data?.statusMessage || e.message || 'Failed') }
  finally { aiLoading.value = false }
}

function insertAiResult() {
  if (!editor.value || !aiResult.value) return
  editor.value.chain().focus().insertContent(aiResult.value).run()
  closeAiModal()
}

onBeforeUnmount(() => { editor.value?.destroy() })
</script>

<style>
.tiptap { outline: none; min-height: 300px; }
.tiptap p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #D6D3D1; pointer-events: none; height: 0; }
.tiptap h1 { font-size: 1.75em; font-weight: 700; margin: 0.5em 0 0.25em; color: #1C1917; }
.tiptap h2 { font-size: 1.35em; font-weight: 600; margin: 0.4em 0 0.2em; color: #1C1917; }
.tiptap ul { list-style-type: disc; padding-left: 1.5em; margin: 0.25em 0; }
.tiptap ol { list-style-type: decimal; padding-left: 1.5em; margin: 0.25em 0; }
.tiptap ul li, .tiptap ol li { margin: 0.15em 0; }
.tiptap blockquote { border-left: 3px solid #E7E5E4; padding-left: 1em; margin: 0.5em 0; color: #78716C; font-style: italic; }
.tiptap pre { background: #F5F5F4; border-radius: 8px; padding: 0.75em 1em; margin: 0.5em 0; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.85em; overflow-x: auto; }
.tiptap code { background: #F5F5F4; border-radius: 4px; padding: 0.15em 0.3em; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.85em; }
.tiptap pre code { background: none; padding: 0; }
.tiptap hr { border: none; border-top: 1px solid #E7E5E4; margin: 1em 0; }
.tiptap img { max-width: 100%; height: auto; border-radius: 8px; cursor: grab; transition: box-shadow 0.2s; }
.tiptap img:hover { box-shadow: 0 0 0 2px rgba(244, 114, 182, 0.2); }
.tiptap img:active { cursor: grabbing; }
.tiptap img.ProseMirror-selectednode { outline: 2px solid #EC4899; outline-offset: 2px; }
.ProseMirror .resize-handle { position: absolute; bottom: 4px; right: 4px; width: 14px; height: 14px; background: #EC4899; border-radius: 50%; cursor: se-resize; border: 2px solid #fce7f3; z-index: 10; }
.ProseMirror .resize-handle::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 4px; height: 4px; background: #fce7f3; border-radius: 50%; }
.ProseMirror img.ProseMirror-selectednode { position: relative; }
</style>
