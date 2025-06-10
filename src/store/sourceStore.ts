/*
 * @Author: ShirahaYuki  shirhayuki2002@gmail.com
 * @Date: 2025-06-02 19:10:52
 * @LastEditors: ShirahaYuki  shirhayuki2002@gmail.com
 * @LastEditTime: 2025-06-10 13:46:37
 * @FilePath: /cesium_project/src/store/sourceStore.ts
 * @Description:已挂载的资源
 *
 * Copyright (c) 2025 by ShirahaYuki, All Rights Reserved.
 */
import { defineStore } from 'pinia';

export const useSourceStore = defineStore('source', {
  //保存已装载在地图的资源(点云/三维模型/图像等)
  state: () => ({}),
});
