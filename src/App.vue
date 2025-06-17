<template>
  <v-app class="app">
    <v-main>
      <RouterView> </RouterView>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>

<style scoped lang="scss">
  .app {
    user-select: none;
    width: 100vw;
    height: 100vh;
  }
  :deep(.v-label) {
    font-size: 12px;
  }
  :deep(.v-select__selection) {
    font-size: 12px;
  }
  :deep(.v-field__field) {
    font-size: 12px;
  }
  :deep(.v-expansion-panel) {
    background-color: rgba($color: #000000, $alpha: 0.5);
  }

  :deep(.v-expansion-panel-title) {
    font-size: 12px;
    padding: 0px 12px;
  }
  :deep(.v-expansion-panel-text__wrapper) {
    font-size: 12px;
    padding: 0px 12px;
  }
  :deep(.v-tab.v-tab.v-btn) {
    min-height: 24px;
    height: 24px;
    min-width: 0px;
    padding: 0;
    font-size: 12px;
  }
  :deep(.v-slide-group) {
    height: 24px;
  }
  :deep(.text) {
    font-size: 12px;
  }
  :deep(.flex-center) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  :deep(.main-color) {
    background-color: rgba(12, 17, 37, 0.6);
  }
  :deep(.placeholder) {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
