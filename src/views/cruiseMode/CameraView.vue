<template>
  <div class="video-container">
    <video ref="videoPlayer" controls autoplay class="video-container"></video>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, useTemplateRef, watch } from 'vue';
  import { useEntityStore } from '@/store/entityStore';
  const currentAircraft = useEntityStore().currentAircraft!;
  const videoPlayer = useTemplateRef('videoPlayer');
  let mediaSource: MediaSource;
  let sourceBuffer: SourceBuffer;
  let ws: WebSocket;
  //拿到飞机的状态
  const statusInfo = ref(currentAircraft.statusInfo);
  //订阅一个更新状态的事件
  currentAircraft.addEventListener('update', (event) => {
    statusInfo.value.status = (event as CustomEvent).detail;
  });
  //待做
  
  onMounted(() => {
    const video = videoPlayer.value!;

    mediaSource = new MediaSource();
    video.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener('sourceopen', () => {
      sourceBuffer = mediaSource.addSourceBuffer(
        'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
      );
      //填写后端推流接口
      ws = new WebSocket('ws://xxx');
      ws.binaryType = 'arraybuffer';

      ws.onmessage = (event) => {
        if (sourceBuffer.updating === false) {
          sourceBuffer.appendBuffer(new Uint8Array(event.data));
        }
      };
    });
  });

onUnmounted(() => {
    //关闭webStock和流
    if (ws) ws.close();
    if (mediaSource) mediaSource.endOfStream();
  });
</script>
<style scoped lang="scss">
  .video-container {
    height: 100%;
    width: 100%;
  }
</style>
