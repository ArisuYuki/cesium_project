<template>
  <div class="aircraft-entity">
    <div class="aircraft-control-container">
      <div class="text flex-center">点坐标控制</div>
      <v-select
        label="坐标系统"
        variant="outlined"
        item-value="value"
        item-title="text"
        v-model="posMode"
        density="compact"
        hide-details
        :items="[
          {
            text: '空间坐标',
            value: 'WGS84',
          },
          {
            text: '地理坐标',
            value: 'degree',
          },
        ]"
      ></v-select>
      <v-number-input
        v-model="x"
        :label="label[0]"
        variant="outlined"
        density="compact"
        control-variant="split"
        :step="0.001"
        :precision="6"
        disabled
      ></v-number-input>
      <v-number-input
        v-model="y"
        :label="label[1]"
        variant="outlined"
        density="compact"
        control-variant="split"
        :step="0.001"
        :precision="6"
        disabled
      ></v-number-input>
      <v-number-input
        v-model="z"
        :label="label[2]"
        variant="outlined"
        density="compact"
        control-variant="split"
        :step="1"
        :precision="6"
        disabled
      ></v-number-input>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onUnmounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useEntityStore } from '@/store/entityStore';
  import { useTipStore } from '@/store/tipStore';
  import { Cartographic, Math } from 'cesium';
  const router = useRouter();
  const route = useRoute();
  const tipStore = useTipStore();
  const entityStore = useEntityStore();
  const aircraftID = route.params.id as string;
  if (!entityStore.aircraft.length) router.push({ name: 'design' });
  const aircraft = entityStore.aircraft.find(
    (item) => item.aircraftEntity!.id === aircraftID
  )!;

  const position = Cartographic.fromCartesian(
    aircraft.aircraftEntity!.position!.getValue()!
  );
  const x = ref(Math.toDegrees(position!.longitude));
  const y = ref(Math.toDegrees(position!.latitude));
  const z = ref(position!.height);

  const posMode = ref('degree');
  const label = ref(['经度', '纬度', '高度']);

  //状态更新定时器ID
  const IntervalID = setInterval(() => {
    updateStatus();
  }, 1000);
  //卸载组件时移除定时器
  onUnmounted(() => {
    clearInterval(IntervalID);
  });
  //更新无人机状态
  function updateStatus() {
    //查询更新无人机位置
    const currentX = entityStore.currentEntity?.position!.getValue()!
      .x as number;
    const currentY = entityStore.currentEntity?.position!.getValue()!
      .y as number;
    const currentZ = entityStore.currentEntity?.position!.getValue()!
      .z as number;
    if (posMode.value == 'WGS84') {
      label.value = ['x', 'y', 'z'];
      x.value = currentX;
      y.value = currentY;
      z.value = currentZ;
    } else {
      label.value = ['经度', '纬度', '高度'];
      //  空间坐标转地理坐标
      const cartographic = Cartographic.fromCartesian(
        entityStore.currentEntity!.position!.getValue()!
      );
      x.value = Math.toDegrees(cartographic.longitude);
      y.value = Math.toDegrees(cartographic.latitude);
      z.value = cartographic.height;
    }
  }
</script>

<style scoped lang="scss">
  .aircraft-entity {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .aircraft-control-container {
    display: flex;
    height: 40px;
    gap: 20px;
  }
</style>
