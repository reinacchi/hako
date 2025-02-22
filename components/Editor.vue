<template>
  <div
    class="p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg text-gray-900 dark:text-white space-y-6"
  >
    <div class="space-y-4">
      <div>
        <label
          class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
          >{{ $t("editor.md.title") }}</label
        >
        <UInput
          color="neutral"
          v-model="title"
          :placeholder="$t('editor.md.title.s')"
          size="lg"
          class="bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-[23rem]"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
          >{{ $t("editor.md.desc") }}</label
        >
        <UInput
          color="neutral"
          v-model="description"
          :placeholder="$t('editor.md.desc.s')"
          size="lg"
          class="bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-[23rem]"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
          >{{ $t("editor.md.author") }}</label
        >
        <UInput
          color="neutral"
          v-model="author"
          :placeholder="$t('editor.md.author.s')"
          size="lg"
          class="bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-[23rem]"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
          >{{ $t("editor.md.tags") }}</label
        >
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in tags"
            :key="tag"
            class="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded text-sm flex items-center gap-2 text-gray-900 dark:text-white"
          >
            {{ tag }}
            <button
              @click="removeTag(tag)"
              class="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 focus:outline-none"
            >
              <UIcon name="i-lucide-x" class="mt-2" />
            </button>
          </span>
        </div>
        <UInput
          color="neutral"
          v-model="tagInput"
          :placeholder="$t('editor.md.tags.s')"
          size="md"
          class="bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-3 w-[23rem]"
          @keydown.enter.prevent="addTag"
        />
      </div>
    </div>

    <div>
      <label
        class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
        >{{ $t("editor.md.content") }}</label
      >
      <div
        class="border border-gray-300 dark:border-gray-700 rounded bg-gray-200 dark:bg-gray-800 p-2"
      >
        <EditorContent :editor="editor" />
      </div>
    </div>

    <div>
      <label
        class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
        >{{ $t("editor.md.live") }}</label
      >
      <pre
        class="p-3 bg-gray-200 dark:bg-gray-800 rounded text-sm whitespace-pre-wrap text-gray-900 dark:text-white"
        >{{ content }}</pre
      >
    </div>

    <UButton
      color="primary"
      size="xl"
      variant="outline"
      :label="$t('editor.md.post')"
      @click="postEntry"
    />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

const content = ref("# Hello, Markdown Editor!");
const title = ref("");
const description = ref("");
const author = ref("");
const tags = ref([]);
const tagInput = ref("");
const toast = useToast();
const { t } = useI18n();
const config = useAppConfig();

const editor = useEditor({
  extensions: [StarterKit, Markdown],
  content: content.value,
  editorProps: {
    attributes: {
      class:
        "p-3 min-h-[200px] max-h-[300px] overflow-y-auto focus:outline-none prose prose",
    },
  },
  onUpdate: ({ editor }) => {
    content.value = editor.getHTML();
  },
});

const addTag = () => {
  if (tagInput.value.trim() && !tags.value.includes(tagInput.value.trim())) {
    tags.value.push(tagInput.value.trim());
  }
  tagInput.value = "";
};

const removeTag = (tag) => {
  tags.value = tags.value.filter((t) => t !== tag);
};

const postEntry = async () => {
  if (title.value.length === 0) {
    return toast.add({ title: t("editor.notif.notitle"), color: "error" });
  }

  if (description.value.length === 0) {
    return toast.add({ title: t("editor.notif.nodesc"), color: "error" });
  }

  if (author.value.length === 0) {
    return toast.add({ title: t("editor.notif.noauthor"), color: "error" });
  }

  if (tags.value.length === 0) {
    return toast.add({ title: t("editor.notif.notags"), color: "error" });
  }

  if (content.value === "<p></p>") {
    return toast.add({ title: t("editor.notif.nocontent"), color: "error" });
  }

  const entry = {
    author: author.value,
    content: content.value,
    description: description.value,
    tags: tags.value,
    title: title.value,
  };

  try {
    await $fetch("/api/entries", {
      method: "POST",
      headers: {
        Authorisation: config.Auth,
      },
      body: JSON.stringify(entry),
    });

    return toast.add({ title: t("editor.post.success"), color: "success" });
  } catch (err) {
    console.error(err);
    return toast.add({ title: t("editor.post.error"), color: "error" });
  }
};
</script>

<style>
.prose {
  color: #374151;
}
.dark .prose {
  color: #e5e7eb;
}

.prose h1 {
  color: #1f2937;
  font-size: 2em;
  margin-bottom: 0.5em;
}
.dark .prose h1 {
  color: #fff;
}

.prose h2 {
  color: #1f2937;
  font-size: 1.5em;
  margin-bottom: 0.5em;
}
.dark .prose h2 {
  color: #fff;
}

.prose h3 {
  color: #1f2937;
  font-size: 1.25em;
  margin-bottom: 0.5em;
}
.dark .prose h3 {
  color: #fff;
}

.prose h4 {
  color: #1f2937;
  font-size: 1.1em;
  margin-bottom: 0.5em;
}
.dark .prose h4 {
  color: #fff;
}

.prose h5 {
  color: #1f2937;
  font-size: 1em;
  margin-bottom: 0.5em;
}
.dark .prose h5 {
  color: #fff;
}

.prose h6 {
  color: #4b5563;
  font-size: 0.9em;
  margin-bottom: 0.5em;
}
.dark .prose h6 {
  color: #d1d5db;
}

.prose strong {
  color: #1f2937;
}
.dark .prose strong {
  color: #fff;
}

.prose em {
  color: #4b5563;
}
.dark .prose em {
  color: #e5e7eb;
}

.prose a {
  color: #2563eb;
  text-decoration: underline;
}
.dark .prose a {
  color: #60a5fa;
}
.prose a:hover {
  color: #3b82f6;
}
.dark .prose a:hover {
  color: #93c5fd;
}

.prose ul {
  list-style-type: disc !important;
  margin-left: 1.5em;
  padding-left: 0;
  color: #374151;
}
.dark .prose ul {
  color: #e5e7eb;
}

.prose ol {
  list-style-type: decimal !important;
  margin-left: 1.5em;
  padding-left: 0;
  color: #374151;
}
.dark .prose ol {
  color: #e5e7eb;
}

.prose blockquote {
  color: #4b5563;
  border-left: 4px solid #2563eb;
  padding-left: 1em;
  margin-left: 0;
  font-style: italic;
}
.dark .prose blockquote {
  color: #d1d5db;
  border-left-color: #60a5fa;
}

.prose code {
  color: #db2777;
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: monospace;
}
.dark .prose code {
  color: #f9a8d4;
  background-color: #1f2937;
}

.prose pre {
  color: #1f2937;
  background-color: #f3f4f6;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
}
.dark .prose pre {
  color: #e5e7eb;
  background-color: #1f2937;
}

.prose pre code {
  background: none;
  padding: 0;
}

.prose hr {
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 1em 0;
}
.dark .prose hr {
  border-top: 1px solid #374151;
}

.prose p {
  margin-bottom: 1em;
}
</style>
