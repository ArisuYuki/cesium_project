/*
 *                                                     __----~~~~~~~~~~~------___
 *                                    .  .   ~~//====......          __--~ ~~
 *                    -.            \_|//     |||\\  ~~~~~~::::... /~
 *                 ___-==_       _-~o~  \/    |||  \\            _/~~-
 *         __---~~~.==~||\=_    -_--~/_-~|-   |\\   \\        _/~
 *     _-~~     .=~    |  \\-_    '-~7  /-   /  ||    \      /
 *   .~       .~       |   \\ -_    /  /-   /   ||      \   /
 *  /  ____  /         |     \\ ~-_/  /|- _/   .||       \ /
 *  |~~    ~~|--~~~~--_ \     ~==-/   | \~--===~~        .\
 *           '         ~-|      /|    |-~\~~       __--~~
 *                       |-~~-_/ |    |   ~\_   _-~            /\
 *                            /  \     \__   \/~                \__
 *                        _--~ _/ | .-~~____--~-/                  ~~==.
 *                       ((->/~   '.|||' -_|    ~~-/ ,              . _||
 *                                  -_     ~\      ~~---l__i__i__i--~~_/
 *                                  _-~-__   ~)  \--______________--~~
 *                                //.-~~~-~_--~- |-------~~~~~~~~
 *                                       //.-~~~--\
 *                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *                               神兽保佑            永无BUG
 */

/*
 * @Author: ShirahaYuki  shirhayuki2002@gmail.com
 * @Date: 2025-06-06 10:50:32
 * @LastEditors: ShirahaYuki  shirhayuki2002@gmail.com
 * @LastEditTime: 2025-06-10 13:08:59
 * @FilePath: /cesium_project/src/utils/aircraft.ts
 * @Description: 无人机相关代码
 *
 * Copyright (c) 2025 by ShirahaYuki, All Rights Reserved.
 */

import {
  type Entity,
  type Viewer,
  Quaternion,
  Cartesian3,
  JulianDate,
  CallbackPositionProperty,
  VelocityOrientationProperty,
  PerspectiveFrustum,
  GeometryInstance,
  FrustumGeometry,
  VertexFormat,
  ColorGeometryInstanceAttribute,
  FrustumOutlineGeometry,
  PerInstanceColorAppearance,
  Primitive,
  Color,
  Math,
  LabelStyle,
  VerticalOrigin,
  HorizontalOrigin,
  Cartesian2,
  HeadingPitchRoll,
  Transforms,
  Matrix4,
  Matrix3,
  Ellipsoid,
  // IonResource,
} from 'cesium';
import { useCesiumStore } from '@/store/cesiumStore';
// @ts-expect-error: 模型资源文件
import aircraftModel from '@/assets/aircraft-model.glb';
import { type AircraftInfo, type AircraftStatus } from './interface';

const cesiumStore = useCesiumStore();

/**
 * @description: 无人机类，继承EventTarget添加事件的能力
 */
class Aircraft extends EventTarget {
  public statusInfo: AircraftInfo;
  public viewer: Viewer;
  public aircraftEntity: Entity | undefined;
  public airLine: CallbackPositionProperty | undefined;
  public currentLocation: Cartesian3;
  public currentOrientation: Quaternion;
  public socket: WebSocket;
  public frustumPrimitive: Primitive | undefined;
  public frustumOutlinePrimitive: Primitive | undefined;
  public orientation: Quaternion | undefined;
  public pointIndex: number;
  constructor(initInfo: AircraftInfo) {
    super();
    this.statusInfo = initInfo;
    this.pointIndex = 0;
    //初始化全局cesium
    this.viewer = cesiumStore.viewer!;
    this.socket = new WebSocket('/aircraft/info?id=' + this.statusInfo.id);
    this.aircraftEntity = undefined;
    this.airLine = undefined;

    this.currentLocation = Cartesian3.fromDegrees(
      this.statusInfo.status.location[0],
      this.statusInfo.status.location[1],
      this.statusInfo.status.location[2]
    );
    this.currentOrientation = Transforms.headingPitchRollQuaternion(
      this.currentLocation,
      new HeadingPitchRoll(
        this.statusInfo.status.orientation[0],
        this.statusInfo.status.orientation[1],
        this.statusInfo.status.orientation[2]
      )
    );
    this.init();
  }

