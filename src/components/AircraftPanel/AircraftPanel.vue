<template>
  <div class="left-panel-viewer">
    <div class="panel-list main-color">
      <v-tabs direction="vertical" color="primary" v-model="tabs">
        <v-tab value="aircraft-info">
          <v-btn class="panel-item" variant="text">
            <v-icon icon="mdi-airplane-takeoff"></v-icon>
            <v-tooltip
              activator="parent"
              location="right"
              text="无人机状态"
            ></v-tooltip>
          </v-btn>
        </v-tab>
        <v-tab value="airline-design">
          <v-btn class="panel-item" variant="text">
            <v-icon icon="mdi-map-marker-multiple"></v-icon>
            <v-tooltip
              activator="parent"
              location="right"
              text="航线规划"
            ></v-tooltip>
          </v-btn>
        </v-tab>
        <v-tab value="airline-cruise">
          <v-btn class="panel-item" variant="text">
            <v-icon icon="mdi-road-variant"></v-icon>
            <v-tooltip
              activator="parent"
              location="right"
              text="路径巡航"
            ></v-tooltip>
          </v-btn>
        </v-tab>
        <v-tab value="asset-manage">
          <v-btn class="panel-item" variant="text">
            <v-icon icon="mdi-treasure-chest-outline"></v-icon>
            <v-tooltip
              activator="parent"
              location="right"
              text="资产管理"
            ></v-tooltip>
          </v-btn>
        </v-tab>
        <v-tab value="info-export">
          <v-btn class="panel-item" variant="text">
            <v-icon icon="mdi-information-slab-circle-outline"></v-icon>
            <v-tooltip
              activator="parent"
              location="right"
              text="信息导出"
            ></v-tooltip>
          </v-btn>
        </v-tab>
      </v-tabs>
    </div>
    <div class="panel-list-content">
      <div class="panel-list-content-item">
        <v-tabs-window v-model="tabs">
          <v-tabs-window-item value="aircraft-info">
            <AircraftInfo></AircraftInfo>
          </v-tabs-window-item>
          <v-tabs-window-item value="airline-design"> </v-tabs-window-item>
          <v-tabs-window-item value="airline-cruise"> </v-tabs-window-item>
          <v-tabs-window-item value="asset-manage"> </v-tabs-window-item>
          <v-tabs-window-item value="info-export"> </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  const tabs = ref('airline-info');
</script>

<style lang="scss" scoped>
  .left-panel-viewer {
    display: flex;
    height: 100%;
    width: 100%;
    background-image: url('@/assets/panel.png');
    background-size: 100% 100%;
  }
  .panel-list-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .panel-list {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  :deep(.v-tab.v-tab.v-btn) {
    min-width: 40px !important;
    height: 40px;
    padding: 0px;
    border-radius: 0px;
    padding: 0;
    font-size: 12px;
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
  .panel-item {
    min-width: 40px !important;
    height: 40px;
    padding: 0px;
    border-radius: 0px;
  }
  :deep(.v-tabs-window) {
    height: 100%;
    width: 100%;
  }
  :deep(.v-tabs-window-item) {
    height: 100%;
    width: 100%;
  }
</style>
