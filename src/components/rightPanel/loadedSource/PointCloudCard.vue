<template>
  <div class="card">
    <v-expansion-panels variant="accordion" class="card-panel">
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-icon icon="mdi-cloud"> </v-icon>
          <div class="card-title">测试点云数据</div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="card-content">
            <div class="action-btns">
              <v-btn
                variant="outlined"
                style="font-size: 12px"
                @click="getPointCloud"
                class="card-btn"
              >
                获取</v-btn
              >
              <v-btn
                variant="outlined"
                style="font-size: 12px"
                @click="zoomToPointCloud"
                class="card-btn"
              >
                缩放</v-btn
              >
            </div>
            <div class="action-btns">
              <v-btn
                variant="outlined"
                style="font-size: 12px"
                @click="resetPointCloud"
                class="card-btn"
              >
                重置</v-btn
              >
              <v-btn
                variant="outlined"
                style="font-size: 12px"
                @click="clearPointCloud"
                class="card-btn"
              >
                清除</v-btn
              >
            </div>
            <v-slider
              v-model="pointSize"
              label="点尺寸"
              class="slider"
              :min="1"
              :max="10"
              thumb-label
              hide-details
            ></v-slider>

            <v-number-input
              v-model="lng"
              label="x坐标"
              variant="outlined"
              density="compact"
              control-variant="split"
              :step="0.001"
              :precision="6"
              hide-details
            ></v-number-input>
            <v-number-input
              v-model="lat"
              label="y坐标"
              variant="outlined"
              density="compact"
              control-variant="split"
              :step="0.001"
              :precision="6"
              hide-details
            ></v-number-input>
            <v-number-input
              v-model="height"
              label="z坐标"
              variant="outlined"
              density="compact"
              control-variant="split"
              :step="0.5"
              :precision="6"
              hide-details
            ></v-number-input>
            <v-number-input
              v-model="xAngle"
              label="x转角"
              variant="outlined"
              density="compact"
              control-variant="split"
              :step="0.5"
              :precision="6"
              hide-details
            ></v-number-input>
            <v-number-input
              v-model="yAngle"
              label="y转角"
              variant="outlined"
              density="compact"
              control-variant="split"
              :step="0.5"
              :precision="6"
              hide-details
            ></v-number-input>
            <v-number-input
              v-model="zAngle"
              label="z转角"
              variant="outlined"
              density="compact"
              control-variant="split"
              :step="0.5"
              :precision="6"
              hide-details
            ></v-number-input>
            <div class="action-btns">
              <v-btn
                variant="outlined"
                style="font-size: 12px"
                @click="selectCenter"
                class="card-btn"
              >
                选择中心</v-btn
              >
              <v-btn
                variant="outlined"
                style="font-size: 12px"
                @click="applyTransform"
                class="card-btn"
              >
                应用变换</v-btn
              >
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useTipStore } from '@/store/tipStore';
  import {
    Cesium3DTileset,
    Cesium3DTileStyle,
    HeadingPitchRange,
    Math,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Matrix4,
    Cartesian3,
    Cartographic,
    Matrix3,
    IonResource,
  } from 'cesium';
  import { useCesiumStore } from '@/store/cesiumStore';
  const tipStore = useTipStore();
  const cesiumStore = useCesiumStore();
  const pointSize = ref(1);
  const lng = ref(0);
  const lat = ref(0);
  const height = ref(0);
  const xAngle = ref(0);
  const yAngle = ref(0);
  const zAngle = ref(0);

  let tileset = undefined as Cesium3DTileset | undefined;
  let surface = undefined as unknown as Cartesian3;
  let center = undefined as unknown as Cartesian3;
  async function getPointCloud() {
    if (tileset) {
      tipStore.tip = '数据已经加载';
      return;
    }
    tipStore.tip = '载入点云数据';
    tileset = cesiumStore.viewer!.scene.primitives.add(
      await Cesium3DTileset.fromIonAssetId(3427446)
    );
    // Add the tileset to the scene
    // tileset = cesiumStore.viewer!.scene.primitives.add(
    //   await Cesium3DTileset.fromUrl(
    //     '/data/mytiles/tileset.json'
    //   )
    // );
    const boundingSphere = tileset!.boundingSphere;
    const cartographic = Cartographic.fromCartesian(boundingSphere.center);
    center = boundingSphere.center;
    lng.value = Math.toDegrees(cartographic.longitude);
    lat.value = Math.toDegrees(cartographic.latitude);
    height.value = cartographic.height;
    surface = Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      cartographic.height
    );
    tipStore.tip = '数据载入完成';
    zoomToPointCloud();
  }
  //重置点云位置
  function resetPointCloud() {
    if (!tileset) {
      tipStore.tip = '数据还未加载';
      return;
    }
    tileset.modelMatrix = Matrix4.fromTranslation(new Cartesian3());
  }
  //隐藏点云
  function clearPointCloud() {
    if (!tileset) {
      tipStore.tip = '数据未加载';
      return;
    }
    cesiumStore.viewer!.scene.primitives.remove(tileset);
    tileset = undefined;
  }

  watch(pointSize, () => {
    if (!tileset) {
      tipStore.tip = '数据未加载';
      return;
    }
    tileset.style = new Cesium3DTileStyle({
      pointSize: pointSize.value,
    });
  });

  //缩放到点云
  function zoomToPointCloud() {
    if (!tileset) {
      tipStore.tip = '数据未加载';
      return;
    }
    // 定位到加载的点云数据
    cesiumStore.viewer!.flyTo(tileset, {
      duration: 1.0, // 动画时长（秒）
      offset: new HeadingPitchRange(
        Math.toRadians(0), // 朝向角（0=正北）
        Math.toRadians(-30), // 俯视角（-30=向下看）
        100.0 // 距离目标的距离（米）
      ),
    });
  }
  let handler = null as unknown as ScreenSpaceEventHandler;
  //选择平移中心
  function selectCenter() {
    if (!tileset) {
      tipStore.tip = '数据未加载';
      return;
    }
    tipStore.tip = '在地图上选一点';
    handler = new ScreenSpaceEventHandler(cesiumStore.viewer!.scene.canvas);
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
        //转换到经纬度
        const cartographic = Cartographic.fromCartesian(position);
        lng.value = Math.toDegrees(cartographic.longitude);
        lat.value = Math.toDegrees(cartographic.latitude);
        height.value = cartographic.height;
        tipStore.tip = '已计算变换矩阵';
        //取消事件
        handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
      },
      ScreenSpaceEventType.LEFT_CLICK
    );
  }
  //应用变换
  function applyTransform() {
    if (!tileset) {
      tipStore.tip = '数据未加载';
      return;
    }

    // 1. 创建反向平移矩阵（中心点移到原点）
    const toOrigin = Matrix4.fromTranslation(
      Cartesian3.negate(center, new Cartesian3())
    );
    // 定义旋转角度（单位：弧度）
    const heading = Math.toRadians(zAngle.value); // Z轴旋转（偏航角）
    const pitch = Math.toRadians(yAngle.value); // Y轴旋转（俯仰角）
    const roll = Math.toRadians(xAngle.value); // X轴旋转（翻滚角）

    // 创建旋转矩阵（按Z→Y→X顺序）
    const rotationX = Matrix3.fromRotationX(roll);
    const rotationY = Matrix3.fromRotationY(pitch);
    const rotationZ = Matrix3.fromRotationZ(heading);
    const rotationMatrix = Matrix3.multiply(
      rotationZ,
      Matrix3.multiply(rotationY, rotationX, new Matrix3()),
      new Matrix3()
    );
    // 3. 创建正向平移矩阵（移回原位置）
    const fromOrigin = Matrix4.fromTranslation(center);
    // 组合矩阵：T * R * T⁻¹
    const rotationPart = Matrix4.fromRotationTranslation(
      rotationMatrix,
      Cartesian3.ZERO
    );
    const centerRotationMatrix = Matrix4.multiply(
      fromOrigin,
      Matrix4.multiply(rotationPart, toOrigin, new Matrix4()),
      new Matrix4()
    );
    const offset = Cartesian3.fromRadians(
      Math.toRadians(lng.value),
      Math.toRadians(lat.value),
      height.value
    );
    const translation = Cartesian3.subtract(offset, surface, new Cartesian3());

    // 2. 组合你的平移矩阵
    const yourTranslationMatrix = Matrix4.fromTranslation(translation);

    tileset.modelMatrix = Matrix4.multiply(
      centerRotationMatrix,
      yourTranslationMatrix,
      new Matrix4()
    );
    tipStore.tip = '变换已完成';
  }
</script>

<style scoped lang="scss">
  .card-title {
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
