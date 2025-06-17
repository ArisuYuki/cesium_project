<template>
  <div class="info-window">
    <div class="aircraft-title">
      <div class="text">飞机型号：{{ statusInfo.name }}</div>
      <div class="power-bar">
        <div class="power-title text">电量</div>
        <v-progress-linear
          color="light-blue"
          height="10"
          :model-value="10"
          striped
          rounded
        >
          <template v-slot:default="{ value }">
            <div class="text">{{ value }}%</div>
          </template></v-progress-linear
        >
      </div>
    </div>
    <v-divider thickness="2px" class="divider" color="primary"> </v-divider>
    <div class="info-window-content text">
      <div class="aircraft-info">
        <div class="aircraft-nest">
          <div>在这里显示机巢画面</div>
        </div>
        <div class="cruise-select">
          <v-select
            v-model="selectID"
            label="选择航线"
            :items="airlines"
            item-title="name"
            item-value="id"
            density="compact"
            hide-details
          >
          </v-select>
          <div class="btn-group">
            <v-btn @click="startCruise" variant="outlined" class="text"
              >巡航</v-btn
            >
            <v-btn @click="stopCruise" variant="outlined" class="text"
              >急停</v-btn
            >
            <v-btn @click="cannelCruise" variant="outlined" class="text"
              >返航</v-btn
            >
            <v-btn @click="land" variant="outlined" class="text">降落</v-btn>
          </div>
        </div>
        <div class="time-info">
          <div class="time-item">
            <div>预估剩余时间</div>
            <div class="time">
              {{ (statusInfo.status.timeLeft / 60).toFixed(0) }}分
              {{ statusInfo.status.timeLeft % 60 }}秒
            </div>
          </div>
          <div class="time-item">
            <div>已飞行时间</div>
            <div class="time">
              {{ (statusInfo.status.timeUsed / 60).toFixed(0) }}分
              {{ statusInfo.status.timeUsed % 60 }}秒
            </div>
          </div>
        </div>
        <div class="status-info">
          <div v-if="statusInfo.status.shutdown" class="info-text">
            <v-icon icon="mdi-fan-off"></v-icon>
            <div class="text-content">待机中</div>
          </div>
          <div v-else class="info-text">
            <v-icon icon="mdi-fan" class="rotate-fan"></v-icon>
            <div class="text-content">飞行中</div>
          </div>

          <div class="info-text">
            <v-icon icon="mdi-power-plug-off"></v-icon>
            <div class="text-content">未充电</div>
          </div>

          <!-- <div class="info-text">
            <v-icon icon="mdi-power-plug" color="primary"></v-icon>
            <div class="text-content">充电中</div>
          </div> -->

          <div class="info-text">
            <v-icon icon="mdi-speedometer"></v-icon>
            <div class="text-content">30km/h</div>
          </div>

          <div class="info-text">
            <v-icon icon="mdi-wifi-strength-3"></v-icon>
            <div class="text-content">信号良好</div>
          </div>
        </div>

        <v-divider thickness="2px" class="divider" color="primary" vertical>
          <div class="v-text">当前高度</div>
        </v-divider>
        <div class="height-indicate">
          <div class="height-indicate-text">
            <div
              class="indicator"
              :style="{
                bottom: `${(100 * statusInfo.status.location[2]) / maxHeight}%`,
              }"
            >
              <div class="text">
                {{ statusInfo.status.location[2].toFixed(1) }}米
              </div>
              <v-icon icon="mdi-arrow-right" class="text"></v-icon>
            </div>
          </div>
          <HeightIndicator
            :width="40"
            :levels="10"
            :minValue="0"
            :maxValue="maxHeight"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, type Ref } from 'vue';
  import { useEntityStore } from '@/store/entityStore';
  import {
    Math as CesiumMath,
    Cartographic,
    Cartesian3,
    Transforms,
    Quaternion,
    HeadingPitchRoll,
  } from 'cesium';
  // @ts-expect-error: Unreachable code error
  import HeightIndicator from './HeightIndicator.vue';
  const maxHeight = 1000;
  const entityStore = useEntityStore();
  //当前的飞机
  const currentAircraft = entityStore.currentAircraft!;
  //当前的飞机实体
  const currentEntity = currentAircraft.aircraftEntity!;
  //当前飞机的位置
  const currentPos = ref(
    Cartographic.fromCartesian(currentEntity.position!.getValue()!)
  );
  //当前飞机的状态
  const statusInfo = ref(currentAircraft.statusInfo);

  const airlines = ref(
    entityStore.airline.map((item) => {
      return {
        name: item.name,
        id: item.id,
      };
    })
  );
  if (!airlines.value.length) {
    airlines.value = [
      {
        name: '无航线',
        id: '',
      },
    ];
  }
  const selectID = ref('');

  //订阅一个更新状态的事件
  currentAircraft.addEventListener('update', (event) => {
    statusInfo.value.status = (event as CustomEvent).detail;
  });

  function consume() {
    //更改时间
    statusInfo.value.status.timeUsed += 1;
    statusInfo.value.status.timeLeft -= 1;
    //更改电量
    statusInfo.value.status.power -= 0.1;
  }
  function startCruise() {
    //没有找到航线直接返回
    const airline = entityStore.airline.find((item) => {
      return item.id === selectID.value;
    });
    if (!airline) return;

    //记录飞行到了哪个点
    let i = 0;
    const currentAircraft = entityStore.currentAircraft!;
    //每0.1s飞行0.1m
    const id = setInterval(() => {
      consume();
      //如果飞完了，返航
      if (i == airline.airpoint.length) {
        clearInterval(id);
        stopCruise();
      } else {
        //没飞完，不停飞
        //拿到下一个航点的坐标
        const pointPos = airline.airpoint[i].position!.getValue()!;
        const currentPos = currentEntity.position!.getValue()!;
        //飞到了下一个点，i++
        if (Cartesian3.distance(currentPos, pointPos) < 1) {
          i++;
        } else {
          //计算方向向量
          const direction = Cartesian3.subtract(
            pointPos,
            currentPos,
            new Cartesian3()
          );
          //归一化方向向量
          Cartesian3.normalize(direction, direction);

          //计算新的坐标,转换为经纬度
          let nowPos = Cartographic.fromCartesian(
            Cartesian3.add(
              currentPos,
              Cartesian3.multiplyByScalar(direction, 1, new Cartesian3()),
              new Cartesian3()
            )
          );
          //用方向向量计算四元数
          const result = Quaternion.fromRotationMatrix(
            Transforms.rotationMatrixFromPositionVelocity(currentPos, direction)
          );
          //转换为姿态角
          const angle = HeadingPitchRoll.fromQuaternion(result);

          statusInfo.value.status.location = [
            CesiumMath.toDegrees(nowPos.longitude),
            CesiumMath.toDegrees(nowPos.latitude),
            nowPos.height,
          ];

          statusInfo.value.status.orientation = [
            angle.heading,
            angle.pitch,
            angle.roll,
          ];

          statusInfo.value.status.speed = 40 + Math.random() * 10;

          currentAircraft.updateState(statusInfo.value.status);
        }
      }
    }, 100);
  }
  function stopCruise() {}
  function land() {}
  function cannelCruise() {}
