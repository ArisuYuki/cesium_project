<template>
  <div class="height-indicator">
    <div class="triangle-container">
      <div class="triangle">
        <div
          v-for="(level, index) in levels"
          :key="index"
          class="level-stripe"
          :style="{
            height: `${100 / levels}%`,
            bottom: `${index * (100 / levels)}%`,
            backgroundColor: getLevelColor(index),
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';

  const props = defineProps({
    width: {
      type: Number,
      default: 50,
    },
    height: {
      type: Number,
      default: 100,
    },
    levels: {
      type: Number,
      default: 5,
    },
    minValue: {
      type: Number,
      default: 0,
    },
    maxValue: {
      type: Number,
      default: 100,
    },
  });

  const labels = ref(
    Array.from({ length: props.levels + 1 }, (_, i) =>
      Math.round(
        props.minValue + (props.maxValue - props.minValue) * (i / props.levels)
      )
    )
  );

  const getLevelColor = (index: number) => {
    const ratio = index / (props.levels - 1);
    const r = Math.round(255 * ratio);
    const g = Math.round(255 * (1 - ratio));
    return `rgb(${r}, ${g}, 0)`;
  };
</script>

<style scoped lang="scss">
  .height-indicator {
    position: relative;
    display: inline-block;
    height: 100%;
    width: v-bind('props.width + 30 + "px"');
  }

  .triangle-container {
    position: relative;
    width: v-bind('props.width + "px"');
    height: 100%;
    overflow: hidden;
  }

  .triangle {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100%;
    clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
  }

  .level-stripe {
    position: absolute;
    width: 100%;
    border-bottom: 1px dashed #000;
    box-sizing: border-box;
  }

  .labels {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 30px;
  }

  .label {
    position: absolute;
    transform: translateY(50%);
    font-size: 12px;
    color: #333;
  }
</style>
