<template>
  <footer
    class="noselect w-full py-6 px-4 sm:px-6 bg-gray-100 dark:bg-gray-950 border-t border-gray-300 dark:border-gray-800"
  >
    <div
      class="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <p class="text-sm text-gray-700 dark:text-gray-300">
        &copy; {{ new Date().getFullYear() }}
        <span class="text-brick-red-600 dark:text-brick-red-500">reinacchi</span
        >. All rights reserved.
      </p>
      <div class="flex gap-4">
        <NuxtLink
          to="https://twitter.com/reinacchi_"
          target="_blank"
          aria-label="Twitter"
        >
          <UIcon
            name="i-lucide-twitter"
            class="w-5 h-5 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition"
          />
        </NuxtLink>
        <NuxtLink
          to="https://github.com/reinacchi"
          target="_blank"
          aria-label="GitHub"
        >
          <UIcon
            name="i-lucide-github"
            class="w-5 h-5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
          />
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>
