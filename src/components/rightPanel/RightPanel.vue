<template>
  <div class="right-panel-viewer">
    <div class="panel-list-content">
      <div class="panel-title flex-center">
        <div class="">地图控制面板</div>
      </div>
      <div class="panel-list-content-item">
        <Sheet>
          <!-- 使用header槽 -->
          <template #title> 相机精细控制</template>
          <template #content>
            <CameraController></CameraController>
          </template>
        </Sheet>
        <Sheet>
          <template #title>
            <div class="title">地图绘制</div>
          </template>
          <template #content>
            <DrawMap></DrawMap>
          </template>
        </Sheet>
        <Sheet class="sheet-resource">
          <template #title>
            <div class="title">已装载资源</div>
          </template>
          <template #content>
            <ResourceList></ResourceList>
          </template>
        </Sheet>
      </div>
      <div class="tip">
        <div class="text">Tip💡:{{ tipStore.tip }}</div>
      </div>
    </div>
    <div class="panel-list main-color">
      <v-btn class="panel-item" variant="text" @click="flyToCurrentPos">
        <v-icon icon="mdi-map-marker"></v-icon>
        <v-tooltip activator="parent" location="left" text="定位"></v-tooltip>
      </v-btn>
      <v-btn class="panel-item" variant="text" @click="resetCamera">
        <v-icon icon="mdi-reload"></v-icon>
        <v-tooltip
          activator="parent"
          location="left"
          text="重置相机"
        ></v-tooltip>
      </v-btn>
      <v-btn class="panel-item" variant="text" @click="showMode(2)">
        <v-icon icon="mdi-map"></v-icon>
        <v-tooltip
          activator="parent"
          location="left"
          text="正射影像"
        ></v-tooltip>
      </v-btn>
      <v-btn class="panel-item" variant="text" @click="showMode(3)">
        <v-icon icon="mdi-earth"></v-icon>
        <v-tooltip
          activator="parent"
          location="left"
          text="全景三维"
        ></v-tooltip>
      </v-btn>
      <v-btn class="panel-item" variant="text" @click="vectorLayer">
        <v-icon icon="mdi-vector-line"></v-icon>
        <v-tooltip
          activator="parent"
          location="left"
          text="矢量图层"
        ></v-tooltip>
      </v-btn>
      <v-btn class="panel-item" variant="text" @click="imgLayer">
        <v-icon icon="mdi-image-filter-none"></v-icon>
        <v-tooltip
          activator="parent"
          location="left"
          text="影像图层"
        ></v-tooltip>
      </v-btn>
      <v-btn class="panel-item" variant="text">
        <v-icon icon="mdi-upload"></v-icon>
        <v-tooltip
          activator="parent"
          location="left"
          text="装载数据"
        ></v-tooltip>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useCesiumStore } from '@/store/cesiumStore';
  import ResourceList from './loadedSource/LoadedSource.vue';
  import { Cartesian3, type Viewer, Math, SceneMode } from 'cesium';
  import Sheet from '@/components/publicComponents/Sheet.vue';
  import { useTipStore } from '@/store/tipStore';
  import DrawMap from '@/components/rightPanel/mapDraw/MapDraw.vue';
  import CameraController from './cameraController/CameraController.vue';
  const tipStore = useTipStore();
  const cesiumStore = useCesiumStore();

  function flyToCurrentPos() {
    const viewer = cesiumStore.viewer as Viewer;
    if (!navigator.geolocation) {
      console.error('您的浏览器不支持地理位置定位！');
    } else {
      // 请求当前位置
      navigator.geolocation.getCurrentPosition(
        function (position) {
          // 获取经纬度
          var longitude = position.coords.longitude;
          var latitude = position.coords.latitude;
          var height = position.coords.altitude || 1000; // 如果没有高度，默认1000米

          // 使用flyTo平滑飞向当前位置
          viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(longitude, latitude, height),
            orientation: {
              heading: Math.toRadians(0), // 朝向正北
              pitch: Math.toRadians(-30), // 俯视角（-30度俯视）
              roll: 0.0,
            },
            duration: 2, // 飞行时间（秒）
          });
        },
        function (error) {
          console.error('获取位置失败:', error.message);
          // 默认定位到北京（如果用户拒绝定位）
          viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(116.4, 39.9, 10000),
            orientation: {
              heading: Math.toRadians(0),
              pitch: Math.toRadians(-30),
              roll: 0.0,
            },
          });
        },
        {
          enableHighAccuracy: true, // 高精度模式（如果可用）
          timeout: 5000, // 超时时间（5秒）
          maximumAge: 0, // 不使用缓存位置
        }
      );
    }
  }
  function showMode(mode: 2 | 3) {
    if (mode == 2) cesiumStore.viewer!.scene.mode = SceneMode.SCENE2D;
    else cesiumStore.viewer!.scene.mode = SceneMode.SCENE3D;
  }
  function vectorLayer() {
    cesiumStore.setMapType('vec');
  }
  function imgLayer() {
    cesiumStore.setMapType('img');
  }
  function resetCamera() {
    cesiumStore.viewer!.camera.flyTo({
      destination: Cartesian3.fromDegrees(103.84, 31.15, 17850000),
      orientation: {
        heading: Math.toRadians(360),
        pitch: Math.toRadians(-90),
        roll: Math.toRadians(0),
      },
    });
  }
</script>

<style lang="scss" scoped>
  .right-panel-viewer {
    display: flex;
    height: 100%;
    width: 100%;
    //左右反转背景
    background-image: url('@/assets/panel.png');
    background-size: 100% 100%;
  }
  .panel-list-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .panel-list-content-item {
    flex: 1;
    overflow: scroll;
  }
  .panel-list {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .panel-title {
    width: 100%;
    height: 24px;
    font-size: 14px;
  }
  .panel-item {
    min-width: 40px !important;
    height: 40px;
    padding: 0px;
    border-radius: 0px;
  }
  .sheet-resource {
    flex: 1;
    justify-content: start;
  }
  :deep(.v-field__field) {
    font-size: 12px;
  }
  .tip {
    padding: 0px 10px;
  }
</style>
