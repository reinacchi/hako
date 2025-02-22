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
          <p class="text-gray-600 dark:text-gray-300">
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
          <Editor />
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
const { locale, locales, setLocale } = useI18n();
const colourMode = useColorMode();
const config = useAppConfig();
const pin = ref([]);
const isAuth = ref(false);

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
