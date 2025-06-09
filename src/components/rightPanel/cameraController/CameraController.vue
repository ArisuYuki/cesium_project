<template>
  <div class="camera-controller">
    <v-slider
      v-model="heading"
      label="偏航角"
      min="0"
      max="360"
      thumb-label
      @wheel.prevent="handleWheel($event, 1, 0, 360)"
      @end="setCameraAngle"
    ></v-slider>
    <v-slider
      v-model="pitch"
      label="俯仰角"
      min="-270"
      max="90"
      thumb-label
      @wheel.prevent="handleWheel($event, 2, -270, 90)"
      @end="setCameraAngle"
    ></v-slider>
    <v-slider
      v-model="roll"
      label="滚动角"
      min="-180"
      max="180"
      thumb-label
      @wheel.prevent="handleWheel($event, 3, -180, 180)"
      @end="setCameraAngle"
    ></v-slider>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useCesiumStore } from '@/store/cesiumStore';
  import { Math } from 'cesium';

  const cesiumStore = useCesiumStore();
  const longitude = ref(0);
  const latitude = ref(0);
  const height = ref(0);
  const heading = ref(360);
  const pitch = ref(-90);
  const roll = ref(0);
  let operating = false;
  watch(
    () => [
      cesiumStore.camera.height,
      cesiumStore.camera.pitch,
      cesiumStore.camera.roll,
    ],
    () => {
      if (operating == true) return;
      longitude.value = cesiumStore.camera.longitude;
      latitude.value = cesiumStore.camera.latitude;
      height.value = cesiumStore.camera.height;
      heading.value = cesiumStore.camera.heading;
      pitch.value = cesiumStore.camera.pitch;
      roll.value = cesiumStore.camera.roll;
      //初始化之后解除
    }
  );
  function handleWheel(
    event: WheelEvent,
    dataType: number,
    rangeStart: number,
    rangeEnd: number
  ) {
    let data = undefined;
    if (dataType == 1) data = heading;
    else if (dataType == 2) data = pitch;
    else if (dataType == 3) data = roll;
    else return;
    if (event.deltaY > 0) {
      data.value = data.value + 1;
      if (data.value > rangeEnd) data.value = rangeEnd;
    } else if (event.deltaY < 0) {
      data.value = data.value - 1;
      if (data.value < rangeStart) data.value = rangeStart;
    }
    setCameraAngle();
  }
  let timeoutID = 0;
  function setCameraAngle() {
    operating = true;
    cesiumStore.viewer!.camera.setView({
      // 目标位置（需指定，可以是当前相机位置）
      // destination: cesiumStore.viewer!.camera.position,
      // 方向（角度需转换为弧度）
      orientation: {
        heading: Math.toRadians(heading.value), // 偏航角（绕负Z轴）
        pitch: Math.toRadians(pitch.value), // 俯仰角（绕负Y轴）
        roll: Math.toRadians(roll.value), // 翻滚角（绕正X轴）
      },
    });
    if (timeoutID == 0) {
      timeoutID = setTimeout(() => {
        operating = false;
        timeoutID = 0;
      }, 1000);
    }
  }
</script>

<style scoped lang="scss">
  .camera-controller {
    padding: 0px 8px;
  }
</style>
