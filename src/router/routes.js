

export default[
    {
      path: '/',
      name: 'start',
      component: () => import('../views/start.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/home.vue')
    }
]