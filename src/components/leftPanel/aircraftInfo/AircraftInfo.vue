<template>
  <div class="aircraft-info">
    <div class="panel-title flex-center">无人机总控面板</div>
    <Sheet :reverse="true"></Sheet>
  </div>
</template>

<script setup lang="ts"></script>

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
</style>
