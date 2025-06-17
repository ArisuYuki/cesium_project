<template>
  <div class="state-panel-container">
    <div class="state-panel">
      <div class="left-border" @click="preTab"></div>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="1">
          <div class="circle-container">
            <div class="circle">
              <div class="circle_out"></div>
              <div class="circle_in"></div>
              <div class="start-btn" @click="goCruise"></div>
            </div>
          </div>
        </v-tabs-window-item>
        <v-tabs-window-item value="2">
          <div class="bottom-content">
            <div class="placeholder">施工中...</div>
          </div>
        </v-tabs-window-item>
        <v-tabs-window-item value="3">
          <div class="bottom-content">
            <div class="placeholder">施工中...</div>
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
      <div class="right-border" @click="nextTab"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useCesiumStore } from '@/store/cesiumStore';
  import { useEntityStore } from '@/store/entityStore';
  import { useRouter } from 'vue-router';
  import { HeadingPitchRange, Math, SceneMode } from 'cesium';
  const router = useRouter();
  const cesiumStore = useCesiumStore();
  const entityStore = useEntityStore();
  function goCruise() {
    cesiumStore.viewer!.scene.mode = SceneMode.SCENE3D;
    router.push({ name: 'cruise' });
    // 流畅飞向实体
    cesiumStore.viewer!.flyTo(entityStore.aircraft[0].aircraftEntity!, {
      offset: new HeadingPitchRange(
        Math.toRadians(0), // 朝向角
        Math.toRadians(-45), // 俯仰角
        28.284271 // 距离(米)
      ),
      duration: 2, // 动画持续时间(秒)
    });
  }
  const tab = ref('1');
  function nextTab() {
    let next = parseInt(tab.value) + 1;
    if (next > 3) {
      next = 1;
    }
    tab.value = next.toString();
  }
  function preTab() {
    let next = parseInt(tab.value) - 1;
    if (next < 1) {
      next = 3;
    }
    tab.value = next.toString();
  }
</script>

<style lang="scss" scoped>
  .state-panel-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.5);
    background-image: url('@/assets/panel.png');
    background-size: 100% 100%;
  }
  .state-panel {
    display: flex;
    flex: 1;
    position: relative;
    align-items: center;
    justify-content: center;
  }
  .state-panel-header {
    top: 0%;
    z-index: 1000;
    width: 100%;
    height: 10%;
  }
  :deep(.v-tabs-window) {
    height: 100%;
    width: 80%;
  }
  :deep(.v-tabs-window-item) {
    height: 100%;
    width: 100%;
  }
  .circle-container {
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .circle {
    height: 70%;
    aspect-ratio: 1 / 1; /* 宽高比1:1 */
    position: relative;
  }
  .circle_in {
    position: absolute;
    background-image: url('@/assets/circle_in.png');
    background-size: 100% 100%;
    height: 100%;
    aspect-ratio: 1 / 1; /* 宽高比1:1 */
    animation: rotate-in 30s linear infinite;
  }
  .circle_out {
    position: absolute;
    background-image: url('@/assets/circle_out.png');
    background-size: 100% 100%;
    height: 100%;
    aspect-ratio: 1 / 1; /* 宽高比1:1 */
    animation: rotate-out 30s linear infinite;
  }
  .start-btn {
    position: absolute;
    background-image: url('@/assets/start.svg');
    background-size: 100% 100%;
    top: 50%;
    left: 50%;
    height: 40px;
    width: 40px;
    transform: translate(-50%, -50%);
    z-index: 1000;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
  }
  .start-btn:hover {
    transform: translate(-50%, -50%) scale(1.2);
    //设置圆形发光
    filter: drop-shadow(0 0 10px #fff) drop-shadow(0 0 20px rgb(4, 17, 114))
      drop-shadow(0 0 30px #0ff);
  }

  //无限逆时针旋转动画
  @keyframes rotate-out {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }
  @keyframes rotate-in {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .overview-info {
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .left-border {
    background-image: url('@/assets/left-border.png');
    background-size: 100% 100%;
    height: 70%;
    width: 60px;
    cursor: pointer;
    transition: all 0.1s;
    &:hover {
      //设置圆形发光
      filter: drop-shadow(0 0 10px #fff) drop-shadow(0 0 20px rgb(4, 17, 114))
        drop-shadow(0 0 30px #0ff);
    }
    &:active {
      transform: scale(0.8);
    }
  }
  .right-border {
    background-image: url('@/assets/right-border.png');
    background-size: 100% 100%;
    height: 70%;
    width: 60px;
    cursor: pointer;
    transition: all 0.1s;
    &:hover {
      //设置圆形发光
      filter: drop-shadow(0 0 10px #fff) drop-shadow(0 0 20px rgb(4, 17, 114))
        drop-shadow(0 0 30px #0ff);
    }
    &:active {
      transform: scale(0.8);
    }
  }
  .overview-content {
    display: flex;
    height: 100%;
    width: 60%;
  }
  .bottom-content {
    height: 100%;
    width: 100%;
    padding: 8px;
  }
</style>