</script>

<style scoped lang="scss">
  .info-window {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 8px;
    gap: 8px;
  }
  .aircraft-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .power-bar {
    width: 50%;
    display: flex;
    align-items: center;
  }
  .power-title {
    margin-right: 8px;
    width: 2rem;
  }
  .info-window-content {
    display: flex;
    flex: 1;
    gap: 8px;
  }
  .cruise-select {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .divider {
    width: 100%;
    opacity: 1;
  }
  .aircraft-info {
    display: flex;
    flex: 1;
    gap: 8px;
  }
  .aircraft-nest {
    //宽和高一样
    height: 100%;
    aspect-ratio: 1;

    background-color: rgb(10, 51, 51);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .text-info {
    display: flex;
    height: 100%;
    width: 10%;
    flex-direction: column;
  }
  .status-info {
    width: 10%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    //放在网格正中间
    place-items: center;
  }
  .btn-group {
    height: 100%;
    width: 50%;
    gap: 8px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    //放在网格正中间
    place-items: center;
  }
  .height-indicate {
    height: 100%;
    width: 150px;
    display: flex;
  }
  .height-indicate-text {
    width: 50px;
    display: flex;
    position: relative;
  }
  .indicator {
    position: absolute;
    display: flex;
    align-items: center;
  }
  .v-text {
    //垂直排版文本
    writing-mode: vertical-rl; /* 垂直方向，从右到左 */
  }
  .time-info {
    width: 10%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    place-items: center;
    //放在网格正中间
  }
  .time-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .rotate-fan {
    animation: rotate 1s infinite linear;
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .info-text {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  :deep(.v-field__input) {
    padding-inline: var(--v-field-padding-start) var(--v-field-padding-end);
    padding-top: var(--v-field-input-padding-top);
    padding-bottom: var(--v-field-input-padding-bottom);
  }
</style>
