import { defineStore } from 'pinia';

export const useSourceStore = defineStore('source', {
  //保存已装载在地图的资源(点云/三维模型/图像等)
  state: () => ({}),
});
