/*
 * @Author: ArisuYuki a2648525976@gmail.com
 * @Date: 2025-06-06 10:50:32
 * @LastEditors: ArisuYuki a2648525976@gmail.com
 * @LastEditTime: 2025-06-06 12:12:26
 * @FilePath: /cesium_project/src/components/leftPanel/aircraftInfo/aircraft.ts
 * @Description:
 *
 * Copyright (c) 2025 by ArisuYuki, All Rights Reserved.
 */

/*
 *                   ___====-_  _-====___
 *             _--^^^#####//      \\#####^^^--_
 *          _-^##########// (    ) \\##########^-_
 *         -############//  |\^^/|  \\############-
 *       _/############//   (@::@)   \############\_
 *      /#############((     \\//     ))#############\
 *     -###############\\    (oo)    //###############-
 *    -#################\\  / VV \  //#################-
 *   -###################\\/      \//###################-
 *  _#/|##########/\######(   /\   )######/\##########|\#_
 *  |/ |#/\#/\#/\/  \#/\##\  |  |  /##/\#/  \/\#/\#/\#| \|
 *  `  |/  V  V  `   V  \#\| |  | |/#/  V   '  V  V  \|  '
 *     `   `  `      `   / | |  | | \   '      '  '   '
 *                      (  | |  | |  )
 *                     __\ | |  | | /__
 *                    (vvv(VVV)(VVV)vvv)
 *
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *                神兽保佑            永无BUG
 */

import { type Viewer } from 'cesium';
import { useCesiumStore } from '@/store/cesiumStore';
/**
 * @description 无人机初始化状态接口
 **/
interface AircraftInfo {
  id: number;
  name: string;
  type: string;
  status: string;
  location: string;
  airline: number[][];
}
//无人机实体
class Aircraft {
  public initInfo: AircraftInfo;
  public cesiumStore: ReturnType<typeof useCesiumStore>;
  public viewer: Viewer;
  constructor(initInfo: AircraftInfo) {
    this.initInfo = initInfo;
    //初始化全局cesium
    this.cesiumStore = useCesiumStore() as ReturnType<typeof useCesiumStore>;
    this.viewer = this.cesiumStore.viewer!;
  }

  /**
   * @description: 为无人机指定航线
   * @return {*}
   */
  indicateAirline() {
    //待做
  }

  /**
   * @description: 无人机停止飞行/开始飞行
   * @return {*}
   */
  takeOff() {
    //待做
  }

  /**
   * @description: 控制无人机姿态
   * @return {*}
   */
  control() {
    //待做
  }
}

export default Aircraft;
