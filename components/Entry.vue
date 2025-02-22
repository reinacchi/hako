<template>
  <div v-if="entry.message === 'Unknown Entry'">
    <NotFound />
  </div>
  <div v-else>
    <div
      class="min-h-screen flex justify-center relative bg-gray-100 dark:bg-gray-950 transition-colors px-4 sm:px-0"
    >
      <div class="w-full max-w-3xl px-4 sm:px-6 mb-16 sm:mb-20 noselect">
        <NuxtLink
          to="/"
          class="absolute top-4 left-4 sm:top-6 sm:left-6 text-gray-800 dark:text-white text-2xl sm:text-4xl z-50"
        >
          <UTooltip
            :text="$t('backward')"
            :kbds="['Alt', 'arrowleft']"
            :content="{ side: 'right' }"
          >
            <UIcon name="i-lucide-arrow-left" />
          </UTooltip>
        </NuxtLink>

        <div class="space-y-3 mt-16 sm:mt-20">
          <h3 class="text-xl sm:text-3xl font-bold dark:text-accent-light">
            {{ entry.title }}
          </h3>

          <p
            class="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-semibold"
          >
            {{ moment(entry.date).format("Do MMM, YYYY") }} •
            <span class="font-bold">{{ entry.author }}</span>
          </p>

          <div class="flex flex-wrap gap-2 items-start sm:items-center">
            <blockquote
              class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300 text-sm sm:text-base w-full sm:w-auto"
            >
              {{ entry.desc }}
            </blockquote>

            <div class="flex flex-wrap gap-2">
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

        <hr
          class="border-t-2 border-[var(--accent-two)] mt-6 w-full dark:border-gray-600"
        />

        <!-- Entry Content -->
        <div
          class="mt-6 text-gray-800 dark:text-gray-300 text-sm sm:text-base leading-relaxed"
        >
          <p v-html="entry.content" class="mb-4"></p>
        </div>
        <hr
          class="border-t-2 border-[var(--accent-two)] mt-6 w-full dark:border-gray-600"
        />

        <!-- Comments Section -->
        <div class="mt-10">
          <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {{ $t("entry.comment") }}
          </h3>

          <div class="mt-4 space-y-3">
            <UInput
              color="neutral"
              v-model="newComment.name"
              :placeholder="$t('entry.comment.name')"
              class="w-full text-gray-800 dark:text-gray-200"
            />
            <UTextarea
              color="neutral"
              v-model="newComment.text"
              :placeholder="$t('entry.comment.write')"
              class="w-full text-gray-800 dark:text-gray-200"
            />
            <UButton
              @click="submitComment"
              class="text-gray-600 dark:text-white px-4 py-2 rounded"
              color="secondary"
              variant="outline"
            >
              {{ $t("entry.comment.submit") }}
            </UButton>
          </div>

          <!-- Display Comments -->
          <div v-if="comments.length" class="mt-6 space-y-4">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg"
            >
              <p class="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                {{ comment.name }} •
                {{ moment(comment.date).format("Do MMM, YYYY HH:mm") }}
              </p>
              <p class="mt-2 text-gray-800 dark:text-gray-200">
                {{ comment.text }}
              </p>
            </div>
          </div>
          <p v-else class="mt-4 text-gray-600 dark:text-gray-400">
            {{ $t("entry.comment.none") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from "moment";

const config = useAppConfig();
const { t } = useI18n();
const toast = useToast();
const entryID = useRoute().params.entry;
const entry = await $fetch(`/api/entries/${entryID}`);

const comments = ref([]);
const newComment = ref({ name: "", text: "" });

const fetchComments = async () => {
  try {
    const fetchedComments = await $fetch(`/api/entries/${entryID}/comments`);
    comments.value = fetchedComments.reverse(); // Show newest first
  } catch (error) {
    console.error("Failed to fetch comments:", error);
  }
};

onMounted(fetchComments);

const submitComment = async () => {
  if (!newComment.value.name || !newComment.value.text) {
    return toast.add({ title: t("entry.comment.error"), color: "error" });
  }

  try {
    await $fetch(`/api/entries/${entryID}/comments`, {
      method: "POST",
      headers: {
        Authorisation: config.Auth,
      },
      body: JSON.stringify(newComment.value),
    });

    // Manually add the comment to avoid unnecessary API call delay
    comments.value.unshift({
      name: newComment.value.name,
      text: newComment.value.text,
      date: new Date(), // Local timestamp
    });

    newComment.value = { name: "", text: "" };

    // Fetch latest comments from the server
    await fetchComments();
  } catch (error) {
    console.error("Failed to submit comment:", error);
    return toast.add({ title: t("entry.comment.error"), color: "error" });
  }
};

useHead({
  title: "Hako",
  meta: [
    { property: "og:title", content: "Hako" },
    { property: "og:site_name", content: entry.title },
    { property: "og:description", content: entry.desc },
    { name: "theme-color", content: "#cc536e" },
    { "http-equiv": "x-ua-compatible", content: "IE=edge" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
  ],
});
</script>

