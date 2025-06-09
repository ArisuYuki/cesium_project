<template>
  <div class="resource-list">
    <ImageCard></ImageCard>
    <CloudPointCard></CloudPointCard>
  </div>
</template>

<script setup lang="ts">
  import CloudPointCard from './PointCloudCard.vue';
  import ImageCard from './ImageCard.vue';
</script>

<style lang="scss" scoped>
  .resource-list {
    width: 100%;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  :deep(.v-expansion-panel-title) {
    background-image: url('@/assets/titBg.png');
    background-size: 100% 100%;
  }
</style>
