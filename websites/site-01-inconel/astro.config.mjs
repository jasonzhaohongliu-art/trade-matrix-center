import { defineConfig } from 'astro/config';

// 1号超级合金站 — 静态生成 + Pages CMS 后台
export default defineConfig({
  site: 'https://inconel-alloy.com',
  srcDir: './src',
  publicDir: './public',
  outDir: './dist',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'ja'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
