import { type Entity } from 'cesium';

/**
 * @description webStock传输的无人机状态信息
 **/
interface AircraftStatus {
  location: [number, number, number];
  power: number;
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
