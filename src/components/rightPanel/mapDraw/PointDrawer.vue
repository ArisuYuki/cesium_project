<template>
  <div class="point-drawer">
    <v-number-input
      v-model="size"
      label="大小"
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
    Cartesian3,
    Cartesian2,
  } from 'cesium';
  const cesiumStore = useCesiumStore();
  const tipStore = useTipStore();
  const entityStore = useEntityStore();
  const dialog = ref(false);
  const color = ref('#ff0000');
  function getColor(selectColor: string) {
    dialog.value = false;
    color.value = selectColor;
  }
  const size = ref(10);
  function addPoint(position: Cartesian3) {
    const point = cesiumStore.viewer!.entities.add({
      position: position,
      point: {
        pixelSize: size.value,
        color: Color.fromCssColorString(color.value),
        outlineColor: Color.WHITE,
        outlineWidth: 0.1,
      },
      description: JSON.stringify({
        type: 'point',
        description: '',
      }),
      label: {
        text: '', // 显示的文字内容
      },
    });
    entityStore.point.push(point);
    return point;
  }

  let handler = undefined as unknown as ScreenSpaceEventHandler;
  function startDraw() {
    if (!handler) {
      handler = new ScreenSpaceEventHandler(cesiumStore.viewer!.scene.canvas);
    }
    tipStore.tip = '左键开始绘制';

    handler.setInputAction(function (click: { position: Cartesian2 }) {
      const ray = cesiumStore.viewer!.camera.getPickRay(click.position);
      const position = cesiumStore.viewer!.scene.globe.pick(
        ray!,
        cesiumStore.viewer!.scene
      );

      if (position) {
        // 添加点
        addPoint(position);
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
    // 右键点击结束绘制

    // @ts-expect-error: Unreachable code error
    handler.setInputAction((click) => {
      endDraw();
    }, ScreenSpaceEventType.RIGHT_CLICK);
  }
  function endDraw() {
    tipStore.tip = `终止绘制，已绘制${entityStore.point.length}个点`;
    handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
  }
</script>

<style scoped lang="scss">
  .point-drawer {
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
