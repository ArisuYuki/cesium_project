<template>
  <div class="polygon-drawer">
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
    PolylineDashMaterialProperty,
    Color,
    ScreenSpaceEventType,
    ScreenSpaceEventHandler,
    Entity,
    Cartesian3,
    PolygonHierarchy,
    ColorMaterialProperty,
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

  let tempLine = undefined as Entity | undefined;
  let polygon = undefined as unknown as Entity;
  let positions = [] as Cartesian3[];
  function updatePolygon() {
    // 移除之前的临时线
    if (tempLine) {
      cesiumStore.viewer!.entities.remove(tempLine);
      tempLine = undefined;
    }

    // 移除之前的多边形
    if (polygon) {
      cesiumStore.viewer!.entities.remove(polygon);
    }

    // 如果有至少3个点，绘制多边形
    if (positions.length >= 3) {
      polygon = cesiumStore.viewer!.entities.add({
        polygon: {
          hierarchy: new PolygonHierarchy(positions),
          material: new ColorMaterialProperty(
            Color.fromCssColorString(color.value)
          ),
          outline: true,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
        },
        description: JSON.stringify({
          type: 'draw-polygon',
          description: '',
        }),
      });
    }

    // 如果有至少2个点，绘制临时线（最后一条边）
    if (positions.length >= 2) {
      const tempPositions = [
        positions[positions.length - 1],
        positions[0], // 连接到第一个点形成闭合
      ];

      tempLine = cesiumStore.viewer!.entities.add({
        polyline: {
          positions: tempPositions,
          width: 2,
          material: new PolylineDashMaterialProperty({
            color: Color.fromCssColorString(color.value),
          }),
        },
        description: JSON.stringify({
          type: 'draw-polygon',
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
    polygon = undefined as unknown as Entity;
    positions = [] as Cartesian3[];
    tipStore.tip = '左键开始绘制';
    // @ts-expect-error: 未使用参数
    handler.setInputAction(function (click) {
      const ray = cesiumStore.viewer!.camera.getPickRay(click.position);
      const position = cesiumStore.viewer!.scene.globe.pick(
        ray!,
        cesiumStore.viewer!.scene
      );

      if (position) {
        positions.push(position);
        updatePolygon();
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(function () {
      endDraw();
    }, ScreenSpaceEventType.RIGHT_CLICK);
  }
  function endDraw() {
    entityStore.draw.polygon.push(polygon);
    tipStore.tip = `终止绘制，已绘制${entityStore.draw.polygon.length}个面`;
    handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
  }
</script>

<style scoped lang="scss">
  .polygon-drawer {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .action-btns {
    display: flex;
    justify-content: space-between;
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
