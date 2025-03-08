<template>
  <div
    class="absolute top-4 right-4 sm:top-8 sm:right-10 flex items-center space-x-1"
  >
    <!-- Colour Mode Switcher -->
    <ClientOnly v-if="!colourMode?.forced">
      <UButton
        :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
        color="neutral"
        variant="ghost"
        @click="isDark = !isDark"
      />

      <template #fallback>
        <div class="size-8" />
      </template>
    </ClientOnly>

    <!-- Authorise to Entries Editor -->
    <UModal
      :fullscreen="isAuth"
      :title="$t('editor.title')"
      :description="$t('editor.desc')"
      :close="{ color: 'neutral', variant: 'outline', class: 'rounded-full' }"
    >
      <UButton icon="i-lucide-pen" color="neutral" variant="ghost" />

      <template #body>
        <div>
          <p class="text-midnight-600 dark:text-midnight-300">
            {{ $t("editor.step") }}
          </p>
          <UPinInput
            color="none"
            variant="outline"
            class="mt-5"
            :length="6"
            v-model="pin"
          />
        </div>
        <div class="mt-10" v-if="isAuth">
          <UTabs :items="tabItems" variant="link" class="gap-4" color="neutral">
            <template #new="{ item }">
              <p class="text-(--ui-text-muted) mb-4">
                {{ item.description }}
              </p>
              <Editor />
            </template>
          </UTabs>
        </div>
      </template>
    </UModal>
    <!-- Language Switcher -->
    <div v-for="locale in availableLocales" :key="locale.code">
      <UButton
        class="text-brick-red-200 noselect font-semibold text-lg sm:text-xl"
        color="neutral"
        variant="ghost"
        @click="setLocale(locale.code)"
      >
        {{ locale.name }}
      </UButton>
    </div>
  </div>
</template>

<script setup>
const { locale, locales, setLocale, t } = useI18n();
const colourMode = useColorMode();
const config = useAppConfig();
const pin = ref([]);
const isAuth = ref(false);
const tabItems = [
  {
    label: t("editor.new"),
    description: t("editor.new.desc"),
    slot: "new",
  },
  {
    label: t("editor.edit"),
    description: t("editor.edit.desc"),
    slot: "edit",
  },
];

const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value);
});

const isDark = computed({
  get() {
    return colourMode.value === "dark";
  },
  set() {
    colourMode.preference = colourMode.value === "dark" ? "light" : "dark";
  },
});

watch(pin, (newPin) => {
  if (newPin.join("") === config.PIN) {
    isAuth.value = true;
  }
});
</script>
