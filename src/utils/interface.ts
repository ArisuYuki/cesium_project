import { type Entity } from 'cesium';

/**
 * @description webStock传输的无人机状态信息
 **/
interface AircraftStatus {
  //飞机当前的经纬度和高
  location: [number, number, number];
  //飞机当前的姿态角，相对于世界坐标系
  orientation: [number, number, number];
  power: number;
  //飞机是否已经关机
  shutdown: boolean;
  //飞机的飞行速度
  speed: number;
}
/**
 * @description 无人机初始化状态接口
 **/
interface AircraftInfo {
  id: string;
  name: string;
  status: AircraftStatus;
  airline: number[][];
}

/**
 * @description 航线接口
 **/
interface Airline {
  id: string;
  name: string;
  airline: Entity;
  airpoint: Entity[];
}

export { type AircraftStatus, type AircraftInfo, type Airline };
