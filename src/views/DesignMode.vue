<template>
  <div class="design-page">
    <div class="left-panel" :class="{ 'left-hidden': hiddenLeftPanel }">
      <LeftPanel></LeftPanel>
      <v-btn class="left-close-btn" @click="hiddenLeftPanel = !hiddenLeftPanel">
        <v-icon v-if="!hiddenLeftPanel" icon="mdi-chevron-left"></v-icon>
        <v-icon v-else icon="mdi-chevron-right"></v-icon>
      </v-btn>
    </div>
    <div class="middle-panel" :class="{ 'down-hidden': hiddenBottomPanel }">
      <v-btn
        class="bottom-close-btn"
        @click="hiddenBottomPanel = !hiddenBottomPanel"
      >
        <v-icon v-if="!hiddenBottomPanel" icon="mdi-chevron-down"></v-icon>
        <v-icon v-else icon="mdi-chevron-up"></v-icon>
      </v-btn>
      <div class="middle-panel-content">
        <router-view v-slot="{ Component, route }">
          <Transition>
            <component :is="Component" :key="route.path" />
          </Transition>
        </router-view>
      </div>

      <div class="lat-long">
        <div class="text" style="padding-right: 8px">
          经度:{{ cesiumStore.longitude.toFixed(6) }}
        </div>
        <div class="text" style="padding-right: 8px">
          纬度:{{ cesiumStore.latitude.toFixed(6) }}
        </div>
        <!-- <div class="text" style="padding-right:8px">
          高度:{{ cesiumStore.height.toFixed(6) }}
        </div> -->
      </div>
    </div>
    <div class="right-panel" :class="{ 'right-hidden': hiddenRightPanel }">
      <v-btn
        class="right-close-btn"
        @click="hiddenRightPanel = !hiddenRightPanel"
      >
        <v-icon v-if="!hiddenRightPanel" icon="mdi-chevron-right"></v-icon>
        <v-icon v-else icon="mdi-chevron-left"></v-icon>
      </v-btn>
      <RightPanel></RightPanel>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import RightPanel from '../components/rightPanel/RightPanel.vue';
  import LeftPanel from '../components/leftPanel/LeftPanel.vue';
  import { useCesiumStore } from '@/store/cesiumStore';
  const cesiumStore = useCesiumStore();
  const hiddenLeftPanel = ref(false);
  const hiddenRightPanel = ref(false);
  const hiddenBottomPanel = ref(false);
</script>

<style lang="scss" scoped>
  .design-page {
    width: 100vw;
    height: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
  }
  .left-panel-title {
    width: 100%;
    height: 64px;
    background-color: rgb(13, 29, 92);
  }

  .left-panel,
  .right-panel {
    height: 100%;
    width: 18%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .middle-panel {
    width: calc(100vw - 36% - 16px);
    height: 33%;
    flex-direction: column;
  }
  .left-panel,
  .middle-panel,
  .right-panel {
    z-index: 1000;
    border-radius: 5px;
    position: relative;
    align-self: flex-end;
    transition: all 1s;
    display: flex;
    z-index: 1000;
  }
  .left-close-btn {
    position: absolute;
    min-width: 12px;
    min-height: 64px;
    right: 0%;
    top: 50%;
    transform: translateY(-100%);
    padding: 0px;
    background-color: rgb(13, 29, 92);
    z-index: 1001;
  }
  .right-close-btn {
    position: absolute;
    min-width: 12px;
    min-height: 64px;
    left: 0%;
    top: 50%;
    transform: translateY(-100%);
    padding: 0px;
    background-color: rgb(13, 29, 92);
    z-index: 1001;
  }
  .bottom-close-btn {
    position: absolute;
    min-width: 64px;
    max-height: 18px;
    left: 50%;
    top: 0%;
    transform: translateX(-50%);
    padding: 0px;
    background-color: rgb(13, 29, 92);
    z-index: 1001;
  }

  //向左隐藏面板动画
  .right-hidden {
    transform: translateX(95%);
  }
  .left-hidden {
    transform: translateX(-95%);
  }
  .down-hidden {
    transform: translateY(95%);
  }
  .middle-panel-content {
    flex: 1;
    overflow: scroll;
  }
  .lat-long {
    position: absolute;
    bottom: 0;
    align-self: flex-end;
    display: flex;
    gap: 10px;
  }
  //设置路由动画
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
