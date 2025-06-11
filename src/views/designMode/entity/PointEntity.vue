<template>
  <div class="point-entity">
    <div class="point-control-container">
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
        hide-details
      ></v-number-input>
      <v-number-input
        v-model="y"
        :label="label[1]"
        variant="outlined"
        density="compact"
        control-variant="split"
        :step="0.001"
        :precision="6"
        hide-details
      ></v-number-input>
      <v-number-input
        v-model="z"
        :label="label[2]"
        variant="outlined"
        density="compact"
        control-variant="split"
        :step="1"
        :precision="6"
        hide-details
      ></v-number-input>
    </div>
    <div class="point-control-container">
      <div class="color-picker">
        <div>点颜色</div>
        <div
          class="color"
          :style="{ backgroundColor: color }"
          @click="selectColor('color')"
        ></div>
      </div>
      <div class="color-picker">
        <div>边框色</div>
        <div
          class="color"
          :style="{ backgroundColor: outlineColor }"
          @click="selectColor('outlineColor')"
        ></div>
      </div>
      <v-number-input
        v-model="pixelSize"
        label="点大小"
        variant="outlined"
        density="compact"
        control-variant="split"
        :step="0.5"
        :precision="1"
        :min="0"
        hide-details
      ></v-number-input>
      <v-number-input
        v-model="outlineWidth"
        label="边框粗细"
        variant="outlined"
        density="compact"
        control-variant="split"
        :step="0.5"
        :precision="1"
        :min="0"
        hide-details
      ></v-number-input>
    </div>
    <div class="point-actions-container">
      <div class="actions">
        <v-text-field
          v-model="pointLabel"
          label="标签"
          hide-details
          width="100%"
          class="label"
          density="compact"
        >
        </v-text-field>
        <div class="flex-center">
          <div class="flex-center">
            <div class="text">删除点</div>
            <v-icon
              icon="mdi-delete"
              class="delete-icon"
              @click="deletePoint"
            ></v-icon>
          </div>
          <div class="flex-center">
            <div class="text">重置点</div>
            <v-icon
              icon="mdi-reload"
              class="delete-icon"
              @click="init"
            ></v-icon>
          </div>
        </div>
      </div>
      <div class="actions">
        <v-combobox
          v-model="selectMark"
          label="标记"
          :items="items"
          item-title="title"
          item-value="url"
          width="100%"
          class="label"
          density="compact"
        >
        </v-combobox>
        <div class="flex-center">
          <div class="flex-center">
            <div class="text">缩放</div>
            <v-icon
              icon="mdi-magnify"
              class="delete-icon"
              @click="zoomTo"
            ></v-icon>
          </div>
        </div>
      </div>
      <v-text-field
        v-model="description"
        label="描述"
        prepend-icon="mdi-comment"
        class="point-desc"
        density="compact"
        hide-details
      ></v-text-field>
    </div>
    <ColorDialogs
      v-if="dialog"
      @close-dialog="getColor"
      :color="tempColor"
    ></ColorDialogs>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useEntityStore } from '@/store/entityStore';
  import { useCesiumStore } from '@/store/cesiumStore';
  import { useTipStore } from '@/store/tipStore';
  import {
    Cartesian3,
    Cartographic,
    Math,
    Color,
    VerticalOrigin,
    HorizontalOrigin,
    Cartesian2,
    LabelStyle,
  } from 'cesium';

  const router = useRouter();
  const route = useRoute();
  const entityStore = useEntityStore();
  const cesiumStore = useCesiumStore();
  const tipStore = useTipStore();

  const pointID = route.params.id as string;
  if (!entityStore.point.length) router.push({ name: 'design' });
  const pointEntity = entityStore.point.find((item) => item.id === pointID)!;

  const point = pointEntity.point!;

  const position = Cartographic.fromCartesian(
    pointEntity.position!.getValue()!
  );
  const x = ref(Math.toDegrees(position!.longitude));
  const y = ref(Math.toDegrees(position!.latitude));
  const z = ref(position!.height);

  const pixelSize = ref(point.pixelSize!.getValue());
  const outlineWidth = ref(point.outlineWidth!.getValue());
  const color = ref(point.color!.getValue()!.toCssColorString());
  const tempColor = ref('');
  const outlineColor = ref(point.outlineColor!.getValue()!.toCssColorString());
  const pointDesc = JSON.parse(pointEntity.description as unknown as string);
  const description = ref(pointDesc.description);
  const pointLabel = ref(pointEntity.label!.text);

  const dialog = ref(false);
  const posMode = ref('degree');
  const label = ref(['经度', '纬度', '高度']);
  const items = [
    {
      title: '输入图像URL或选择已有图像',
      url: '',
    },
    {
      title: '标签1',
      url: '1',
    },
    {
      title: '标签2',
      url: '2',
    },
    {
      title: '标签3',
      url: '3',
    },
    {
      title: '标签4',
      url: '4',
    },
  ];
  // const selectMark = ref({
  //   title: '输入图像URL或选择已有图像',
  //   url: '',
  // });
  const selectMark = ref({
    title: '输入图像URL或选择已有图像',
    url: '',
  });
  const originProp = {
    originX: x.value,
    originY: y.value,
    originZ: z.value,
    originPixelSize: pixelSize.value,
    originPointLabel: pointLabel.value,
    originOutlineWidth: outlineWidth.value,
    originOutlineColor: outlineColor.value,
    originColor: color.value,
    originDescription: description.value,
    originLabel: pointLabel.value,
  };
  let selectColorName = '';

  // 初始化，设定点的坐标、样式、图标、大小
  function init() {
    tipStore.tip = '初始化点信息';
    x.value = originProp.originX;
    y.value = originProp.originY;
    z.value = originProp.originZ;
    pixelSize.value = originProp.originPixelSize;
    outlineWidth.value = originProp.originOutlineWidth;
    color.value = originProp.originColor;
    outlineColor.value = originProp.originOutlineColor;
    description.value = originProp.originDescription;
    pointLabel.value = originProp.originLabel;
    label.value = ['经度', '纬度', '高度'];
    posMode.value = 'degree';
  }

  function getColor(selectColor: string) {
    dialog.value = false;
    if (selectColorName == 'color') color.value = selectColor;
    else {
      outlineColor.value = selectColor;
    }
  }
  function selectColor(colorName: string) {
    selectColorName = colorName;
    tempColor.value = colorName == 'color' ? color.value : outlineColor.value;
    dialog.value = true;
  }

  //切换坐标格式
  watch(posMode, () => {
    tipStore.tip = '切换坐标格式';
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
  });

  //更新点状态
  watch(
    () => [
      x.value,
      y.value,
      z.value,
      pixelSize.value,
      color.value,
      outlineColor.value,
      outlineWidth.value,
      description.value,
      pointLabel.value,
      selectMark.value,
    ],
    () => {
      if (posMode.value == 'degree') {
        const position = Cartesian3.fromDegrees(x.value, y.value, z.value);
        // @ts-expect-error: Unreachable code error
        entityStore.currentEntity.position = position;
      } else {
        const position = Cartesian3.fromArray([x.value, y.value, z.value]);
        // @ts-expect-error: Unreachable code error
        entityStore.currentEntity.position = position;
      }

      point.pixelSize = pixelSize.value;
      point.outlineWidth = outlineWidth.value;
      // @ts-expect-error: Unreachable code error
      point.color = Color.fromCssColorString(color.value);
      // @ts-expect-error: Unreachable code error
      point.outlineColor = Color.fromCssColorString(outlineColor.value);
      // @ts-expect-error: Unreachable code error
      point.description = JSON.stringify({
        type: 'point',
        description: description.value,
      });
      // 设置标签
      pointEntity.label = {
        text: pointLabel.value, // 显示的文字内容
        // @ts-expect-error: Unreachable code error
        font: '12pt sans-serif', // 字体设置
        // @ts-expect-error: Unreachable code error
        fillColor: Color.WHITE, // 文字颜色
        // @ts-expect-error: Unreachable code error
        outlineColor: Color.BLACK, // 文字描边颜色
        // @ts-expect-error: Unreachable code error
        outlineWidth: 2, // 描边宽度
        // @ts-expect-error: Unreachable code error
        style: LabelStyle.FILL_AND_OUTLINE, // 样式
        // @ts-expect-error: Unreachable code error
        verticalOrigin: VerticalOrigin.BOTTOM, // 垂直对齐
        // @ts-expect-error: Unreachable code error
        horizontalOrigin: HorizontalOrigin.CENTER, // 水平对齐
        // @ts-expect-error: Unreachable code error
        pixelOffset: new Cartesian2(0, -20), // 偏移量(像素)
      };
      if (selectMark.value.url) {
        entityStore.currentEntity!.billboard = {
          // @ts-expect-error: Unreachable code error
          image: selectMark.value.url,
          // @ts-expect-error: Unreachable code error
          width: 32,
          // @ts-expect-error: Unreachable code error
          height: 32,
        };
      } else {
        entityStore.currentEntity!.billboard = undefined;
      }

      // //重新锁定相机
      if (
        cesiumStore.viewer!.trackedEntity?.id == entityStore.currentEntity!.id
      ) {
        cesiumStore.viewer!.trackedEntity = entityStore.currentEntity;
      }
    }
  );
  function deletePoint() {
    tipStore.tip = '删除点';
    cesiumStore.viewer!.entities.remove(entityStore.currentEntity!);
    router.push({ name: 'design' });
  }
  function zoomTo() {
    tipStore.tip = '缩放到点';
    cesiumStore.viewer!.camera.flyTo({
      destination: entityStore.currentEntity!.position!.getValue()!,
      orientation: {
        heading: Math.toRadians(360),
        pitch: Math.toRadians(-90),
        roll: Math.toRadians(0),
      },
      duration: 1,
    });
  }
</script>

<style scoped lang="scss">
  .point-entity {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .point-control-container {
    display: flex;
    height: 40px;
    gap: 20px;
  }
  .point-actions-container {
    display: flex;
    gap: 20px;
  }
  .color-picker {
    width: 20%;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  .color {
    height: 1.5rem;
    flex: 1;
    border-radius: 2px;
    cursor: pointer;
  }
  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    gap: 20px;
    width: 25%;
  }
  .delete-icon {
    margin: 0 10px;
    cursor: pointer;
    font-size: 36px;
  }
  .label {
    max-height: 40px;
  }
</style>
