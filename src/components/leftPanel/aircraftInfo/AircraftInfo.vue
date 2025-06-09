<template>
  <div class="aircraft-info">
    <div class="panel-title flex-center">无人机总控面板</div>
    <Sheet :reverse="true">
      <template #title> 无人机总览 </template>
      <template #content>
        <div class="aircraft-overview">
          <div class="aircraft-overview-item flex-center text">
            <div>无人机总数</div>
            <div v-if="entityStore.aircraft.length <= 3">
              <v-icon
                v-for="i in entityStore.aircraft.length"
                :key="i"
                icon="mdi-quadcopter"
                class="text aircraft-icon"
              ></v-icon>
            </div>
            <div v-else>
              <v-icon icon="mdi-quadcopter" class="text aircraft-icon"></v-icon>
              x{{ entityStore.aircraft.length }}
            </div>
          </div>
          <div class="aircraft-overview-item flex-center text">
            <div>今日起飞次数</div>
            <div>3次</div>
          </div>
          <div class="aircraft-overview-item flex-center text">
            <div>待机无人机</div>
            <div>1架</div>
          </div>
          <div class="aircraft-overview-item flex-center text">
            <div>飞行无人机</div>
            <div>2架</div>
          </div>
          <div ref="over-chest" id="over-chest"></div>
        </div>
      </template>
    </Sheet>
    <Sheet :reverse="true">
      <template #title> 无人机列表 </template>
      <template #content>
        <div class="aircraft-list">
          <AircraftCard
            :reverse="true"
            v-for="(aircraft, index) in entityStore.aircraft"
            :aircraft="aircraft"
            :key="index"
          >
          </AircraftCard>
        </div>
      </template>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import * as echarts from 'echarts';
  import { useEntityStore } from '@/store/entityStore';
  import AircraftCard from './AircraftCard.vue';
  const entityStore = useEntityStore();
  const chartsContainer = useTemplateRef('over-chest');
  let myChart: echarts.EChartsType | undefined = undefined;
  function initChart() {
    console.log('test');
    myChart = echarts.init(chartsContainer.value);
    const option = {
      tooltip: {
        trigger: 'item',
      },
      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1],
        },
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: [
            { value: 335, name: '测试指标1' },
            { value: 310, name: '测试指标2' },
            { value: 274, name: '测试指标3' },
            { value: 235, name: '测试指标4' },
            { value: 400, name: '测试指标5' },
          ].sort(function (a, b) {
            return a.value - b.value;
          }),
          roseType: 'radius',
          label: {
            color: 'rgba(255, 255, 255, 0.3)',
          },
          labelLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)',
            },
            smooth: 0.2,
            length: 10,
            length2: 20,
          },
          itemStyle: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          },
        },
      ],
    };
    myChart.setOption(option);
  }
  const id = setInterval(() => {
    if (chartsContainer.value?.clientHeight != 0) {
      initChart();
      clearInterval(id);
    }
  }, 1000);
</script>

<style scoped lang="scss">
  .aircraft-info {
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
  :deep(.v-expansion-panel-title) {
    background-image: url('@/assets/aircraft-bg.png');
    background-size: 100% 100%;
  }
  .aircraft-overview {
    display: flex;
    flex-direction: column;
    padding: 8px 16px;
    gap: 8px;
  }
  .aircraft-overview-item {
    justify-content: space-between;
  }
  .aircraft-icon {
    margin-left: 2px;
  }
  .aircraft-list {
    width: 100%;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  #over-chest {
    width: 100%;
    z-index: inherit;
    aspect-ratio: 1 / 1; /* 宽高比1:1 */
  }
</style>
