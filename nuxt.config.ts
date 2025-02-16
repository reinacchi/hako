// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  appConfig: {
    Auth: process.env.AUTH,
    PIN: process.env.PIN,
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/i18n"],
  css: ["~/assets/css/style.css"],
  i18n: {
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "de", name: "Deutsch", file: "de.json" }
    ],
    defaultLocale: "en",
    langDir: "../locales",
    strategy: "no_prefix",
  },
  nitro: {
    plugins: ["~/server/plugins/database.ts"],
  },
  runtimeConfig: {
    Auth: process.env.AUTH,
    MongoDB: process.env.MONGODB,
    PIN: process.env.PIN
  },
})
