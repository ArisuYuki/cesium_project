<template>
  <div class="entity-content">
    <div class="state-panel-header"></div>
    <RouterView>
      <template v-slot:default="{ Component }">
        <component :is="Component" />
      </template>
    </RouterView>
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
  } //设置路由动画
  .v-enter-active {
    animation: enter 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955) !important;
    position: absolute !important;
    z-index: 1000;
  }
  .v-leave-active {
    animation: leave 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955) !important;
    position: absolute !important;
    z-index: 1000;
  }
  @keyframes leave {
    0% {
      transform: translate(0%, 0%);
      opacity: 1;
    }
    100% {
      transform: translate(0%, 100%);
      opacity: 0;
    }
  }
  @keyframes enter {
    0% {
      transform: translate(0%, 100%);
      opacity: 0;
    }
    100% {
      transform: translate(0%, 0%);
      opacity: 1;
    }
  }
</style>
