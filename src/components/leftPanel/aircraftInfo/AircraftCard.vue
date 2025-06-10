<template>
  <div class="aircraft-card">
    <v-expansion-panels variant="accordion">
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-icon icon="mdi-quadcopter"> </v-icon>
          <div class="aircraft-card-title">
            {{ prop.aircraft?.statusInfo.name }}
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="aircraft-info">
            <div class="power-bar">
              <div class="power-title text">电量</div>
              <v-progress-linear
                color="light-blue"
                height="10"
                :model-value="status?.power"
                striped
                rounded
              >
                <template v-slot:default="{ value }">
                  <div class="text">{{ value }}%</div>
                </template></v-progress-linear
              >
            </div>

            <div class="info-card">
              <div class="info-text-left">
                <v-icon icon="mdi-fan-off"></v-icon>
                <div class="text-content">待机中</div>
              </div>
              <div class="info-text-right">
                <v-icon icon="mdi-power-plug"></v-icon>
                <div class="text-content">充电中</div>
              </div>
            </div>
            <div class="info-card">
              <div class="info-text-left">
                <v-icon icon="mdi-speedometer"></v-icon>
                <div class="text-content">{{ status?.speed }}km/s</div>
              </div>
              <div class="info-text-right">
                <v-icon icon="mdi-wifi-strength-3"></v-icon>
                <div class="text-content">信号良好</div>
              </div>
            </div>

            <div class="action-btns">
              <v-btn
                variant="outlined"
                style="font-size: 12px"
                class="card-btn"
              >
                返航</v-btn
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
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
  import { useCesiumStore } from '@/store/cesiumStore';
  import { ref, onUnmounted } from 'vue';
  import { Aircraft } from '@/utils/aircraft';
  const cesiumStore = useCesiumStore();
  const prop = defineProps({
    aircraft: {
      type: Aircraft,
    },
  });
  const status = ref(prop.aircraft?.statusInfo.status);
  const updateStatus = (e: Event) => {
    status.value = (e as CustomEvent).detail;
  };
  prop.aircraft?.addEventListener('update', updateStatus);
  onUnmounted(() => {
    prop.aircraft?.removeEventListener('update', updateStatus);
  });
  function zoomTo() {
    cesiumStore.viewer!.flyTo(prop.aircraft!.aircraftEntity!);
  }
</script>

<style scoped lang="scss">
  .aircraft-card {
    display: flex;
    flex-direction: column;
  }
  .aircraft-card-title {
    width: 100%;
    text-align: center;
  }
  .aircraft-info {
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .power-title {
    margin-right: 8px;
    width: 36px;
  }
  .power-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .action-btns {
    display: flex;
    justify-content: space-between;
  }
  .card-btn {
    padding: 0;
  }
  .info-card {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .info-text-left {
    width: 50%;
    display: flex;
    align-items: center;
  }
  .info-text-right {
    width: 50%;
    display: flex;
    align-items: center;
  }
  .text-content {
    margin-left: 8px;
  }
</style>
