<template>
  <div class="sheet">
    <div class="sheet-header" :class="{ 'sheet-header-reverse': reverse }">
      <slot name="title"></slot>
    </div>
    <div class="sheet-body">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    reverse: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style lang="scss" scoped>
  .sheet {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .sheet-header {
    width: 100%;
    height: 24px !important;
    background-image: url('@/assets/bg_tt.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }
  .sheet-header-reverse {
    background-image: url('@/assets/bg_tt2.png') !important;
  }
</style>
