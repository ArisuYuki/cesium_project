import {type Aircraft} from '@/utils/aircraft';
import type { Entity } from 'cesium';
import { defineStore } from 'pinia';

export const useEntityStore = defineStore('entity', {
  state: () => ({
    //由绘制产生的实体
    draw: {
      point: [] as Entity[],
      line: [] as Entity[],
      polygon: [] as Entity[],
    },
    //当前选中的实体
    currentEntity: undefined as Entity | undefined,
    //所有的无人机
    aircraft: [] as Aircraft[],
  }),
});
