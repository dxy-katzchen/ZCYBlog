import { createRouter, createWebHashHistory } from "vue-router"
import useStore from "../store"
import { drawerData } from '../core'

const { drawerModules } = drawerData()

const routes = [
  {
    path: "/",
    components: {
      default: () => import("../views/layout/index.vue"),
      ...drawerModules
    },
    children: [
      {
        path: '',
        name: "HomePage",
        component: () => import("../views/HomePage/index.vue")
      },
      {
        path: 'detail/:id',
        name: 'DetailPage',
        props: route => ({ id: route.params.id }),
        component: () => import('../views/DetailPage/index.vue')
      }
    ]
  },
]

const Router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 进入新路由时回到顶部, 路由回退时回到历史高度
Router.beforeEach((to, from) => {
  const store = useStore()
  const scrollNode = store.scrollNode
  if (!scrollNode) return true

  if (to.fullPath === store.scrollData.routeHistory.at(-1)?.path) {
    const preRoute = store.scrollData.routeHistory.pop()
    scrollNode.scrollTo({ top: preRoute.scrollTop })
  } else {
    store.scrollData.routeHistory.push({
      path: from.fullPath,
      scrollTop: scrollNode.scrollTop
    })
    scrollNode.scrollTo({ top: 0 })
  }
})

export default Router
