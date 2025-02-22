<template>
  <div
    class="min-h-screen flex justify-center relative bg-gray-100 dark:bg-gray-950 transition-colors"
  >
    <div
      v-if="isLoading"
      class="w-full sm:w-2/3 px-6 sm:px-4 mb-20 flex items-center justify-center min-h-screen"
    >
      <UIcon
        name="i-lucide-loader"
        class="animate-spin text-3xl text-gray-500 dark:text-gray-300"
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
        class="noselect mt-5 text-lg sm:text-xl text-gray-400 dark:text-gray-300"
      >
        {{ $t("welcome") }}
      </p>

      <div
        class="text-left noselect space-y-2"
        v-for="entry in entries"
        :key="entry.id"
      >
        <router-link :to="'/entries/' + entry.id">
          <h3
            class="text-xl sm:text-3xl font-bold mt-6 sm:mt-10 text-brick-red-400 dark:text-brick-red-300"
          >
            {{ entry.title }}
          </h3>
        </router-link>

        <p
          class="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-semibold"
        >
          {{ moment(entry.date).format("Do MMM, YYYY") }} •
          <span class="font-bold">{{ entry.author }}</span>
        </p>

        <div class="inline-flex flex-wrap items-center gap-2">
          <blockquote
            class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300 text-sm sm:text-base"
          >
            {{ entry.desc }}
          </blockquote>

          <p
            v-for="tag in entry.tags"
            :key="tag"
            class="text-gray-600 dark:text-gray-200 bg-[#FFBADB] dark:bg-[#682c3f] text-xs sm:text-sm font-medium px-2 py-1 rounded border border-[#BC5677] dark:border-[#91415a]"
          >
            #{{ tag }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from "moment";

const entries = ref([]);
const isLoading = ref(true);

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
