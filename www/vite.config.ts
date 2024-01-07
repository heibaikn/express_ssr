import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve } from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // plugins: [

  // ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        index: resolve(__dirname, 'page/index/index.html'),
        about: resolve(__dirname, 'page/about/about.html'),
        // index: 'page/index/index.js',
        // about: 'page/about/index.js',
        // main: 'src/main.ts', // 第一个 HTML 入口
      },
    },
  },
  plugins: [
    vue(),
    // createHtmlPlugin({
    //   pages: [
    //     {
    //       entry: 'page/index/index.js',
    //       filename: 'index.html',
    //       template: 'page/index/index.html',
    //       injectOptions: {
    //         data: {
    //           title: 'index',
    //           injectScript: `<script src="./inject.js"></script>`,
    //         },
    //         tags: [
    //           {
    //             injectTo: 'body-prepend',
    //             tag: 'div',
    //             attrs: {
    //               id: 'tag1',
    //             },
    //           },
    //         ],
    //       },
    //     },
    //     // {
    //     //   entry: 'page/about/index.js',
    //     //   filename: 'about.html',
    //     //   template: 'page/about/about.html',
    //     // },
    //   ]
    // }),
  ],
})
