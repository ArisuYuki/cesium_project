<template>
  <div class="info-window">
    <div>
      <v-selected>
        <v-select
          v-model="selectID"
          label="选择航线"
          :items="airlines"
          item-value="id"
          item-title="name"
        >
        </v-select>
      </v-selected>
      <v-btn @click="startCruise">开始巡航</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useEntityStore } from '@/store/entityStore';
  import { Math, Cartographic } from 'cesium';
  import { type AircraftStatus } from '@/utils/interface';
  const entityStore = useEntityStore();
  const airlines = ref(
    entityStore.airline.map((item) => {
      return {
        name: item.name,
        id: item.id,
      };
    })
  );
  const selectID = ref('');
  function startCruise() {
    const airline = entityStore.airline.find((item) => {
      return item.id === selectID.value;
    });
    if (!airline) return;
    let i = 0;
    const currentAircraft = entityStore.currentAircraft!;
    const id = setInterval(() => {
      if (i == airline.airpoint.length) {
        clearInterval(id);
      } else {
        const pointPos = airline.airpoint[i].position!.getValue()!;
        const pos = Cartographic.fromCartesian(pointPos);
        const newStatus: AircraftStatus = {
          location: [
            Math.toDegrees(pos.longitude),
            Math.toDegrees(pos.latitude),
            pos.height,
          ],
          orientation: [0, 0, 0],
          power: 100,
          shutdown: false,
          speed: 0,
        };
        currentAircraft.updata(newStatus);
        i += 1;
      }
    }, 3000);
  }
</script>

<style scoped lang="scss">
  .info-window {
    flex: 1;
    overflow: scroll;
  }
</style>
