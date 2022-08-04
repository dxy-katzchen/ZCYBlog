import { defineStore } from 'pinia'
import ThemeColorSwitcher from './themeColorSwitcher'
import Drawer from './drawer'
import config from '../core/_config.yaml'
import { PostSet, drawerData } from '../core'

const { drawerList } = drawerData()

const useStore = defineStore('store', {
  state() {
    return {
      drawer: new Drawer(),
      drawerList: drawerList,
      themeColor: new ThemeColorSwitcher(),
      postSet: new PostSet(),
      randomImg: {
        api: 'https://www.dmoe.cc/random.php',
        randomNonce: 0,
      },
      scrollNode: null,
      scrollData: {
        routeHistory: [],
        currentScrollTop: 0,
      },
      config,
    }
  },
  getters: {

  },
  actions: {
    randomImgAPI() {
      this.randomImg.randomNonce = Math.round(Math.random() * 100000000)
      const nonce = this.randomImg.randomNonce
      const api = this.config.randomImgAPI || this.randomImg.api
      return `${api}?i=${nonce}`
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: sessionStorage,
        paths: [
          'themeColor',
          'drawer',
          'scrollData',
        ]
      },
      {
        storage: localStorage,
        paths: [
          'randomImg'
        ]
      }
    ]
  }
})

export default useStore