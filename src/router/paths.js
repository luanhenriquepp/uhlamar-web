/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
import store from '../store'
export default [
  {
    path: '*',
    meta: {
      name: '',
      requiresAuth: true
    },
    redirect: {
      path: '/dashboard'
    }
  },
  // This  allows you to have pages apart of the app but no rendered inside the dash
  {
    path: '/',
    meta: {
      name: '',
      requiresAuth: false
    },
    component: () =>
      import(`@/views/LoginHome.vue`),
      beforeEnter: (to, from, next) => {
      if (store.getters.authorized) {
        next('/dashbaord')
      } else {
        next()
      }
    },
    children: [
      {
        path: '',
        component: () => import(`@/components/LoginForm.vue`)
      }
    ]
  },
  // add any extra routes that you want rendered in the dashboard as a child below. Change toolbar names here
  {
    path: '/dashboard',
    meta: {
      name: 'Dashboard View',
      requiresAuth: true
    },
    component: () => import(`@/views/DashboardView.vue`),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import(`@/components/DashViews/Dashboard.vue`)
      },
      {
        path: 'user-profile',
        meta: {
          name: 'User Profile',
          requiresAuth: true
        },
        component: () => import(`@/components/DashViews/UserProfile.vue`)
      },
      {
        path: 'table-list',
        meta: {
          name: 'Table List',
          requiresAuth: true
        },
        component: () => import(`@/components/DashViews/SimpleTables.vue`)
      },
      {
        path: 'purchase-table',
        meta: {
          name: 'Compras',
          requiresAuth: true
        },
        component: () => import(`@/components/DashViews/PurchaseTable.vue`)
      },
      {
        path: 'sale-table',
        meta: {
          name: 'Vendas',
          requiresAuth: true
        },
        component: () => import(`@/components/DashViews/SaleTable.vue`)
      },
      {
        path: 'stock-table',
        meta: {
          name: 'Estoque',
          requiresAuth: true
        },
        component: () => import(`@/components/DashViews/StockTable.vue`)
      },
      {
        path: 'coupon-table',
        meta: {
          name: 'Cupom',
          requiresAuth: true
        },
        component: () => import(`@/components/DashViews/CouponTable.vue`)
      },
      {
        path: 'tablestest',
        meta: {
          name: 'Complex Tables test',
          requiresAuth: true
        },
        component: () => import(`@/components/DashViews/TableList.vue`)
      },
      // {
      //   path: 'typography',
      //   meta: {
      //     name: 'Typography',
      //     requiresAuth: true
      //   },
      //   component: () => import(`@/components/DashViews/Typography.vue`)
      // },
      {
        path: 'icons',
        meta: {
          name: 'Icons',
          requiresAuth: true
        },
        component: () => import(`@/components/DashViews/Icons.vue`)
      },
      // {
      //   path: 'maps',
      //   meta: {
      //     name: 'Maps',
      //     requiresAuth: true
      //   },
      //   component: () => import(`@/components/DashViews/Maps.vue`)
      // },
      {
        path: 'notifications',
        meta: {
          name: 'Notifications',
          requiresAuth: true
        },
        component: () => import(`@/components/DashViews/Notifications.vue`)
      }
    ]
  }
]
