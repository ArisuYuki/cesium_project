<template>
  <div class="entity-content">
    <div class="state-panel-header"></div>
    <RouterView></RouterView>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
  .entity-content {
    height: 100%;
    width: 100%;
    padding: 8px;
    background-color: rgba(0, 0, 0, 0.5);
    background-image: url('@/assets/panel.png');
    background-size: 100% 100%;
  }
  .state-panel-header {
    top: 0%;
    z-index: 1000;
    width: 100%;
    height: 10%;
  }
</style>