  async init() {
    if (!cesiumStore.viewer) {
      alert('请先初始化viewer');
      return;
    }
    // const aircraft = await IonResource.fromAssetId(3442886);

    this.airLine = new CallbackPositionProperty(
      (_time?: JulianDate, result?: Cartesian3) => {
        //更新可视锥
        this.addFrustum(
          this.currentLocation,
          40,
          1,
          this.statusInfo.status.location[2]
        );
        return this.currentLocation;
      },
      false // 不缓存，每次都重新计算
    );
    // const resource = await IonResource.fromAssetId(3442328);
    // 使用 CallbackProperty 动态更新位置
    this.aircraftEntity = cesiumStore.viewer!.entities.add({
      position: this.airLine,
      model: {
        uri: aircraftModel,
        // uri: resource,
        scale: 1,
      },
      // orientation: new VelocityOrientationProperty(this.airLine), // 自动计算朝向
      orientation: this.currentOrientation,
      path: { width: 3 }, // 显示飞行路径
      viewFrom: new Cartesian3(-100, 0, 10),
      description: JSON.stringify({
        type: 'aircraft',
        description: '',
      }),
      label: {
        text: this.statusInfo.name, // 显示的文字内容
        font: '12pt sans-serif', // 字体设置
        fillColor: Color.WHITE, // 文字颜色
        outlineColor: Color.BLACK, // 文字描边颜色
        outlineWidth: 2, // 描边宽度
        style: LabelStyle.FILL_AND_OUTLINE, // 样式
        verticalOrigin: VerticalOrigin.BOTTOM, // 垂直对齐
        horizontalOrigin: HorizontalOrigin.CENTER, // 水平对齐
        pixelOffset: new Cartesian2(0, -20), // 偏移量(像素)
      },
    });
    //添加更新事件，更新无人机状态
    this.addEventListener('update', (event) => {
      this.updateState((event as CustomEvent).detail);
    });

    //接收到更新信息时候分发更新事件
    this.socket.addEventListener('message', (event: MessageEvent) => {
      const newState = JSON.parse(event.data) as AircraftStatus;
      this.dispatchEvent(new CustomEvent('update', { detail: newState }));
    });
  }
  /**
   * @description: 更新无人机状态
   * @param {AircraftStatus} newState：服务器传递过来的新状态
   * @return {*}
   */
  updateState(newState: AircraftStatus): void {
    this.statusInfo.status = newState;
    this.currentLocation = Cartesian3.fromDegrees(
      newState.location[0],
      newState.location[1],
      newState.location[2]
    );
    this.currentOrientation = Quaternion.fromHeadingPitchRoll(
      new HeadingPitchRoll(
        newState.orientation[0],
        newState.orientation[1],
        newState.orientation[2]
      )
    );

    // @ts-expect-error: 缺少属性
    this.aircraftEntity!.orientation = Quaternion.fromHeadingPitchRoll(
      new HeadingPitchRoll(
        newState.orientation[0],
        newState.orientation[1],
        newState.orientation[2]
      )
    );
  }
  /**
   * 计算朝向四元数
   * X轴正向指向运动方向；Y轴在水平面内垂直于X轴，正向指向右侧；Z轴通过右手法则确定
   * @param {Cartesian3} position 位置
   * @param {Cartesian3} velocity 速度向量
   * @param {*} rotateX 绕X轴旋转的角度（roll）
   * @param {*} rotateY 绕Y轴旋转的角度（pitch）
   * @param {*} rotateZ 绕Z轴旋转的角度（heading）
   * @returns
   */
  getQuaternion(
    position: Cartesian3,
    velocity: Cartesian3,
    rotateX: number,
    rotateY: number,
    rotateZ: number
  ) {
    // 1、计算站心到模型坐标系的旋转平移矩阵
    // 速度归一化
    const normal = Cartesian3.normalize(velocity, new Cartesian3());
    // 计算模型坐标系的旋转矩阵
    const satRotationMatrix = Transforms.rotationMatrixFromPositionVelocity(
      position,
      normal,
      Ellipsoid.WGS84
    );
    // 模型坐标系到地固坐标系旋转平移矩阵
    const m = Matrix4.fromRotationTranslation(satRotationMatrix, position);
    // 站心坐标系（东北天坐标系）到地固坐标系旋转平移矩阵
    const m1 = Transforms.eastNorthUpToFixedFrame(
      position,
      Ellipsoid.WGS84,
      new Matrix4()
    );
    // 站心到模型坐标系的旋转平移矩阵
    const m3 = Matrix4.multiply(
      Matrix4.inverse(m1, new Matrix4()),
      m,
      new Matrix4()
    );

    // 2、模型姿态旋转矩阵
    rotateX = rotateX || 0;
    rotateY = rotateY || 0;
    rotateZ = rotateZ || 0;
    const heading = rotateZ,
      pitch = rotateY,
      roll = rotateX;
    const postureHpr = new HeadingPitchRoll(
      Math.toRadians(heading),
      Math.toRadians(pitch),
      Math.toRadians(roll)
    );
    const postureMatrix = Matrix3.fromHeadingPitchRoll(postureHpr);

    // 3、最终的旋转矩阵
    const mat3 = Matrix4.getMatrix3(m3, new Matrix3());
    const finalMatrix = Matrix3.multiply(mat3, postureMatrix, new Matrix3());
    const quaternion1 = Quaternion.fromRotationMatrix(finalMatrix);
    const hpr = HeadingPitchRoll.fromQuaternion(quaternion1);
    const q2 = Transforms.headingPitchRollQuaternion(position, hpr);
    return q2;
  }

