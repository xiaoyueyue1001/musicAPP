import Vue from 'vue'
import Router from 'vue-router'

import Recommend from 'components/recommend/recommend'
import Rank from 'components/rank/rank'
import Singer from 'components/singer/singer'
import Search from 'components/search/search'
import SingerDetails from 'components/singer-details/singer-details'
import SongListDetails from 'components/songlist-details/songlist-details'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: SongListDetails
        }
      ]
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetails
        }
      ]
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/*',
      redirect: '/recommend'
    },
  ]
})
