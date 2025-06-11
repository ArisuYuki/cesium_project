<template>
  <div class="aircraft-bottom-panel">
    <div class="controller">
      <div class="controller-container">
        <div class="controller-out">
          <div v-show="leftBtnForward" class="mask-forward"></div>
          <div v-show="leftBtnBack" class="mask-back"></div>
          <div v-show="leftBtnLeft" class="mask-left"></div>
          <div v-show="leftBtnRight" class="mask-right"></div>
        </div>
        <div class="controller-in left"></div>
        <div class="controller-btn"></div>
      </div>
    </div>
    <RouterView>
      <template v-slot:default="{ Component }">
        <component :is="Component" />
      </template>
    </RouterView>
    <div class="controller">
      <div class="controller-container">
        <div class="controller-out">
          <div v-show="rightBtnForward" class="mask-forward"></div>
          <div v-show="rightBtnBack" class="mask-back"></div>
          <div v-show="rightBtnLeft" class="mask-left"></div>
          <div v-show="rightBtnRight" class="mask-right"></div>
        </div>
        <div class="controller-in right"></div>
        <div class="controller-btn"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onUnmounted } from 'vue';
  const leftBtnForward = ref(false);
  const leftBtnBack = ref(false);
  const leftBtnLeft = ref(false);
  const leftBtnRight = ref(false);
  const rightBtnForward = ref(false);
  const rightBtnBack = ref(false);
  const rightBtnLeft = ref(false);
  const rightBtnRight = ref(false);

  // @ts-expect-error: 缺少类型定义
  const keyup = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        rightBtnForward.value = false;
        break;
      case 'ArrowDown':
        rightBtnBack.value = false;
        break;
      case 'ArrowLeft':
        rightBtnLeft.value = false;
        break;
      case 'ArrowRight':
        rightBtnRight.value = false;
        break;
      case 'w':
        leftBtnForward.value = false;
        break;
      case 's':
        leftBtnBack.value = false;
        break;
      case 'a':
        leftBtnLeft.value = false;
        break;
      case 'd':
        leftBtnRight.value = false;
        break;
    }
  };
  // @ts-expect-error: 缺少类型定义
  const keydown = (e) => {
    e.preventDefault();
    switch (e.key) {
      case 'ArrowUp':
        rightBtnForward.value = true;
        break;
      case 'ArrowDown':
        rightBtnBack.value = true;
        break;
      case 'ArrowLeft':
        rightBtnLeft.value = true;
        break;
      case 'ArrowRight':
        rightBtnRight.value = true;
        break;
      case 'w':
        leftBtnForward.value = true;
        break;
      case 's':
        leftBtnBack.value = true;
        break;
      case 'a':
        leftBtnLeft.value = true;
        break;
      case 'd':
        leftBtnRight.value = true;
        break;
    }
  };
  //监听键盘按键
  window.addEventListener('keydown', keydown);
  window.addEventListener('keyup', keyup);
  /**
   * @description: 每秒发送更新位置请求,待做，必须配合服务器
   */


  onUnmounted(() => {
    window.removeEventListener('keydown', keydown);
    window.removeEventListener('keyup', keyup);
  });
</script>

<style scoped lang="scss">
  .aircraft-bottom-panel {
    width: 100%;
    height: 100%;
    display: flex;
  }
  .controller {
    height: 100%;
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .controller-container {
    width: 80%;
    height: 80%;
    position: relative;
  }
  .controller-out {
    position: absolute;
    background-image: url('@/assets/aircraft-circle.png');
    background-size: 100% 100%;
    height: 70%;
    aspect-ratio: 1 / 1; /* 宽高比1:1 */
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    filter: drop-shadow(0 0 10px #001477) drop-shadow(0 0 20px rgb(0, 0, 0))
      drop-shadow(0 0 30px rgba(85, 255, 255, 0.605));
    z-index: 999;
  }
  .controller-in {
    position: absolute;
    background-image: url('@/assets/circle_in.png');
    background-size: 100% 100%;
    height: 100%;
    aspect-ratio: 1 / 1; /* 宽高比1:1 */
    z-index: 1000;
    pointer-events: none;
  }
  .left {
    animation: rotate-in 30s linear infinite;
  }
  .right {
    animation: rotate-in 30s linear infinite reverse;
  }
  @keyframes rotate-in {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .controller-btn {
    position: absolute;
    background-image: url('@/assets/btn.png');
    background-size: 100% 100%;
    height: 80px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    aspect-ratio: 1 / 1; /* 宽高比1:1 */
    z-index: 1000;
    transition: all 0.1s ease-in-out;
  }
  .controller-btn:active {
    // filter: drop-shadow(0 0 10px #001477) drop-shadow(0 0 20px rgb(0, 0, 0))
    //   drop-shadow(0 0 30px rgba(85, 255, 255, 0.605));
    transform: translate(-50%, -50%) scale(0.9);
    cursor: pointer;
  }
  .mask-forward {
    position: absolute;
    width: 50%;
    height: 50%;
    // background-color: rgba(0, 1, 74, 0.459);
    border-radius: 100% 0 0 0;
    z-index: 1;
    background: linear-gradient(
      to left top,
      transparent,
      rgba(0, 0, 1, 0.459) 50%
    );
  }
  .mask-back {
    position: absolute;
    width: 50%;
    height: 50%;
    right: 0%;
    bottom: 0%;
    // background-color: rgba(0, 1, 74, 0.459);
    border-radius: 0 0 100% 0;
    z-index: 1;
    background: linear-gradient(
      to right bottom,
      transparent,
      rgba(0, 0, 1, 0.459) 50%
    );
  }
  .mask-left {
    position: absolute;
    width: 50%;
    height: 50%;
    // background-color: rgba(0, 1, 74, 0.459);
    border-radius: 0 0 0 100%;
    bottom: 0%;
    z-index: 1;
    background: linear-gradient(
      to left bottom,
      transparent,
      rgba(0, 0, 1, 0.459) 50%
    );
  }
  .mask-right {
    position: absolute;
    width: 50%;
    height: 50%;
    right: 0%;
    // background-color: rgba(0, 1, 74, 0.459);
    border-radius: 0 100% 0 0;
    z-index: 1;
    background: linear-gradient(
      to right top,
      transparent,
      rgba(0, 0, 1, 0.459) 50%
    );
  }
</style>
