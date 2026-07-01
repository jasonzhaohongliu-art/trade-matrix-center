import { defineConfig } from 'astro/config';

// 2号铜包钢+NDT站 — 静态生成 + Pages CMS 后台
export default defineConfig({
  site: 'https://copper-clad-steel.com',
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
