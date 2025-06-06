import { type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/pages/Layout.vue'),
    redirect: 'design',
    children: [
      {
        path: 'design',
        name: 'design',
        redirect: { name: 'state' },
        component: () => import('@/views/DesignMode.vue'),
        children: [
          {
            path: 'entity',
            name: 'entity',
            component: () => import('@/views/designMode/entity/Entity.vue'),
            children: [
              {
                path: 'point',
                name: 'point',
                component: () =>
                  import('@/views/designMode/entity/PointEntity.vue'),
              },
              {
                path: 'line',
                name: 'line',
                component: () =>
                  import('@/views/designMode/entity/LineEntity.vue'),
              },
              {
                path: 'polygon',
                name: 'polygon',
                component: () =>
                  import('@/views/designMode/entity/PolygonEntity.vue'),
              },
              {
                path: 'aircraft',
                name: 'aircraft',
                component: () =>
                  import('@/views/designMode/entity/AircraftEntity.vue'),
              },
            ],
          },
          {
            path: 'state',
            name: 'state',
            component: () => import('@/views/designMode/state/State.vue'),
          },
        ],
      },
      {
        path: 'cruise',
        name: 'cruise',
        component: () => import('@/views/CruiseMode.vue'),
      },
    ],
  },
];
export default routes;
