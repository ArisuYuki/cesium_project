/*
 * @Author: ShirahaYuki  shirhayuki2002@gmail.com
 * @Date: 2025-05-31 11:24:03
 * @LastEditors: ShirahaYuki  shirhayuki2002@gmail.com
 * @LastEditTime: 2025-06-16 11:44:36
 * @FilePath: /cesium_project/vite.config.mts
 * @Description:
 *
 * Copyright (c) 2025 by ShirahaYuki, All Rights Reserved.
 */
// Plugins
import Components from 'unplugin-vue-components/vite';
import Vue from '@vitejs/plugin-vue';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import cesium from 'vite-plugin-cesium';
// Utilities
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Components(),
    cesium(),
  ],
  optimizeDeps: {
    exclude: [
      'vuetify',
      'vue-router',
      'unplugin-vue-router/runtime',
      'unplugin-vue-router/data-loaders',
      'unplugin-vue-router/data-loaders/basic',
    ],
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  server: {
    port: 3000,
    // proxy: {
    //   '/data': {
    //     target: 'http://localhost:12345',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/data/, ''),
    //   },
    // },
    proxy: {
      '/data': {
        target: 'http://localhost:12345',//你的后端服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/data/, ''),
      },
    },
  },
  
  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler',
      },
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  assetsInclude: ['**/*.glb'],
});
