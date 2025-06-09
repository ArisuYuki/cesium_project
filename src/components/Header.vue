<template>
  <div class="nav">
    <div class="my-header">
      <div class="title">无人机公路巡检系统</div>
    </div>
    <!-- <div class="panel-bar">
      <div class="panel-title">无人机规划</div>
      <div class="panel-title">Cesium控制</div>
    </div> -->
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
  .my-header {
    position: relative;
    z-index: 1000;
    width: 100%;
    height: 36px;
    background-color: rgba(0, 0, 0, 0.5);
    background-image: url('@/assets/header_bg.png');
    display: flex;
    justify-content: center;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    .title {
      width: 40%;
      font-size: 24px;
      font-weight: 600;
      text-align: center;
      margin-top: vh(12);
      background: linear-gradient(180deg, #00a9ff 0%, #e8feff 50%), #fffde8;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: vw(6);
      white-space: nowrap;
    }
  }
  .panel-bar {
    z-index: 1000;
    width: 100vw;
    height: 24px;
    background-color: rgba(0, 0, 0, 1);
    display: flex;
    justify-content: space-between;
  }
  .panel-title {
    position: relative;
    z-index: 1000;
    top: -8px;
    max-height: 25px;
    width: 250px;
    background-image: url('@/assets/nav-bg.svg');
    background-size: 100% 100%;
    text-align: center;
  }
</style>
