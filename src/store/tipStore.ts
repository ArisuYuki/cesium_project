/*
 * @Author: ShirahaYuki  shirhayuki2002@gmail.com
 * @Date: 2025-06-02 22:33:05
 * @LastEditors: ShirahaYuki  shirhayuki2002@gmail.com
 * @LastEditTime: 2025-06-10 13:46:17
 * @FilePath: /cesium_project/src/store/tipStore.ts
 * @Description:更新Tip提示状态仓库
 *
 * Copyright (c) 2025 by ShirahaYuki, All Rights Reserved.
 */
import { defineStore } from 'pinia';

export const useTipStore = defineStore('tips', {
  state: () => ({
    tip: '',
  }),
});
