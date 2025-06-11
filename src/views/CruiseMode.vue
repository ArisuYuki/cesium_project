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
        </div>
      </div>
      <div class="bottom-panel">
        <BottomPanel></BottomPanel>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import AircraftPanel from '@/components/AircraftPanel/AircraftPanel.vue';
  import BottomPanel from './cruiseMode/AircraftBottomPanel.vue';
  import CameraView from './cruiseMode/CameraView.vue';
  import { useCesiumStore } from '@/store/cesiumStore';
  import { useEntityStore } from '@/store/entityStore';
  import { HeadingPitchRange, Math, Cartesian3, Entity } from 'cesium';
  import { watch, ref } from 'vue';
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
</style>
