<template>
  <div class="image-card">
    <v-expansion-panels variant="accordion">
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-icon icon="mdi-image"> </v-icon>
          <div class="point-card-title">测试影像数据</div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="card-content">
            <div class="action-btns">
              <v-btn
                variant="outlined"
                style="font-size: 12px"
                @click="getImage"
                class="card-btn"
              >
                获取</v-btn
              >
              <v-btn
                variant="outlined"
                style="font-size: 12px"
                class="card-btn"
                @click="zoomTo"
              >
                缩放</v-btn
              >
            </div>
            <div class="action-btns">
              <v-btn
                variant="outlined"
                style="font-size: 12px"
                class="card-btn"
                @click="resetImage"
              >
                重置</v-btn
              >
              <v-btn
                variant="outlined"
                style="font-size: 12px"
                class="card-btn"
                @click="clearImage"
              >
                清除</v-btn
              >
            </div>
            <v-number-input
              v-model="wLng"
              label="西经"
              variant="outlined"
              density="compact"
              control-variant="split"
              :step="0.001"
              :precision="6"
              hide-details
            ></v-number-input>
            <v-number-input
              v-model="eLng"
              label="东经"
              variant="outlined"
              density="compact"
              control-variant="split"
              :step="0.001"
              :precision="6"
              hide-details
            ></v-number-input>
            <v-number-input
              v-model="sLat"
              label="南纬"
              variant="outlined"
              density="compact"
              control-variant="split"
              :step="0.001"
              :precision="6"
              hide-details
            ></v-number-input>
            <v-number-input
              v-model="nLat"
              label="北纬"
              variant="outlined"
              density="compact"
              control-variant="split"
              :step="0.001"
              :precision="6"
              hide-details
            ></v-number-input>
            <div class="action-btns">
              <v-btn
                variant="outlined"
                style="font-size: 12px"
                @click="selectPos"
                class="card-btn"
              >
                选点</v-btn
              >
              <v-btn
                variant="outlined"
                style="font-size: 12px"
                @click="moveImage"
                class="card-btn"
              >
                放置</v-btn
              >
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useTipStore } from '@/store/tipStore';
  import {
    SingleTileImageryProvider,
    Rectangle,
    type ImageryLayer,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Math,
    Cartographic,
  } from 'cesium';
  import { useCesiumStore } from '@/store/cesiumStore';
  import img from '@/assets/testImg.jpg';
  const tipStore = useTipStore();
  const cesiumStore = useCesiumStore();
  interface ImageType {
    url: string;
    rectangle: {
      wLng: number;
      eLng: number;
      sLat: number;
      nLat: number;
    };
    width: number;
    height: number;
  }
  const initState: ImageType = {
    url: img,
    rectangle: {
      wLng: 116.0,
      eLng: 117.0,
      sLat: 39.0,
      nLat: 40.0,
    },
    width: 2500,
    height: 1440,
  };
  const wLng = ref(0);
  const eLng = ref(0);
  const sLat = ref(0);
  const nLat = ref(0);

  let imageryLayer = undefined as undefined | ImageryLayer;
  //在这里初始化
  function init(initState: ImageType) {
    wLng.value = initState.rectangle.wLng;
    eLng.value = initState.rectangle.eLng;
    sLat.value = initState.rectangle.sLat;
    nLat.value = initState.rectangle.nLat;
  }
  init(initState);
  //获取影像数据
  function getImage() {
    if (imageryLayer) {
      tipStore.tip = '影像已经加载过了';
      return;
    }
    tipStore.tip = '载入图像数据';
    imageryLayer = cesiumStore.viewer!.imageryLayers.addImageryProvider(
      new SingleTileImageryProvider({
        url: initState.url, // 图片路径
        tileWidth: initState.width,
        tileHeight: initState.height,
        rectangle: Rectangle.fromDegrees(
          initState.rectangle.wLng, // 西经
          initState.rectangle.sLat, // 南纬
          initState.rectangle.eLng, // 东经
          initState.rectangle.nLat // 北纬
        ), // 指定显示范围
      })
    ); // 将视图缩放到该矩形范围
    zoomTo();
    tipStore.tip = '数据载入完成';
  }
  //缩放到影像
  function zoomTo() {
    if (!imageryLayer) {
      tipStore.tip = '影像未加载';
      return;
    }
    tipStore.tip = '缩放到影像';
    cesiumStore.viewer!.camera.flyTo({
      destination: Rectangle.fromDegrees(
        wLng.value, // 西经
        sLat.value, // 南纬
        eLng.value, // 东经
        nLat.value // 北纬
      ),
      duration: 1,
    });
  }
  function moveImage() {
    clearImage();
    imageryLayer = cesiumStore.viewer!.imageryLayers.addImageryProvider(
      new SingleTileImageryProvider({
        url: initState.url, // 图片路径
        tileWidth: initState.width,
        tileHeight: initState.height,
        rectangle: Rectangle.fromDegrees(
          wLng.value, // 西经
          sLat.value, // 南纬
          eLng.value, // 东经
          nLat.value // 北纬
        ), // 指定显示范围
      })
    ); // 将视图缩放到该矩形范围
    tipStore.tip = '影像移动完成';
  }
  //重置影像
  function resetImage() {
    tipStore.tip = '影像重置';
    init(initState);
  }
  //清除影像
  function clearImage() {
    if (!imageryLayer) {
      tipStore.tip = '影像未加载';
      return;
    } else {
      cesiumStore.viewer!.imageryLayers.remove(imageryLayer); // 移除图层
      imageryLayer = undefined;
      tipStore.tip = '影像已经清除';
    }
  }
  let handler = null as unknown as ScreenSpaceEventHandler;
  let selectPointNum = 0;
  function selectPos() {
    tipStore.tip = '在地图上选一点';
    if (!handler) {
      handler = new ScreenSpaceEventHandler(cesiumStore.viewer!.scene.canvas);
    }

    handler.setInputAction(
      async (movement: ScreenSpaceEventHandler.PositionedEvent) => {
        // 获取点击的经纬度坐标
        const ray = cesiumStore.viewer!.camera.getPickRay(movement.position);
        if (!ray) return;

        const position = cesiumStore.viewer!.scene.globe.pick(
          ray,
          cesiumStore.viewer!.scene
        );
        if (!position) return;
        selectPointNum += 1;
        tipStore.tip = `已选择${selectPointNum}个点`;
        //转换到经纬度
        const cartographic = Cartographic.fromCartesian(position);
        if (selectPointNum === 1) {
          wLng.value = Math.toDegrees(cartographic.longitude);
          sLat.value = Math.toDegrees(cartographic.latitude);
        } else if (selectPointNum === 2) {
          eLng.value = Math.toDegrees(cartographic.longitude);
          nLat.value = Math.toDegrees(cartographic.latitude);
          selectPointNum = 0;
          //取消事件
          handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
          tipStore.tip = '已完成选择';
        }
      },
      ScreenSpaceEventType.LEFT_CLICK
    );
  }
</script>

<style scoped lang="scss">
  .image-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .point-card-title {
    width: 100%;
    text-align: center;
  }
  .action-btns {
    display: flex;
    justify-content: space-between;
  }
  .card-btn {
    padding: 0;
  }
  .card-content {
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>
