<template>
  <div
    class="min-h-screen flex justify-center relative bg-midnight-50 dark:bg-midnight-950 transition-colors"
  >
    <div
      v-if="isLoading"
      class="w-full sm:w-2/3 px-6 sm:px-4 mb-20 flex items-center justify-center min-h-screen"
    >
      <UIcon
        name="i-lucide-loader"
        class="animate-spin text-3xl text-midnight-500 dark:text-midnight-100"
      />
    </div>

    <div v-else class="w-full sm:w-2/3 px-6 sm:px-4 mb-20 animate-slide-up">
      <h1
        class="font-sans font-bold text-4xl sm:text-5xl text-brick-red-400 tracking-widest noselect text-left mt-20 flex items-center gap-3"
      >
        <img
          src="/assets/img/hako.png"
          class="w-12 sm:w-14 h-auto"
          draggable="false"
        />
        Hako
      </h1>
      <p
        class="noselect mt-5 text-lg sm:text-xl text-midnight-500 dark:text-midnight-100"
      >
        {{ $t("welcome") }}
      </p>

      <div class="mt-6 mb-6 flex flex-wrap gap-2">
        <button
          v-for="tag in allTags"
          :key="tag"
          @click="toggleTagFilter(tag)"
          class="text-xs sm:text-sm font-medium px-2 py-1 rounded border transition"
          :class="{
            'text-midnight-600 dark:text-midnight-50 bg-brick-red-100 dark:bg-brick-red-600 border-brick-red-500 dark:border-brick-red-950':
              selectedTags.includes(tag),
            'text-midnight-500 dark:text-midnight-300 bg-midnight-100 dark:bg-midnight-800 border-midnight-300 dark:border-midnight-600 hover:bg-midnight-200 dark:hover:bg-midnight-700':
              !selectedTags.includes(tag),
          }"
        >
          #{{ tag }}
        </button>
        <button
          v-if="selectedTags.length > 0"
          @click="clearFilters"
          class="text-xs sm:text-sm font-medium px-2 py-1 rounded border border-midnight-300 dark:border-midnight-600 text-midnight-500 dark:text-midnight-300 hover:bg-midnight-200 dark:hover:bg-midnight-700 transition"
        >
          {{ $t("tag.clear") }}
        </button>
      </div>

      <div v-if="filteredEntries.length === 0" class="mt-10 text-center">
        <p class="text-midnight-500 dark:text-midnight-300">
          {{ $t("tag.none") }}
        </p>
      </div>

      <div
        class="text-left noselect"
        v-for="entry in paginatedEntries"
        :key="entry.id"
      >
        <router-link :to="'/entries/' + entry.id">
          <h3
            class="text-xl sm:text-3xl font-bold mt-6 sm:mt-10 text-brick-red-400 hover:text-brick-red-600 dark:text-brick-red-300 dark:hover:text-brick-red-500 transition"
          >
            {{ entry.title }}
          </h3>
        </router-link>

        <p
          class="mt-1 text-midnight-700 dark:text-midnight-100 text-sm sm:text-base font-semibold"
        >
          {{ moment(entry.date).format("Do MMM, YYYY") }} •
          <span class="font-bold">{{ entry.author }}</span>
        </p>

        <div class="mt-3 inline-flex flex-wrap items-center gap-2">
          <blockquote
            class="border-l-4 border-midnight-100 dark:border-midnight-600 pl-4 italic text-midnight-700 dark:text-midnight-200 text-sm sm:text-base"
          >
            {{ entry.desc }}
          </blockquote>

          <p
            v-for="tag in entry.tags"
            :key="tag"
            class="text-midnight-600 dark:text-midnight-50 bg-brick-red-100 dark:bg-brick-red-600 text-xs sm:text-sm font-medium px-2 py-1 rounded border border-brick-red-500 dark:border-brick-red-950"
          >
            #{{ tag }}
          </p>
        </div>
      </div>

      <div class="flex justify-center mt-10">
        <UPagination
          :page="currentPage"
          @update:page="currentPage = $event"
          :items-per-page="itemsPerPage"
          :total="filteredEntries.length"
          :ui="{
            wrapper: 'flex items-center gap-2',
            item: {
              base: 'px-3 py-1 rounded border border-midnight-300 dark:border-midnight-600 text-midnight-500 dark:text-midnight-300 hover:bg-midnight-200 dark:hover:bg-midnight-700 transition',
              active:
                'bg-brick-red-100 dark:bg-brick-red-600 border-brick-red-500 dark:border-brick-red-950 text-midnight-800 dark:text-midnight-50 font-semibold',
              disabled:
                'cursor-not-allowed text-midnight-300 dark:text-midnight-600 border-midnight-200 dark:border-midnight-700',
            },
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from "moment";

const entries = ref([]);
const isLoading = ref(true);
const selectedTags = ref([]);
const currentPage = ref(1);
const itemsPerPage = 5;

const allTags = computed(() => {
  const tags = new Set();
  entries.value.forEach((entry) => {
    entry.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
});

const filteredEntries = computed(() => {
  if (selectedTags.value.length === 0) {
    return entries.value.filter(
      (entry) => !entry.tags.some((tag) => ["jp", "2rkf", "3rkf"].includes(tag))
    );
  }

  return entries.value.filter((entry) =>
    selectedTags.value.every((tag) => entry.tags.includes(tag))
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredEntries.value.length / itemsPerPage);
});

const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredEntries.value.slice(start, end);
});

const toggleTagFilter = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
  // Reset to first page when filters change
  currentPage.value = 1;
};

const clearFilters = () => {
  selectedTags.value = [];
  currentPage.value = 1;
};

onMounted(async () => {
  try {
    const data = await $fetch("/api/entries");
    entries.value = data.reverse(); // Newest entries first
  } catch (error) {
    console.error("Failed to fetch entries:", error);
  } finally {
    isLoading.value = false;
  }
});

useHead({
  title: "Hako",
  meta: [
    { property: "og:title", content: "Hako" },
    { property: "og:site_name", content: "2rkf" },
    {
      property: "og:description",
      content: "A collection of archivable writings.",
    },
    { property: "og:image", content: "/hako.png" },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "theme-color", content: "#cc536e" },
    { "http-equiv": "x-ua-compatible", content: "IE=edge" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
  ],
});
</script>
