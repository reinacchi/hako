<template>
  <UApp :toaster="{ position: 'top-right', duration: 2000 }">
    <NuxtPage class="animate-slide-up" />
    <Footer />
    <switcher />
  </UApp>
</template>