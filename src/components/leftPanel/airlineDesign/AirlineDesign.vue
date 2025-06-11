<template>
  <div class="airline-design">
    <div class="panel-title flex-center">航线规划面板</div>
    <Sheet :reverse="true">
      <template #title> 航线设置总览 </template>
      <template #content>
        <div class="airline-content">
          <v-number-input
            v-model="altitude"
            label="设定航高"
            variant="outlined"
            density="compact"
            control-variant="split"
            :step="0.5"
            :precision="2"
            hide-details
          ></v-number-input>
          <div class="flex-center">
            <v-switch
              label="自动插值点"
              v-model="interpolate"
              hide-details
              color="primary"
            ></v-switch>
          </div>

          <v-number-input
            v-model="interval"
            label="设定插值距离"
            variant="outlined"
            density="compact"
            control-variant="split"
            :step="10"
            :precision="2"
            hide-details
          ></v-number-input>
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
        </div>
      </template>
    </Sheet>
    <Sheet :reverse="true">
      <template #title> 航面设置总览 </template>
      <template #content>
        <div class="action-btns text">施工中......</div>
      </template>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useCesiumStore } from '@/store/cesiumStore';
  import { useEntityStore } from '@/store/entityStore';
  import { useTipStore } from '@/store/tipStore';
  import { v4 as uuidv4 } from 'uuid';
  import {
    Color,
    ScreenSpaceEventType,
    ScreenSpaceEventHandler,
    Cartesian3,
    Cartographic,
    LabelStyle,
    VerticalOrigin,
    HorizontalOrigin,
    Cartesian2,
    type Entity,
  } from 'cesium';
  const cesiumStore = useCesiumStore();
  const entityStore = useEntityStore();
  const tipStore = useTipStore();
  // 设定的航高
  const altitude = ref(50);
  // 是否插值航点
  const interpolate = ref(true);
  // 插值航点时候所使用距离
  const interval = ref(100);
  let positions: Cartesian3[] = [];
  let airpoint: Entity[] = [];
  let airline: Entity | undefined = undefined;
  function updateAirline() {
    if (airline) {
      cesiumStore.viewer!.entities.remove(airline);
    }
    if (positions.length >= 2) {
      airline = cesiumStore.viewer!.entities.add({
        polyline: {
          positions: positions,
          width: 2,
          material: Color.YELLOW,
        },
      });
    }
  }
  function addPoint(position: Cartesian3, i?: number) {
    if (i == undefined) i = positions.length;
    const point = cesiumStore.viewer!.entities.add({
      position: position,
      point: {
        pixelSize: 5,
        // color: Color.fromCssColorString(color.value),
        outlineColor: Color.WHITE,
        outlineWidth: 0.1,
      },
      description: JSON.stringify({
        type: 'airline',
        description: '',
      }),
      label: {
        text: `航点${i}`, // 显示的文字内容
        font: '12pt sans-serif', // 字体设置
        fillColor: Color.YELLOW, // 文字颜色
        outlineColor: Color.YELLOW, // 文字描边颜色
        outlineWidth: 2, // 描边宽度
        style: LabelStyle.FILL_AND_OUTLINE, // 样式
        verticalOrigin: VerticalOrigin.BOTTOM, // 垂直对齐
        horizontalOrigin: HorizontalOrigin.CENTER, // 水平对齐
        pixelOffset: new Cartesian2(0, -20), // 偏移量(像素)
      },
    });
    airpoint.push(point);
  }
  let handler = undefined as undefined | ScreenSpaceEventHandler;
  function startDraw() {
    if (!handler) {
      handler = new ScreenSpaceEventHandler(cesiumStore.viewer!.scene.canvas);
    }

    airline = undefined;
    airpoint = [];
    positions = [];

    tipStore.tip = '左键开始绘制,右键结束绘制';
    // @ts-expect-error (click类型)
    handler.setInputAction(function (click) {
      const ray = cesiumStore.viewer!.camera.getPickRay(click.position);
      let position = cesiumStore.viewer!.scene.globe.pick(
        ray!,
        cesiumStore.viewer!.scene
      );
      //添加坐标点并更新航线
      if (position) {
        let loglatheight = Cartographic.fromCartesian(position);
        loglatheight.height = altitude.value;
        position = Cartographic.toCartesian(loglatheight);
        positions.push(position);
        addPoint(position);
        updateAirline();
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
    // @ts-expect-error: 未使用参数
    handler.setInputAction((click) => {
      endDraw();
    }, ScreenSpaceEventType.RIGHT_CLICK);
  }
  //插值两个航点
  function interpolatePoints(
    startPoint: Cartesian3,
    endPoint: Cartesian3,
    interval: number
  ) {
    // 计算两点间的距离
    const distance = Cartesian3.distance(startPoint, endPoint);

    // 计算插值的比例
    const ratio = interval / distance;
    const interpolatedPoints = [] as Cartesian3[];
    // 生成插值点
    if (ratio >= 1) return interpolatedPoints;
    for (let i = ratio; i < 1; i += ratio) {
      const interpolatedCartesian = new Cartesian3();
      Cartesian3.lerp(startPoint, endPoint, i, interpolatedCartesian);

      // 转换回经纬度
      const cartographic = Cartographic.fromCartesian(interpolatedCartesian);
      cartographic.height = altitude.value;
      const position = Cartographic.toCartesian(cartographic);
      const distance = Cartesian3.distance(interpolatedCartesian, endPoint);
      //和终点最小间隔也要有设定的一半以防止两个点太接近
      if (distance < interval / 2) break;
      interpolatedPoints.push(position);
    }
    return interpolatedPoints;
  }
  function interpolateAirline() {
    //移除绘制的航线和航点
    cesiumStore.viewer!.entities.remove(airline!);
    for (const point of airpoint) {
      cesiumStore.viewer!.entities.remove(point);
    }
    airpoint = [];
    //插值航点
    const newPositions = [] as Cartesian3[];
    for (let i = 0; i < positions.length - 1; i += 1) {
      const startPoint = positions[i];
      const endPoint = positions[i + 1];
      const interpolatedPoints = interpolatePoints(
        startPoint,
        endPoint,
        interval.value
      );
      console.log(interpolatedPoints.length);
      //第一次才推进去开始点，之后只推进去结束点
      if (i == 0) newPositions.push(startPoint);
      if (interpolatedPoints.length) newPositions.push(...interpolatedPoints);
      newPositions.push(endPoint);
    }
    positions = newPositions;
    for (let i = 0; i < positions.length; ++i) {
      addPoint(positions[i], i + 1);
    }
    updateAirline();
  }
  //结束航线绘制
  function endDraw() {
    if (!handler) {
      tipStore.tip = '请先开始绘制';
      return;
    }
    if (interpolate.value) interpolateAirline();
    //创建一个航线
    entityStore.airline.push({
      id: uuidv4(),
      name: '航线' + entityStore.airline.length,
      airline: airline!,
      airpoint: airpoint,
    });
    //终止绘制
    tipStore.tip = `终止绘制，航线已添加${airpoint.length}个点`;
    handler!.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
    handler = undefined;
  }
</script>

<style scoped lang="scss">
  .airline-design {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: scroll;
    flex-direction: column;
  }
  .panel-title {
    width: 100%;
    height: 24px;
    font-size: 14px;
  }
  .airline-content {
    display: flex;
    flex-direction: column;
    padding: 8px;
    gap: 8px;
  }
  .action-btns {
    display: flex;
    justify-content: space-around;
  }
  .card-btn {
    padding: 0;
  }
</style>
