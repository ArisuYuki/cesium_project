<template>
  <div class="line-drawer">
    <v-number-input
      v-model="size"
      label="粗细"
      variant="outlined"
      density="compact"
      control-variant="split"
      :step="0.5"
      :precision="1"
      hide-details
    ></v-number-input>
    <div class="color-picker">
      <v-spacer></v-spacer>
      <div>颜色</div>
      <v-spacer></v-spacer>
      <div
        class="color"
        :style="{ backgroundColor: color }"
        @click="dialog = true"
      ></div>
      <v-spacer></v-spacer>
    </div>
    <div class="action-btns">
      <v-spacer></v-spacer>
      <v-switch
        label="自动闭合"
        v-model="autoConnect"
        hide-details
        color="primary"
      ></v-switch>
      <v-spacer></v-spacer>
    </div>

    <div class="action-btns">
      <v-btn
        variant="outlined"
        style="font-size: 12px"
        class="card-btn"
        @click="startDraw"
      >
        开始绘制</v-btn
      >
      <v-btn
        variant="outlined"
        style="font-size: 12px"
        class="card-btn"
        @click="endDraw"
      >
        结束绘制</v-btn
      >
    </div>
    <ColorDialogs
      v-if="dialog"
      @close-dialog="getColor"
      :color="color"
    ></ColorDialogs>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import ColorDialogs from '@/components/publicComponents/ColorDialogs.vue';
  import { useCesiumStore } from '@/store/cesiumStore';
  import { useTipStore } from '@/store/tipStore';
  import { useEntityStore } from '@/store/entityStore';
  import {
    Color,
    ScreenSpaceEventType,
    ScreenSpaceEventHandler,
    Entity,
    Cartesian3,
  } from 'cesium';
  const cesiumStore = useCesiumStore();
  const tipStore = useTipStore();
  const entityStore = useEntityStore();
  const dialog = ref(false);
  const autoConnect = ref(false);
  const color = ref('#ff0000');
  function getColor(selectColor: string) {
    dialog.value = false;
    color.value = selectColor;
  }
  const size = ref(3);

  let polylineEntity = undefined as unknown as Entity;
  let positions = [] as Cartesian3[];

  function updatePolyline() {
    if (polylineEntity) {
      cesiumStore.viewer!.entities.remove(polylineEntity);
    }

    if (positions.length >= 2) {
      polylineEntity = cesiumStore.viewer!.entities.add({
        polyline: {
          positions: positions,
          width: size.value,
          material: Color.fromCssColorString(color.value),
        },
        description: JSON.stringify({
          type: 'line',
          description: '',
        }),
      });
    }
  }
  let handler = undefined as unknown as ScreenSpaceEventHandler;
  function startDraw() {
    if (!handler) {
      handler = new ScreenSpaceEventHandler(cesiumStore.viewer!.scene.canvas);
    }
    polylineEntity = undefined as unknown as Entity;
    positions = [] as Cartesian3[];
    tipStore.tip = '左键开始绘制';
    // @ts-expect-error (click类型)
    handler.setInputAction(function (click) {
      const ray = cesiumStore.viewer!.camera.getPickRay(click.position);
      const position = cesiumStore.viewer!.scene.globe.pick(
        ray!,
        cesiumStore.viewer!.scene
      );

      if (position) {
        positions.push(position);
        updatePolyline();
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
    // @ts-expect-error: 未使用参数
    handler.setInputAction((click) => {
      endDraw();
    }, ScreenSpaceEventType.RIGHT_CLICK);
  }
  function endDraw() {
    if (autoConnect.value) {
      polylineEntity = cesiumStore.viewer!.entities.add({
        polyline: {
          positions: [...positions, positions[0]],
          width: size.value,
          material: Color.fromCssColorString(color.value),
        },
        description: JSON.stringify({
          type: 'line',
          description: '',
        }),
      });
    }
    entityStore.line.push(polylineEntity);
    tipStore.tip = `终止绘制，已绘制${entityStore.line.length}条线`;
    handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
  }
</script>

<style scoped lang="scss">
  .line-drawer {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .action-btns {
    display: flex;
    justify-content: space-around;
  }
  .card-btn {
    padding: 0;
  }
  .color-picker {
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .color {
    height: 1rem;
    width: 50%;
    border-radius: 2px;
    cursor: pointer;
  }
</style>
