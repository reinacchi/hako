<template>
  <div class="h-screen flex items-center justify-center">
    <div class="text-center animate-slide-down">
      <h1
        class="font-sans font-bold text-3xl sm:text-5xl tracking-widest noselect"
      >
        Not Found ヾ(^▽^*)))
      </h1>
    </div>
  </div>
</template>

<script setup>
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
