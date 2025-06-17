<template>
  <div class="cruise-page">
    <div class="left-panel">
      <AircraftPanel></AircraftPanel>
    </div>
    <div class="right-panel">
      <div class="top-panel">
        <div class="aircraft-view">
          <CameraView></CameraView>
        </div>
        <div class="cesium-view-container">
          <div class="aircraft-list">
            <v-icon
              icon="mdi-fan"
              :class="{ 'rotate-fan': changeAircraft }"
            ></v-icon>
            <v-select
              v-model="selectedAircraft"
              :items="aircraftList"
              item-title="name"
              item-value="id"
              class="aircraft-select"
              density="compact"
              variant="underlined"
              hide-details
            ></v-select>
          </div>
          <div id="cesium-view"></div>
          <div class="aircraft-control">
            <div class="controller">
              <v-tooltip
                activator="parent"
                location="top"
                text="起飞"
              ></v-tooltip>
              <div class="controller-container">
                <div class="controller-out">
                  <div v-show="leftBtnForward" class="mask-forward"></div>
                  <div v-show="leftBtnBack" class="mask-back"></div>
                  <div v-show="leftBtnLeft" class="mask-left"></div>
                  <div v-show="leftBtnRight" class="mask-right"></div>
                </div>
                <div class="controller-in left"></div>
                <div class="controller-btn"></div>
              </div>
            </div>
            <div class="controller">
              <v-tooltip
                activator="parent"
                location="top"
                text="返航"
              ></v-tooltip>
              <div class="controller-container">
                <div class="controller-out">
                  <div v-show="rightBtnForward" class="mask-forward"></div>
                  <div v-show="rightBtnBack" class="mask-back"></div>
                  <div v-show="rightBtnLeft" class="mask-left"></div>
                  <div v-show="rightBtnRight" class="mask-right"></div>
                </div>
                <div class="controller-in right"></div>
                <div class="controller-btn"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-panel">
        <RouterView>
          <template v-slot:default="{ Component }">
            <component :is="Component" />
          </template>
        </RouterView>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import AircraftPanel from '@/components/AircraftPanel/AircraftPanel.vue';
  import BottomPanel from '@/views/cruiseMode/AircraftBottomPanel.vue';
  import CameraView from '@/views/cruiseMode/CameraView.vue';
  import { useCesiumStore } from '@/store/cesiumStore';
  import { useEntityStore } from '@/store/entityStore';
  import { HeadingPitchRange, Math, Cartesian3, Entity } from 'cesium';
  import { watch, ref, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const cesiumStore = useCesiumStore();
  const entityStore = useEntityStore();

  if (!entityStore.aircraft.length) router.push({ name: 'design' });
  const aircraftList = ref(
    entityStore.aircraft.map((aircraft) => {
      return {
        id: aircraft.aircraftEntity!.id,
        name: aircraft.statusInfo!.name,
      };
    })
  );
  const selectedAircraft = ref(aircraftList.value[0].id);
  const changeAircraft = ref(false);
  watch(
    selectedAircraft,
    () => {
      const aircraft = entityStore.aircraft.find(
        (aircraft) => aircraft.aircraftEntity!.id === selectedAircraft.value
      )!;
      if (!aircraft) return;
      //设置当前选中的飞机
      entityStore.currentAircraft = aircraft;

      router.push({
        name: 'cruise-aircraft',
        params: { id: aircraft.aircraftEntity!.id },
      });

      flyToAircraft(aircraft.aircraftEntity!);
      changeAircraft.value = true;
      setTimeout(() => {
        changeAircraft.value = false;
      }, 2000);
    },
    {
      immediate: true,
    }
  );
  // 流畅飞向实体
  function flyToAircraft(aircraftEntity: Entity) {
    cesiumStore
      .viewer!.flyTo(aircraftEntity, {
        offset: new HeadingPitchRange(
          Math.toRadians(0), // 朝向角
          Math.toRadians(-45), // 俯仰角
          28.284271 // 距离(米)
        ),
        duration: 2, // 动画持续时间(秒)
      })
      .then(function () {
        // 飞行完成后锁定实体
        // @ts-expect-error: 设定视角
        aircraftEntity!.viewFrom = new Cartesian3(0, -20, 20);
        cesiumStore.viewer!.trackedEntity = aircraftEntity!;
      });
    entityStore.currentAircraft = entityStore.aircraft.find(
      (aircraft) => aircraft.aircraftEntity!.id === aircraftEntity.id
    );
  }

  const leftBtnForward = ref(false);
  const leftBtnBack = ref(false);
  const leftBtnLeft = ref(false);
  const leftBtnRight = ref(false);
  const rightBtnForward = ref(false);
  const rightBtnBack = ref(false);
  const rightBtnLeft = ref(false);
  const rightBtnRight = ref(false);

  // @ts-expect-error: 缺少类型定义
  const keyup = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        rightBtnForward.value = false;
        break;
      case 'ArrowDown':
        rightBtnBack.value = false;
        break;
      case 'ArrowLeft':
        rightBtnLeft.value = false;
        break;
      case 'ArrowRight':
        rightBtnRight.value = false;
        break;
      case 'w':
        leftBtnForward.value = false;
        break;
      case 's':
        leftBtnBack.value = false;
        break;
      case 'a':
        leftBtnLeft.value = false;
        break;
      case 'd':
        leftBtnRight.value = false;
        break;
    }
  };
  // @ts-expect-error: 缺少类型定义
  const keydown = (e) => {
    e.preventDefault();
    switch (e.key) {
      case 'ArrowUp':
        rightBtnForward.value = true;
        break;
      case 'ArrowDown':
        rightBtnBack.value = true;
        break;
      case 'ArrowLeft':
        rightBtnLeft.value = true;
        break;
      case 'ArrowRight':
        rightBtnRight.value = true;
        break;
      case 'w':
        leftBtnForward.value = true;
        break;
      case 's':
        leftBtnBack.value = true;
        break;
      case 'a':
        leftBtnLeft.value = true;
        break;
      case 'd':
        leftBtnRight.value = true;
        break;
    }
  };
  //监听键盘按键
  window.addEventListener('keydown', keydown);
  window.addEventListener('keyup', keyup);

  /**
   * @description: 每秒发送更新位置请求,待做，必须配合服务器
   */

  onUnmounted(() => {
    window.removeEventListener('keydown', keydown);
    window.removeEventListener('keyup', keyup);
  });
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
    width: 100%;
    height: calc(30% - 8px);
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
  .aircraft-control {
    position: absolute;
    height: 150px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    bottom: 0;
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
  .aircraft-list {
    position: absolute;
    top: 2%;
    right: 2%;
    z-index: 1000;
    pointer-events: all;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .aircraft-select {
    margin-left: 16px;
  }
  :deep(.v-field__input) {
    padding: 0;
  }
  :deep(.v-field__append-inner) {
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
  }
  .rotate-fan {
    animation: rotate 2s ease-in-out;
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(1800deg);
    }
  }

  .controller {
    height: 100%;
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: all;
  }
  .controller-container {
    width: 80%;
    height: 80%;
    position: relative;
  }
  .controller-out {
    position: absolute;
    background-image: url('@/assets/aircraft-circle.png');
    background-size: 100% 100%;
    height: 70%;
    aspect-ratio: 1 / 1; /* 宽高比1:1 */
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    filter: drop-shadow(0 0 10px #001477) drop-shadow(0 0 20px rgb(0, 0, 0))
      drop-shadow(0 0 30px rgba(85, 255, 255, 0.605));
    z-index: 999;
  }
  .controller-in {
    position: absolute;
    background-image: url('@/assets/circle_in.png');
    background-size: 100% 100%;
    height: 100%;
    aspect-ratio: 1 / 1; /* 宽高比1:1 */
    z-index: 1000;
    pointer-events: none;
  }
  .left {
    animation: rotate-in 30s linear infinite;
  }
  .right {
    animation: rotate-in 30s linear infinite reverse;
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
  .controller-btn {
    position: absolute;
    background-image: url('@/assets/btn.png');
    background-size: 100% 100%;
    height: 80px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    aspect-ratio: 1 / 1; /* 宽高比1:1 */
    z-index: 1000;
    transition: all 0.1s ease-in-out;
  }
  .controller-btn:active {
    // filter: drop-shadow(0 0 10px #001477) drop-shadow(0 0 20px rgb(0, 0, 0))
    //   drop-shadow(0 0 30px rgba(85, 255, 255, 0.605));
    transform: translate(-50%, -50%) scale(0.9);
    cursor: pointer;
  }
  .mask-forward {
    position: absolute;
    width: 50%;
    height: 50%;
    // background-color: rgba(0, 1, 74, 0.459);
    border-radius: 100% 0 0 0;
    z-index: 1;
    background: linear-gradient(
      to left top,
      transparent,
      rgba(0, 0, 1, 0.459) 50%
    );
  }
  .mask-back {
    position: absolute;
    width: 50%;
    height: 50%;
    right: 0%;
    bottom: 0%;
    // background-color: rgba(0, 1, 74, 0.459);
    border-radius: 0 0 100% 0;
    z-index: 1;
    background: linear-gradient(
      to right bottom,
      transparent,
      rgba(0, 0, 1, 0.459) 50%
    );
  }
  .mask-left {
    position: absolute;
    width: 50%;
    height: 50%;
    // background-color: rgba(0, 1, 74, 0.459);
    border-radius: 0 0 0 100%;
    bottom: 0%;
    z-index: 1;
    background: linear-gradient(
      to left bottom,
      transparent,
      rgba(0, 0, 1, 0.459) 50%
    );
  }
  .mask-right {
    position: absolute;
    width: 50%;
    height: 50%;
    right: 0%;
    // background-color: rgba(0, 1, 74, 0.459);
    border-radius: 0 100% 0 0;
    z-index: 1;
    background: linear-gradient(
      to right top,
      transparent,
      rgba(0, 0, 1, 0.459) 50%
    );
  }
</style>
