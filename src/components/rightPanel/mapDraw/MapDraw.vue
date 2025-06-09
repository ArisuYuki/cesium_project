<template>
  <div class="draw-map">
    <div class="draw-map-content">
      <v-tabs v-model="tab" grow color="primary">
        <v-tab value="point" class="tab">
          <div>
            <v-icon icon="mdi-vector-point"> </v-icon>
            点
          </div>
        </v-tab>
        <v-tab value="line" class="tab">
          <div>
            <v-icon icon="mdi-vector-line"> </v-icon>
            线
          </div>
        </v-tab>
        <v-tab value="polygon" class="tab">
          <div>
            <v-icon icon="mdi-vector-polygon"> </v-icon>
            面
          </div>
        </v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="point">
          <div class="tab-window">
            <PointDrawer />
          </div>
        </v-tabs-window-item>
        <v-tabs-window-item value="line">
          <div class="tab-window">
            <LineDrawer />
          </div>
        </v-tabs-window-item>
        <v-tabs-window-item value="polygon">
          <div class="tab-window">
            <PolygonDrawer />
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import PointDrawer from './PointDrawer.vue';
  import LineDrawer from './LineDrawer.vue';
  import PolygonDrawer from './PolygonDrawer.vue';
  const tab = ref('point');
</script>

<style scoped lang="scss">
  .draw-map {
    padding: 8px;
  }
  .draw-map-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .tab-window {
    padding: 10px 0px;
  }
</style>
