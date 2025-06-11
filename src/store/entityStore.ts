/*
 * @Author: ShirahaYuki  shirhayuki2002@gmail.com
 * @Date: 2025-06-01 21:11:57
 * @LastEditors: ShirahaYuki  shirhayuki2002@gmail.com
 * @LastEditTime: 2025-06-11 10:08:07
 * @FilePath: /cesium_project/src/store/entityStore.ts
 * @Description: 全局实体仓库，存储地图上的各种实体
 *
 * Copyright (c) 2025 by ShirahaYuki, All Rights Reserved.
 */
import { type Aircraft } from '@/utils/aircraft';
import { type Airline } from '@/utils/interface';
import type { Entity } from 'cesium';
import { defineStore } from 'pinia';

export const useEntityStore = defineStore('entity', {
  state: () => ({
    //地图上的点线面实体
    point: [] as Entity[],
    line: [] as Entity[],
    polygon: [] as Entity[],
    //当前选中的实体
    currentEntity: undefined as Entity | undefined,
    //所有的无人机实体
    aircraft: [] as Aircraft[],
    currentAircraft: undefined as Aircraft | undefined,
    //所有的航线实体
    airline: [] as Airline[],
  }),
});
