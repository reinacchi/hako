<template>
  <div class="min-h-screen flex justify-center z-1 relative">
    <!-- Language Switcher -->
    <div
      v-for="locale in availableLocales"
      :key="locale.code"
      class="absolute top-4 right-4 sm:top-8 sm:right-10"
    >
      <UButton
        class="text-brick-red-200 font-semibold text-lg sm:text-xl"
        color="neutral"
        variant="ghost"
        @click="setLocale(locale.code)"
        >{{ locale.name }}</UButton
      >
    </div>

    <div class="w-full sm:w-2/3 px-6 sm:px-4 mb-20">
      <h1
        class="font-sans font-bold text-4xl sm:text-5xl text-brick-red-400 tracking-widest noselect text-left mt-10 sm:mt-20"
      >
        Hako
      </h1>
      <p class="noselect mt-5 text-lg sm:text-xl text-gray-400">
        {{ $t("welcome") }}
      </p>
      <div
        class="text-left noselect space-y-2"
        v-for="entry in entries.reverse()"
        :key="entry.date"
      >
        <router-link :to="'/entries/' + entry.id">
          <h3
            :style="{ color: 'var(--accent-four)' }"
            class="text-xl sm:text-3xl font-bold mt-6 sm:mt-10"
          >
            {{ entry.title }}
          </h3>
        </router-link>

        <p class="text-gray-700 text-sm sm:text-base font-semibold">
          {{ moment(entry.uploadedAt).format("Do MMM, YYYY") }} •
          <span class="font-bold">{{ entry.author }}</span>
        </p>

        <div class="flex flex-wrap items-center space-x-2">
          <p class="text-gray-600 text-sm sm:text-base font-semibold">
            {{ entry.desc }}
          </p>
          <p
            v-for="tag in entry.tags"
            :key="tag"
            class="text-gray-600 bg-[#FFBADB] text-xs sm:text-sm font-medium px-2 py-1 rounded border border-[#BC5677]"
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

const { locale, locales, setLocale } = useI18n();

const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value);
});

const entries = ref([]);

onMounted(async () => {
  try {
    entries.value = await $fetch("/api/entries", {
      method: "GET",
    });
  } catch (error) {
    console.error("Failed to fetch entries:", error);
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
    { name: "theme-color", content: "#cc536e" },
    { "http-equiv": "x-ua-compatible", content: "IE=edge" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
  ],
});
</script>