  /**
   * @description: 为无人机指定航线
   * @return {*}
   */
  indicateAirline(): void {
    //待做
  }

  /**
   * @description: 无人机停止飞行/开始飞行
   * @return {*}
   */
  takeOff(): void {
    //待做
  }

  /**
   * @description: 控制无人机姿态
   * @return {*}
   */
  control(): void {
    //待做
  }

  /**
   * @description: 添加视锥体
   * @param {*} position: 飞机位置
   * @param {*} orientation：飞机姿态
   * @param {*} fov: 飞机视场角
   * @param {*} near: 近截面的距离
   * @param {*} far: 远截面的距离
   * @param {*} aspectRatio: 平面的宽高比
   * @return {*}
   */
  addFrustum(
    position: Cartesian3,
    fov = 30,
    near = 1,
    far = 500,
    aspectRatio = 1
  ): void {
    if (this.frustumPrimitive || this.frustumOutlinePrimitive) {
      cesiumStore.viewer!.scene.primitives.remove(this.frustumPrimitive);
      cesiumStore.viewer!.scene.primitives.remove(this.frustumOutlinePrimitive);
      this.frustumPrimitive = undefined;
      this.frustumOutlinePrimitive = undefined;
    }
    const flipQuaternion = Quaternion.fromAxisAngle(
      Cartesian3.UNIT_X, // 绕 X 轴
      Math.PI // 旋转 180 度
    );
    const newQuaternion = Quaternion.multiply(
      this.currentOrientation,
      flipQuaternion,
      new Quaternion()
    );
    //创建时锥体
    const frustum = new PerspectiveFrustum({
      fov: Math.toRadians(fov),
      aspectRatio: aspectRatio,
      near: near,
      far: far,
    });
    const instanceGeo = new GeometryInstance({
      geometry: new FrustumGeometry({
        frustum: frustum,
        origin: position,
        orientation: newQuaternion,
        vertexFormat: VertexFormat.POSITION_ONLY,
      }),
      attributes: {
        color: ColorGeometryInstanceAttribute.fromColor(
          new Color(0.0, 0.0, 1.0, 0.3)
        ),
      },
    });
    //创建边框线
    const instanceGeoLine = new GeometryInstance({
      geometry: new FrustumOutlineGeometry({
        frustum: frustum,
        origin: position,
        orientation: newQuaternion,
      }),
      attributes: {
        color: ColorGeometryInstanceAttribute.fromColor(
          new Color(1.0, 1.0, 1.0, 1)
        ),
      },
    });
    //创建实体
    const primitive = new Primitive({
      geometryInstances: [instanceGeo],
      appearance: new PerInstanceColorAppearance({
        closed: true,
        flat: true,
      }),
      asynchronous: false,
    });

    const primitive1 = new Primitive({
      geometryInstances: [instanceGeoLine],
      appearance: new PerInstanceColorAppearance({
        closed: true,
        flat: true,
      }),
      asynchronous: false,
    });
    this.frustumPrimitive = cesiumStore.viewer!.scene.primitives.add(primitive);
    this.frustumOutlinePrimitive =
      cesiumStore.viewer!.scene.primitives.add(primitive1);
  }
}

export { type AircraftInfo, Aircraft, type AircraftStatus };
