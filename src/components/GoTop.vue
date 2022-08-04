<script>
import GoTop from '../assets/svgs/GoTop.svg?vueComponent'
import useStore from '../store'

export default {
  data() {
    return {
      translateY: '',
      store: useStore(),
    }
  },
  components: { GoTop },
  computed: {
    scrollTop() {
      return this.store.scrollData.currentScrollTop
    },
    scrollNode() {
      return this.store.scrollNode
    }
  },
  watch: {
    scrollTop(now) {
      this.translateY = now === 0 ? '-100vh' : '0'
    },
  }
}
</script>

<template>
  <span @click="() => scrollNode.scrollTo({ top: 0 })" :class="$style.gotop" :style="'--h: ' + translateY">
    <GoTop />
  </span>
</template>

<style module>
.gotop {
  transition: 1s;
  transform: translateY(var(--h));
}
</style>