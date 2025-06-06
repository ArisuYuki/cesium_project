<template>
  <div class="layout">
    <Header></Header>
    <div class="container">
      <CesiumViewer></CesiumViewer>
      <router-view v-slot="{ Component }">
        <Transition>
          <component :is="Component" />
        </Transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CesiumViewer from '@/components/publicComponents/CesiumViewer.vue';
  import Header from '@/components/Header.vue';
</script>

<style lang="scss" scoped>
  .layout {
    width: 100vw;
    height: 100vh;
    background-image: url('@/assets/bg.png');
    background-size: 100% 100%;
  }
  .container {
    width: 100%;
    height: calc(100% - 36px);
    position: relative;
  }
  //设置路由动画
  .v-enter-active {
    animation: enter 1s cubic-bezier(0.455, 0.03, 0.515, 0.955) !important;
    position: absolute !important;
    z-index: 1000;
  }
  .v-leave-active {
    animation: leave 1s cubic-bezier(0.455, 0.03, 0.515, 0.955) !important;
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
