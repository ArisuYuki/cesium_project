<template>
  <v-dialog v-model="dialog" width="30%" max-height="80%" @after-leave="FClose">
    <Sheet>
      <template #title>
        选择颜色
        <v-btn
          @click="dialog = false"
          variant="text"
          size="24px"
          class="close-btn"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
      <template #content>
        <v-color-picker
          v-model="color"
          show-swatches
          class="color-picker"
          canvas-height="200"
          width="100%"
          swatches-max-height="200"
        ></v-color-picker>
      </template>
    </Sheet>
  </v-dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  const emit = defineEmits(['close-dialog']);
  const props = defineProps({
    color: {
      type: String,
      required: true,
    },
  });
  const color = ref(props.color);
  const dialog = ref(true);
  function FClose() {
    emit('close-dialog', color.value);
  }
</script>

<style lang="scss" scoped>
  .color-picker {
    background-color: rgba(6, 9, 51, 0.8);
  }
  ::-webkit-scrollbar {
    width: 5px;
  }
  .close-btn {
    position: absolute;
    right: 0;
  }
</style>
