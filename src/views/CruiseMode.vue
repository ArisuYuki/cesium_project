<template>
  <div class="cruise-page">
    <div class="left-panel">
      <AircraftPanel></AircraftPanel>
    </div>
    <div class="right-panel">
      <div class="top-panel">
        <div class="aircraft-view"></div>
        <div class="cesium-view-container">
          <div id="cesium-view"></div>
        </div>
      </div>
      <div class="bottom-panel"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import AircraftPanel from '@/components/AircraftPanel/AircraftPanel.vue';
</script>

<style lang="scss" scoped>
  .cruise-page {
    width: 100vw;
    height: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
    gap: 8px;
  }
  .left-panel-title {
    width: 100%;
    height: 64px;
    background-color: rgb(13, 29, 92);
  }

  .left-panel {
    height: 100%;
    width: 20%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .left-panel {
    z-index: 1000;
    border-radius: 5px;
    position: relative;
    align-self: flex-end;
    transition: all 1s;
    display: flex;
    z-index: 1000;
  }
  .right-panel {
    flex: 1;
    gap: 8px;
    display: flex;
    flex-direction: column;
  }
  .top-panel {
    width: 100%;
    height: 70%;
    display: flex;
    gap: 8px;
  }
  .bottom-panel {
    flex: 1;
    background-image: url('@/assets/panel.png');
    background-size: 100% 100%;
    position: relative;
    z-index: 1000;
  }
  .aircraft-view {
    width: calc(50% - 4px);
    height: 100%;
    background-image: url('@/assets/panel.png');
    background-size: 100% 100%;
    position: relative;
    z-index: 1000;
  }
  .cesium-view-container {
    width: calc(50% - 4px);
    height: 100%;
    position: relative;
    //禁用鼠标点击事件
    pointer-events: none;
  }
  #cesium-view {
    width: calc(50% - 4px);
    height: 100%;
    background-image: url('@/assets/panel.png');
    background-size: 100% 100%;
    position: absolute;
    z-index: 1000;
    //禁用鼠标点击事件
    pointer-events: none;
    right: 0;
    animation: show-cesium 1s forwards;
  }
  @keyframes show-cesium {
    0% {
      width: 100vw;
      height: 100vh;
    }
    100% {
      width: 100%;
      height: 100%;
    }
  }
</style>
