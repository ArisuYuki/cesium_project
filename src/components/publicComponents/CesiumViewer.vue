<template>
  <div>
    <div id="cesiumContainer" :class="{ 'cesium-view': cesiumStyle }"></div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useCesiumStore } from '@/store/cesiumStore';
  import { useEntityStore } from '@/store/entityStore';
  import { useTipStore } from '@/store/tipStore';
  import {
    type Viewer,
    Cartesian3,
    Math,
    Cartographic,
    ScreenSpaceEventType,
    ScreenSpaceEventHandler,
    defined,
  } from 'cesium';
  import { type AircraftInfo, Aircraft } from '@/utils/aircraft';
  const cesiumStore = useCesiumStore();
  const entityStore = useEntityStore();
  const tipStore = useTipStore();
  const router = useRouter();
  const route = useRoute();
  let handler = undefined as ScreenSpaceEventHandler | undefined;

  /**
   * @description: 初始化所有的飞机
   */
  function initAircraft() {
    const aircraftList: AircraftInfo[] = [
      {
        id: '1',
        name: '测试机1',
        type: '',
        status: {
          location: [111.62712662878896, 30.43792756540471, 35.497846690354905],
          power: 85,
          speed: 0,
        },
        airline: [],
      },
      {
        id: '2',
        name: '测试机2',
        type: '',
        status: {
          location: [111.62812662878896, 30.43792756540471, 35.497846690354905],
          power: 70,
          speed: 1,
        },
        airline: [],
      },
      {
        id: '3',
        name: '测试机',
        type: '',
        status: {
          location: [111.6292662878896, 30.43792756540471, 35.497846690354905],
          power: 20,
          speed: 60,
        },
        airline: [],
      },
    ];
    //加载飞机模型
    tipStore.tip = '正在加载飞机模型...';
    // 加载飞机模型
    for (const aircraftInfo of aircraftList) {
      entityStore.aircraft.push(new Aircraft(aircraftInfo));
    }
    tipStore.tip = '飞机模型加载完毕';
  }
  onMounted(async () => {
    cesiumStore.setViewer('cesiumContainer');
    cesiumStore.setMapType('img');

    const viewer = cesiumStore.viewer as Viewer;
    //相机对准中国
    cesiumStore.viewer!.camera.flyTo({
      destination: Cartesian3.fromDegrees(103.84, 31.15, 17850000),
      orientation: {
        heading: Math.toRadians(360),
        pitch: Math.toRadians(-90),
        roll: Math.toRadians(0),
      },
    });
    //监听当前的经纬度
    // @ts-expect-error: 未使用参数
    viewer.screenSpaceEventHandler.setInputAction(function (movement) {
      // 获取鼠标当前位置的 Cartesian3 坐标
      const cartesian = viewer.camera.pickEllipsoid(
        movement.endPosition,
        viewer.scene.globe.ellipsoid
      );

      if (cartesian) {
        // 转换为经纬度（弧度）
        const cartographic = Cartographic.fromCartesian(cartesian);
        // 转换为度数
        cesiumStore.longitude = Math.toDegrees(cartographic.longitude);
        cesiumStore.latitude = Math.toDegrees(cartographic.latitude);
        cesiumStore.height = cartographic.height;
      }
    }, ScreenSpaceEventType.MOUSE_MOVE);
    //监听当前的相机角度
    viewer.scene.preUpdate.addEventListener(() => {
      // 获取相机位置（经纬度 + 高度）
      const position = viewer.camera.position;
      const cartographic = Cartographic.fromCartesian(position);
      const longitude = Math.toDegrees(cartographic.longitude);
      const latitude = Math.toDegrees(cartographic.latitude);
      const height = cartographic.height;

      // 获取相机角度（弧度）
      const pitch = viewer.camera.pitch; // 俯仰角（向下为正）
      const heading = viewer.camera.heading; // 偏航角（正北为0，顺时针增加）
      const roll = viewer.camera.roll; // 滚转角

      // 转换为角度制并输出
      cesiumStore.camera.longitude = longitude;
      cesiumStore.camera.latitude = latitude;
      cesiumStore.camera.height = height;

      cesiumStore.camera.pitch = Math.toDegrees(pitch);
      cesiumStore.camera.heading = Math.toDegrees(heading);
      cesiumStore.camera.roll = Math.toDegrees(roll);
    });
    //监听是否选中了实体
    viewer.selectedEntityChanged.addEventListener(function (entity) {
      if (entity) {
        entityStore.currentEntity = entity;
        console.log(
          'JSON.parse(entity.description) :>> ',
          JSON.parse(entity.description)
        );
        switch (JSON.parse(entity.description).type) {
          case 'draw-point':
            router.push({ name: 'point' });
            break;
          case 'draw-line':
            router.push({ name: 'line' });
            break;
          case 'draw-polygon':
            router.push({ name: 'polygon' });
            break;
          case 'aircraft':
            router.push({ name: 'aircraft' });
            break;
        }
      }
    });
    initAircraft();
    handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    // 监听双击事件
    // @ts-expect-error: 未使用参数
    handler.setInputAction(function (movement) {
      const pickedObject = viewer.scene.pick(movement.position);
      // 如果双击时没有选中任何实体（即取消选中）
      if (!defined(pickedObject)) {
        tipStore.tip = '取消选中';
        router.push({ name: 'design' });
        // 在这里添加你的取消选中处理逻辑
      }
    }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  });

  const cesiumStyle = ref(false);
  if (route.path.split('/')[1] == 'cruise') {
    cesiumStyle.value = true;
  }
  router.afterEach((to, from) => {
    if (to.path.split('/')[1] == 'cruise') {
      cesiumStyle.value = true;
    }
    if (to.path.split('/')[1] == 'design') {
      cesiumStyle.value = false;
    }
  });
</script>

<style lang="scss" scoped>
  #cesiumContainer {
    z-index: 1;
    position: absolute;
    transition: all 1s;
    width: 100%;
    height: 100%;
    right: 0;
  }
  .cesium-view {
    width: calc((80% - 8px) / 2 - 5px) !important;
    height: 70% !important;
    // right: 5px;
    right: 0;
  }
</style>
