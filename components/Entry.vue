<template>
  <div v-if="entry.message === 'Unknown Entry'">
    <NotFound />
  </div>
  <div v-else>
    <div
      class="min-h-screen flex justify-center relative bg-midnight-50 dark:bg-midnight-950 transition-colors px-4 sm:px-0"
    >
      <div class="w-full max-w-3xl px-4 sm:px-6 mb-16 sm:mb-20 noselect">
        <NuxtLink
          to="/"
          class="absolute top-[24px] left-4 sm:top-6 sm:left-6 text-midnight-800 dark:text-white text-2xl sm:text-4xl z-50"
        >
          <UTooltip
            :text="$t('backward')"
            :kbds="['Alt', 'arrowleft']"
            :content="{ side: 'right' }"
          >
            <UIcon name="i-lucide-arrow-left" />
          </UTooltip>
        </NuxtLink>

        <div class="mt-22 sm:mt-24">
          <h3
            class="mt-3 text-xl sm:text-3xl font-bold text-brick-red-400 dark:text-brick-red-300"
          >
            {{ entry.title }}
          </h3>

          <p
            class="mt-3 text-midnight-700 dark:text-midnight-100 text-sm sm:text-base font-semibold"
          >
            {{ moment(entry.date).format("Do MMM, YYYY") }} •
            <span class="font-bold">{{ entry.author }}</span>
          </p>

          <div class="mt-3 flex flex-wrap gap-2 items-start sm:items-center">
            <blockquote
              class="border-l-4 border-midnight-300 dark:border-midnight-600 pl-4 italic text-midnight-700 dark:text-midnight-300 text-sm sm:text-base w-full sm:w-auto"
            >
              {{ entry.desc }}
            </blockquote>

            <div class="flex flex-wrap gap-2">
              <p
                v-for="tag in entry.tags"
                :key="tag"
                class="text-midnight-600 dark:text-midnight-50 bg-brick-red-100 dark:bg-brick-red-600 text-xs sm:text-sm font-medium px-2 py-1 rounded border border-brick-red-500 dark:border-brick-red-950"
              >
                #{{ tag }}
              </p>
            </div>
          </div>
        </div>

        <hr
          class="border-t-2 border-brick-red-500 mt-6 w-full dark:border-brick-red-400"
        />

        <div
          class="mt-6 text-midnight-800 dark:text-midnight-100 text-sm sm:text-base leading-relaxed"
        >
          <span v-html="entry.content" class="mb-4"></span>
        </div>
        <hr
          class="border-t-2 border-brick-red-500 mt-6 w-full dark:border-brick-red-400"
        />

        <div class="mt-10">
          <h3 class="text-2xl font-bold text-midnight-800 dark:text-midnight-50">
            {{ $t("entry.comment") }}
          </h3>

          <div class="mt-3">
            <UInput
              color="none"
              v-model="newComment.name"
              :placeholder="$t('entry.comment.name')"
              class="w-full dark:bg-midnight-800 text-midnight-800 dark:text-midnight-200 mt-3"
            />
            <UTextarea
              color="none"
              v-model="newComment.text"
              :placeholder="$t('entry.comment.write')"
              class="w-full text-midnight-800 dark:text-midnight-200 mt-3"
            />
            <UButton
              @click="submitComment"
              class="text-midnight-600 dark:text-white px-4 py-2 rounded mt-3 cursor-pointer"
              color="secondary"
              variant="outline"
            >
              {{ $t("entry.comment.submit") }}
            </UButton>
          </div>

          <div v-if="isLoading" class="mt-6">
            <div
              v-for="n in 2"
              :key="n"
              class="p-4 border border-midnight-300 dark:border-midnight-500 rounded-lg mt-4"
            >
              <USkeleton class="h-4 w-32 mb-2" />
              <USkeleton class="h-4 w-full" />
            </div>
          </div>
          <div v-else>
            <div v-if="comments.length" class="mt-6 space-y-4">
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="p-4 border border-midnight-300 dark:border-midnight-500 rounded-lg"
              >
                <p
                  class="text-sm text-midnight-600 dark:text-midnight-400 font-semibold"
                >
                  {{ comment.name }} •
                  {{ moment(comment.date).format("Do MMM, YYYY HH:mm") }}
                </p>
                <p class="mt-2 text-midnight-800 dark:text-midnight-200">
                  {{ comment.text }}
                </p>
              </div>
            </div>
            <p v-else class="mt-4 text-midnight-600 dark:text-midnight-200">
              {{ $t("entry.comment.none") }}
            </p>
          </div>
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
const isLoading = ref(true);

const fetchComments = async () => {
  try {
    const fetchedComments = await $fetch(`/api/entries/${entryID}/comments`);
    comments.value = fetchedComments.reverse();
  } catch (error) {
    console.error("Failed to fetch comments:", error);
  } finally {
    isLoading.value = false;
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

    comments.value.unshift({
      name: newComment.value.name,
      text: newComment.value.text,
      date: new Date(),
    });

    newComment.value = { name: "", text: "" };

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
    { property: "og:image", content: "/hako.png" },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:site_name", content: entry.title },
    { property: "og:description", content: entry.desc },
    { name: "theme-color", content: "#cc536e" },
    { "http-equiv": "x-ua-compatible", content: "IE=edge" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
  ],
});
</script>
