import { defineStore } from 'pinia';

export const useTipStore = defineStore('tips', {
  state: () => ({
    tip: '',
  }),
});
