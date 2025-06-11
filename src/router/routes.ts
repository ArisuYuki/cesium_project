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
                path: 'point?id=:id',
                name: 'point',
                component: () =>
                  import('@/views/designMode/entity/PointEntity.vue'),
              },
              {
                path: 'line?id=:id',
                name: 'line',
                component: () =>
                  import('@/views/designMode/entity/LineEntity.vue'),
              },
              {
                path: 'polygon?id=:id',
                name: 'polygon',
                component: () =>
                  import('@/views/designMode/entity/PolygonEntity.vue'),
              },
              {
                path: 'aircraft?id=:id',
                name: 'aircraft',
                component: () =>
                  import('@/views/designMode/entity/AircraftEntity.vue'),
              },
              {
                path: 'airline?id=:id',
                name: 'airline',
                component: () =>
                  import('@/views/designMode/entity/AirlineEntity.vue'),
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
        children: [
          {
            path: 'aircraft?id=:id',
            name: 'cruise-aircraft',
            component: () =>
              import('@/views/cruiseMode/AircraftBottomPanel/AircraftInfo.vue'),
          },
        ],
      },
    ],
  },
];
export default routes;
