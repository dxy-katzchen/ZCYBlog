<script>
import Drawer from './components/Drawer.vue'
import useStore from './store'
import live2dInit from './utils/live2DwImport'

export default {
  data() {
    return {
      store: useStore(),
    };
  },
  components: { Drawer },
  computed: {
    drawerList() {
      return this.store.drawerList
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.store.themeColor.initThemeColor()
      live2dInit()
    })
  }
}
</script>

<template>
  <!-- 侧栏 -->
  <Drawer v-for="(item, index) of drawerList" :data="item" :key="index" :index="index" />
  <!-- 主界面 -->
  <div style="width: 100vw;height: 100vh;">
    <router-view />
  </div>
</template>

