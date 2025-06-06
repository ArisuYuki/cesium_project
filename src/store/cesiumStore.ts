import { defineStore } from 'pinia';
import {
  Viewer,
  Ion,
  WebMapTileServiceImageryProvider,
  type ImageryLayer,
  Terrain,
  Color,
} from 'cesium';
type TMapType =
  | 'vec'
  | 'cva'
  | 'img'
  | 'cia'
  | 'ter'
  | 'cta'
  | 'ibo'
  | 'eva'
  | 'eia';
export const useCesiumStore = defineStore('cesium', {
  state: () => ({
    viewer: null as Viewer | null,
    longitude: 0,
    latitude: 0,
    height: 0,
    camera: {
      //相机坐标和角度
      longitude: 0,
      latitude: 0,
      height: 0,
      heading: 0,
      pitch: 0,
      roll: 0,
    },
    imageryProvider: {
      vectorLayer: null as unknown as ImageryLayer,
      imageLayer: null as unknown as ImageryLayer,
      annoLayer: null as unknown as ImageryLayer,
    },
  }),
  actions: {
    async setViewer(container_id: string) {
      Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjA3Njk3My00YTNhLTRjNTktOGY3Ni1lMmNjMWE0MDE4MTgiLCJpZCI6Mjk2NzMyLCJpYXQiOjE3NDgzNDUzODZ9.FvsX3IAYGuf2YkNJtF0YcSm6wvJgdWn-h5cJnB7dHgQ';
      const token = import.meta.env.VITE_MAP_WORLD_KEY;
      // 服务域名
      // 服务负载子域
      const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];

      const viewer = new Viewer(container_id, {
        terrain: Terrain.fromWorldTerrain(),
        orderIndependentTranslucency: false,
        contextOptions: {
          webgl: {
            alpha: true,
          },
        },
        skyBox: false,
        skyAtmosphere: false,
        animation: false, // 隐藏动画控件
        baseLayerPicker: false, // 隐藏底图选择器
        fullscreenButton: false, // 隐藏全屏按钮
        geocoder: false, // 隐藏地理编码搜索框
        homeButton: false, // 隐藏主页按钮
        infoBox: false, // 隐藏信息框
        sceneModePicker: false, // 隐藏场景模式选择器（2D/3D）
        selectionIndicator: false, // 隐藏选择指示器
        timeline: false, // 隐藏时间轴
        navigationHelpButton: false, // 隐藏导航帮助按钮
      });
      this.viewer = viewer;
      // viewer.scene.skyBox.show = false; // 隐藏天空盒（星空背景）
      // viewer.scene.sun.show = false; // 隐藏太阳
      // viewer.scene.moon.show = false; // 隐藏月亮
      // viewer.scene.skyAtmosphere.show = false; // 隐藏大气层效果
      viewer.scene.backgroundColor = new Color(0.0, 0.0, 0.0, 0.0);
      // viewer.scene.backgroundColor = Color.TRANSPARENT; // 设置背景颜色为黑色
      const vecURL =
        'http://t{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
        token;
      const imgURL =
        'http://t{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
        token;

      const annoURL =
        'http://t{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=' +
        token;

      this.imageryProvider.imageLayer =
        this.viewer?.imageryLayers.addImageryProvider(
          new WebMapTileServiceImageryProvider({
            url: imgURL,
            layer: 'img',
            style: 'default',
            format: 'image/jpeg',
            tileMatrixSetID: 'GoogleMapsCompatible',
            subdomains,
            maximumLevel: 18,
          })
        );
      this.imageryProvider.vectorLayer =
        this.viewer?.imageryLayers.addImageryProvider(
          new WebMapTileServiceImageryProvider({
            url: vecURL,
            layer: 'vec',
            style: 'default',
            format: 'image/jpeg',
            tileMatrixSetID: 'GoogleMapsCompatible',
            subdomains,
            maximumLevel: 18,
          })
        );
      this.imageryProvider.annoLayer =
        this.viewer?.imageryLayers.addImageryProvider(
          new WebMapTileServiceImageryProvider({
            url: annoURL,
            layer: 'cia',
            style: 'default',
            tileMatrixSetID: 'w',
            format: 'tiles',
            subdomains,
          })
        );

      this.imageryProvider.annoLayer.show = true;
    },

    setMapType(layer: TMapType) {
      if (layer == 'img') {
        this.imageryProvider.imageLayer.show = false;
        this.imageryProvider.vectorLayer.show = false;
      } else if (layer == 'vec') {
        this.imageryProvider.imageLayer.show = false;
        this.imageryProvider.vectorLayer.show = true;
      }
    },
  },
});
